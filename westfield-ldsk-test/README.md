# Westfield Live Stream - LDSK Package

Simple HTML5 creative for displaying live streams with branded frame overlay on LDSK platform.

## Quick Setup

### 1. Change Stream URL
Edit `main.js` line 2:
```javascript
const STREAM_URL = 'https://your-stream-url.m3u8';
```

### 2. Add Your Frame
Place your branded frame image as `assets/branding.png`

### 3. Adjust Screen Size (Optional)
Edit `styles.css` lines 7-8:
```css
width: 640px;   /* Your screen width */
height: 1280px; /* Your screen height */
```

### 4. Package for Upload
1. Ensure `index.html` is at the root level
2. ZIP all files: `index.html`, `main.js`, `styles.css`, `assets/`
3. Upload to LDSK platform

## File Structure

```
├── index.html          (Main file - must be at root)
├── main.js             (Stream configuration & logic)
├── styles.css          (Layout & styling)
└── assets/
    └── branding.png    (Your branded frame overlay)
```

## Features

- ✅ Fullscreen video with cover fit
- ✅ Frame overlay on top
- ✅ Native HLS stream support (Samsung Tizen screens)
- ✅ Auto-hide subtitles/captions
- ✅ No video controls
- ✅ LDSK player communication
- ✅ No external dependencies (all local files)
- ✅ Optimized for 640x1280 (portrait)

## Test Stream

Currently using Big Buck Bunny test stream:
`https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`

Replace with your production stream URL before deployment.

## Support

For LDSK platform documentation: https://github.com/livedooh-Git/ldsk-dynamic-samples
