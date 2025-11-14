// Configuration
const STREAM_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

// LDSK Events
const EVENTS = {
    PLAYER_CONFIGURATION: 'PLAYER_CONFIGURATION',
    PLAY: 'PLAY',
    CREATIVE_READY: 'CREATIVE_READY'
};

let videoElement = null;
let hls = null;

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

    container.appendChild(videoElement);

    // Disable text tracks
    videoElement.addEventListener('loadedmetadata', disableTextTracks);
    videoElement.addEventListener('addtrack', disableTextTracks);
    setInterval(disableTextTracks, 500);

    // Setup HLS
    if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(STREAM_URL);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play().catch(e => console.warn('Autoplay failed:', e));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hls.recoverMediaError();
                        break;
                    default:
                        hls.destroy();
                        break;
                }
            }
        });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = STREAM_URL;
        videoElement.addEventListener('loadedmetadata', () => {
            videoElement.play().catch(e => console.warn('Autoplay failed:', e));
        });
    }

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
