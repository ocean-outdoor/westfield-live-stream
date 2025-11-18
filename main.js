// Configuration
// For local testing: Using MP4 (works in all browsers)
// For LDSK production: Replace with your HLS stream URL (.m3u8)
const STREAM_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// LDSK Events
const EVENTS = {
    PLAYER_CONFIGURATION: 'PLAYER_CONFIGURATION',
    PLAY: 'PLAY',
    CREATIVE_READY: 'CREATIVE_READY'
};

let videoElement = null;

// Send message to LDSK player
function sendToPlayer(eventType, payload = {}) {
    window.parent.postMessage({
        type: 'ldsk',
        eventType: eventType,
        payload: payload
    }, '*');
}

// Disable subtitles/captions
function disableTextTracks() {
    if (videoElement && videoElement.textTracks) {
        for (let i = 0; i < videoElement.textTracks.length; i++) {
            videoElement.textTracks[i].mode = 'hidden';
        }
    }
}

// Initialize video
function initVideo() {
    const container = document.getElementById('video-container');

    videoElement = document.createElement('video');
    videoElement.muted = true;
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.controls = false;
    videoElement.loop = true; // Loop for testing
    videoElement.src = STREAM_URL;

    container.appendChild(videoElement);

    // Disable text tracks
    videoElement.addEventListener('loadedmetadata', disableTextTracks);
    videoElement.addEventListener('addtrack', disableTextTracks);
    setInterval(disableTextTracks, 500);

    // Auto-play when ready
    videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play().catch(e => console.warn('Autoplay failed:', e));
    });

    // Handle errors
    videoElement.addEventListener('error', (e) => {
        console.error('Video error:', e);
    });

    sendToPlayer(EVENTS.CREATIVE_READY);
}

// Handle LDSK player messages
function handlePlayerMessage(event) {
    if (!event.data || event.data.type !== 'ldsk') return;

    switch (event.data.eventType) {
        case EVENTS.PLAYER_CONFIGURATION:
            // Handle player configuration if needed
            break;

        case EVENTS.PLAY:
            if (videoElement) {
                videoElement.play().catch(e => console.error('Play failed:', e));
            }
            break;
    }
}

// Initialize
window.addEventListener('message', handlePlayerMessage);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideo);
} else {
    initVideo();
}
