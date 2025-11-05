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

    // Set the live stream URL
    videoElement.src = LIVE_STREAM_URL;

    // Append to container
    videoContainer.appendChild(videoElement);

    console.log('Video element created with source:', LIVE_STREAM_URL);

    // Auto-play for browser testing (fallback if no LDSK player)
    // This will attempt to play after video metadata loads
    videoElement.addEventListener('loadedmetadata', () => {
        console.log('Video metadata loaded, attempting auto-play...');
        videoElement.play()
            .then(() => {
                console.log('✅ Video playing successfully');
            })
            .catch(error => {
                console.warn('Auto-play failed (waiting for LDSK PLAY event):', error.message);
            });
    });

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
