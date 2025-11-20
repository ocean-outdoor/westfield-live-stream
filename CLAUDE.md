# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains HTML5 creative packages for the **LiveDOOH Signkick (LDSK)** digital signage platform. The primary deliverable is the **westfield-ldsk-test** package, which displays live HLS streams with branded frame overlays. The **ldsk-dynamic-samples-main** directory provides reference implementations demonstrating LDSK platform patterns.

## Development Commands

### Testing Westfield Package

The Westfield package includes a player simulator for local testing:

```bash
cd westfield-ldsk-test
npm install
npm start  # Opens player-simulator.html at http://localhost:8080
```

The player simulator loads `index.html` in an iframe and simulates LDSK player events. Watch the browser console to see postMessage communication (PLAYER_CONFIGURATION sent immediately, PLAY sent after 5 seconds).

### Testing Sample Creatives

The sample projects also include player simulators:

```bash
# Navigate to either sample project
cd ldsk-dynamic-samples-main/basic-workflow
# or
cd ldsk-dynamic-samples-main/optimized-with-caching

# Install dependencies and start local server
npm install
npm start  # Opens player-simulator.html at http://localhost:8080
```

## LDSK Platform Architecture

### Communication Model

All LDSK creatives communicate with the player using the **postMessage API**. The sequence is:

1. **Player → Creative**: `PLAYER_CONFIGURATION` event (contains inventory/location data)
2. **Creative → Player**: Process configuration, optionally send `MEDIA_REQUEST` for cached assets
3. **Player → Creative**: `MEDIA_RESPONSE` with local URLs (if media caching requested)
4. **Creative → Player**: `CREATIVE_READY` event (signals creative is initialized)
5. **Player → Creative**: `PLAY` event (signals exact playback start time)

**CRITICAL**: Creatives must NOT autoplay content. Video/audio playback should only begin when the `PLAY` event is received from the player. Load and prepare media during initialization, send `CREATIVE_READY` when ready, then wait for `PLAY` before starting playback.

### Message Format

All messages follow this structure:

```javascript
{
  type: 'ldsk',
  eventType: 'PLAY' | 'PLAYER_CONFIGURATION' | 'MEDIA_REQUEST' | 'MEDIA_RESPONSE' | etc.,
  payload: { /* event-specific data */ }
}
```

Send messages to the player with:
```javascript
window.parent.postMessage(messageObject, '*');
```

Listen for player messages with:
```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type === 'ldsk') {
    // Handle event based on eventType
  }
});
```

### Event Types

- **PLAYER_CONFIGURATION**: Provides screen inventory data (location, attributes, etc.) for dynamic content personalization
- **PLAY**: Signals the creative to start playback immediately
- **CREATIVE_READY**: Creative signals it has initialized successfully
- **MEDIA_REQUEST**: Creative requests the player to cache media (videos/images)
- **MEDIA_RESPONSE**: Player provides local URLs for cached media
- **MEDIA_REQUEST_EXCEPTION**: Media caching failed, use fallback

## Code Architecture

### Westfield Package Structure

```
westfield-ldsk-test/
├── index.html       # Entry point (must be at root)
├── main.js          # HLS streaming logic + LDSK communication
├── styles.css       # Layout (640x1280 portrait, overlay positioning)
└── assets/
    └── branding.png # Frame overlay image
```

**Key implementation details (main.js:33-82)**:

1. **Programmatic video creation**: The `<video>` element is created via JavaScript (`document.createElement('video')`) with `autoplay = false`. This is critical for Samsung Tizen screen compatibility (see Samsung Tizen note below).

2. **LDSK event flow**: Video loads and prepares, sends `CREATIVE_READY` when manifest is parsed, but does NOT play until `PLAY` event is received from the player. This ensures proper synchronization with the LDSK platform.

3. **HLS.js integration**: Uses HLS.js library for cross-browser HLS stream support with fallback to native HLS for Safari.

4. **Auto-recovery**: Implements error handlers that automatically retry network errors and recover from media errors.

5. **Subtitle/caption suppression**: Aggressively hides text tracks using event listeners and polling to ensure clean video display.

### Sample Projects Architecture

**basic-workflow** (ldsk-dynamic-samples-main/basic-workflow/main.js:20-33):
- Demonstrates conditional video selection based on inventory attributes
- Example: Different video for Barcelona vs. other cities
- Shows minimal LDSK integration pattern

**optimized-with-caching** (ldsk-dynamic-samples-main/optimized-with-caching/main.js:24-43):
- Demonstrates MEDIA_REQUEST/MEDIA_RESPONSE flow for pre-cached assets
- Uses `requestId` to track multiple media requests
- Shows how to handle MEDIA_REQUEST_EXCEPTION for fallback scenarios

## Critical Development Guidelines

### Samsung Tizen Compatibility

**CRITICAL**: When targeting Samsung Tizen screens, NEVER add `<video>` elements directly in HTML markup. Always create them programmatically with JavaScript.

**Why**: Tizen screens struggle when multiple `<video>` elements exist simultaneously. Since creatives preload in the background while another creative plays, having a `<video>` tag in markup can cause the screen to display a black frame and fail to play.

**Correct approach** (as seen in westfield-ldsk-test/main.js:36-42 and both sample projects):
```javascript
videoElement = document.createElement('video');
videoElement.muted = true;
videoElement.autoplay = true;
document.getElementById('container').appendChild(videoElement);
```

**Incorrect approach** (never do this for Tizen):
```html
<video id="my-video" muted autoplay></video>
```

### Packaging for Deployment

To deploy a creative to LDSK:

1. Ensure `index.html` is at the root level of your creative folder
2. Use relative paths for all assets (relative to `index.html`)
3. Create a ZIP archive containing all files (index.html, JS, CSS, assets)
4. **Important**: `index.html` must be at the root of the ZIP, not in a subfolder
5. Do not include nested ZIP files
6. Upload the ZIP to the LDSK platform

Example for Westfield package:
```bash
cd westfield-ldsk-test
zip -r westfield-stream.zip index.html main.js styles.css assets/
```

### Configuration Changes

**To change the stream URL** (westfield-ldsk-test/main.js:2):
```javascript
const STREAM_URL = 'https://your-stream-url.m3u8';
```

**To adjust screen dimensions** (westfield-ldsk-test/styles.css:7-9):
```css
body {
    width: 640px;   /* Screen width */
    height: 1280px; /* Screen height */
}
```

**To update branding overlay** (westfield-ldsk-test/styles.css:63):
Replace `assets/branding.png` with your branded frame image.

## Performance Considerations

- Optimize image/video file sizes to minimize loading times
- Use media caching (MEDIA_REQUEST) for frequently used assets
- Implement fallback mechanisms for media loading failures
- Test on various devices and browsers before deployment
- Videos must be muted (`muted = true`) to allow programmatic autoplay

## Reference Documentation

LDSK platform samples and documentation: https://github.com/livedooh-Git/ldsk-dynamic-samples
