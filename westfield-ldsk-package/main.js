/**
 * Westfield Live Stream - LDSK Creative
 *
 * IMPORTANT: Replace the LIVE_STREAM_URL with your actual live stream URL
 */

// ========== CONFIGURATION - REPLACE THESE VALUES ==========
const LIVE_STREAM_URL = 'YOUR_LIVE_STREAM_URL_HERE'; // Replace with your HLS/DASH stream URL
// ===========================================================

// LDSK Event Types
const EVENTS = {
    PLAYER_CONFIGURATION: 'PLAYER_CONFIGURATION',
    PLAY: 'PLAY',
    CREATIVE_READY: 'CREATIVE_READY'
};

let videoElement = null;

/**
 * Send messages to the LDSK player
 */
function postMessageToParent(eventType, payload = {}) {
    const message = {
        type: 'ldsk',
        eventType: eventType,
        payload: payload
    };
    window.parent.postMessage(message, '*');
    console.log('Sent to LDSK player:', message);
}

/**
 * Initialize the creative
 */
function initCreative() {
    // Create video element programmatically (REQUIRED for Samsung Tizen screens)
    const videoContainer = document.getElementById('video-container');

    videoElement = document.createElement('video');
    videoElement.className = 'live-stream';
    videoElement.id = 'live-stream-player';
    videoElement.muted = true; // Required for autoplay
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.loop = false;

    // Append to container
    videoContainer.appendChild(videoElement);

    console.log('Video element created');

    // Check if HLS.js is supported and needed
    if (Hls.isSupported()) {
        // Use HLS.js for browsers that don't support HLS natively (Chrome, Firefox, etc.)
        console.log('Using HLS.js for stream playback');
        const hls = new Hls({
            debug: false, // Disable debug logs in production
            enableWorker: true,
            lowLatencyMode: false,
        });

        hls.loadSource(LIVE_STREAM_URL);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest parsed, attempting playback...');
            videoElement.play()
                .then(() => {
                    console.log('✅ Video playing successfully with HLS.js');
                })
                .catch(error => {
                    console.warn('Auto-play failed:', error.message);
                });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('❌ HLS.js error:', data.type, data.details);
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error('Fatal network error, trying to recover...');
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error('Fatal media error, trying to recover...');
                        hls.recoverMediaError();
                        break;
                    default:
                        console.error('Fatal error, cannot recover');
                        hls.destroy();
                        break;
                }
            }
        });
    }
    // For Safari or browsers with native HLS support
    else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Using native HLS support');
        videoElement.src = LIVE_STREAM_URL;

        videoElement.addEventListener('loadedmetadata', () => {
            console.log('Video metadata loaded, attempting auto-play...');
            videoElement.play()
                .then(() => {
                    console.log('✅ Video playing successfully');
                })
                .catch(error => {
                    console.warn('Auto-play failed:', error.message);
                });
        });
    }
    else {
        console.error('❌ HLS is not supported in this browser');
    }

    // Handle video errors
    videoElement.addEventListener('error', (e) => {
        console.error('❌ Video error:', e);
        if (videoElement.error) {
            console.error('Error details:', {
                code: videoElement.error.code,
                message: videoElement.error.message
            });
        }
    });

    // Notify LDSK player that creative is ready
    postMessageToParent(EVENTS.CREATIVE_READY);
}

/**
 * Handle LDSK player events
 */
function handlePlayerMessage(event) {
    // Verify message is from LDSK player
    if (!event.data || event.data.type !== 'ldsk') {
        return;
    }

    console.log('Received from LDSK player:', event.data);

    switch (event.data.eventType) {
        case EVENTS.PLAYER_CONFIGURATION:
            // Received player configuration with inventory data
            const inventoryData = event.data.payload;
            console.log('Player configuration:', inventoryData);

            // Optional: Use inventory data for dynamic content
            // Example: if (inventoryData.inventory.attributes.city === 'Los Angeles') { ... }
            break;

        case EVENTS.PLAY:
            // Start playback
            if (videoElement) {
                videoElement.play()
                    .then(() => {
                        console.log('Playback started');
                    })
                    .catch(error => {
                        console.error('Playback failed:', error);
                    });
            }
            break;
    }
}

// Listen for messages from LDSK player
window.addEventListener('message', handlePlayerMessage);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCreative);
} else {
    initCreative();
}
