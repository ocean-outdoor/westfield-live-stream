# Westfield Live Stream - LDSK HTML5 Package Instructions

## Overview
This package contains a ready-to-use LDSK HTML5 creative for displaying a live stream within a branded frame on Westfield digital screens.

---

## What You Need to Provide

### 1. Branded Frame Asset
- **Format:** PNG (preferred) or MP4
- **Aspect Ratio:** Match your screen orientation (9:16 portrait or 16:9 landscape)
- **Design:** Create your branded frame with a transparent or designated area where the live stream will appear
- **Location:** Place the file in the `assets/` folder
- **Recommended name:** `frame.png` or `frame.mp4`

### 2. Live Stream URL
- **Format:** HLS (.m3u8) or DASH streaming URL
- **Example:** `https://your-cdn.com/stream/live.m3u8`
- **Requirement:** Must be publicly accessible from the LDSK player

---

## Step-by-Step Setup Instructions

### Step 1: Add Your Branded Frame

1. Place your branded frame file in the `assets/` folder
2. If using a PNG:
   - Ensure the filename is `frame.png` (or update `styles.css` line 32)
3. If using an MP4:
   - You'll need to modify the HTML to use a `<video>` tag instead of CSS background
   - See "Using Video Frame" section below

### Step 2: Configure the Live Stream URL

1. Open `main.js`
2. Find line 9:
   ```javascript
   const LIVE_STREAM_URL = 'YOUR_LIVE_STREAM_URL_HERE';
   ```
3. Replace `'YOUR_LIVE_STREAM_URL_HERE'` with your actual live stream URL:
   ```javascript
   const LIVE_STREAM_URL = 'https://your-cdn.com/stream/live.m3u8';
   ```

### Step 3: Position the Video Window

1. Open `styles.css`
2. Find the `#video-container` section (around line 43)
3. Adjust the positioning values to match where the video should appear in your frame:

```css
#video-container {
    top: 10%;      /* Distance from top */
    left: 50%;     /* Horizontal position */
    transform: translateX(-50%);  /* Centers horizontally */
    width: 40%;    /* Width of video slot */
    height: 80%;   /* Height of video slot */
}
```

**Common Layouts:**
- **Centered Portrait (9:16):** Use the default values above
- **Centered Landscape (16:9):** See commented example in `styles.css` (line 67)
- **Fullscreen with Overlay:** See commented example in `styles.css` (line 78)

### Step 4: Test Locally (Optional)

You can test the creative locally:
1. Open `index.html` in a modern web browser
2. Open browser console (F12) to see debug messages
3. Note: LDSK player events won't fire locally, but you can verify layout

### Step 5: Package for Upload

1. Ensure all files are in the root folder (not nested):
   ```
   westfield-ldsk-package/
   ├── index.html
   ├── main.js
   ├── styles.css
   └── assets/
       └── frame.png
   ```

2. Select all files and folders (including assets folder)
3. Create a ZIP archive
4. **CRITICAL:** Ensure `index.html` is at the root of the ZIP (not in a subfolder)

### Step 6: Upload to LDSK

1. Log into your LDSK dashboard
2. Upload the ZIP file
3. Configure the creative settings
4. Deploy to your target screens

---

## Advanced Customization

### Using Video Frame Instead of PNG

If your frame is an MP4 video:

1. Modify `index.html` to add a video element in the `#background-frame` div:
```html
<div id="background-frame">
    <video autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: cover;">
        <source src="assets/frame.mp4" type="video/mp4">
    </video>
</div>
```

2. Remove the `background-image` property from `#background-frame` in `styles.css`

### Dynamic Content Based on Location

The LDSK player sends inventory data (location, screen attributes). To use this:

1. Open `main.js`
2. Find the `PLAYER_CONFIGURATION` case (around line 70)
3. Add your logic:
```javascript
case EVENTS.PLAYER_CONFIGURATION:
    const location = event.data.payload.inventory.attributes;

    // Example: Different streams per location
    if (location.city === 'Los Angeles') {
        videoElement.src = 'https://cdn.com/la-stream.m3u8';
    } else if (location.city === 'New York') {
        videoElement.src = 'https://cdn.com/ny-stream.m3u8';
    }
    break;
```

### Adjust Video Playback Settings

In `main.js` (around line 38), you can modify video element properties:

```javascript
videoElement.muted = true;      // Audio on/off
videoElement.autoplay = true;   // Autoplay on/off
videoElement.loop = false;      // Loop on/off (usually false for live streams)
```

---

## Technical Requirements

### LDSK Platform Requirements
- `index.html` must be at ZIP root level
- All paths must be relative
- No nested ZIP archives
- Video elements must be created via JavaScript (not hardcoded in HTML)

### Browser/Screen Compatibility
- Tested for Samsung Tizen screens
- Supports modern web standards (HTML5, CSS3, ES6)
- HLS/DASH stream format required

### File Size Considerations
- Keep total ZIP size under 50MB (recommended)
- Optimize images (use compressed PNG)
- If using video frame, keep it short and compressed

---

## Troubleshooting

### Video doesn't play
- **Check:** Is the live stream URL publicly accessible?
- **Check:** Is the stream format HLS or DASH?
- **Check:** Open browser console for error messages

### Frame doesn't show
- **Check:** Is `frame.png` in the `assets/` folder?
- **Check:** Is the path in `styles.css` correct?
- **Check:** Try opening `index.html` locally to verify

### Video is not positioned correctly
- **Fix:** Adjust `top`, `left`, `width`, `height` values in `styles.css`
- **Tip:** Use browser dev tools to test positioning live

### Screen shows black frame (Samsung Tizen)
- **Cause:** Video element hardcoded in HTML
- **Fix:** Ensure video is created via JavaScript (already done in this package)

---

## Support

For questions about:
- **LDSK Platform:** Contact LiveDOOH support
- **This Package:** Contact [Your Contact Info]
- **LDSK Dev Kit:** https://github.com/livedooh-Git/ldsk-dynamic-samples

---

## File Structure Reference

```
westfield-ldsk-package/
│
├── index.html          # Main HTML file (required at ZIP root)
├── main.js             # LDSK communication & video logic
├── styles.css          # Layout and positioning styles
├── INSTRUCTIONS.md     # This file
│
└── assets/             # Your branded assets folder
    └── frame.png       # Your branded frame (ADD THIS)
```

---

## Quick Checklist

- [ ] Added branded frame to `assets/` folder
- [ ] Updated `LIVE_STREAM_URL` in `main.js` (line 9)
- [ ] Adjusted video positioning in `styles.css` (if needed)
- [ ] Tested locally in browser (optional)
- [ ] Created ZIP with `index.html` at root level
- [ ] Uploaded to LDSK dashboard
- [ ] Deployed to target screens

---

## Notes

- This package is based on LDSK HTML5 Dev Kit best practices
- Video element is created programmatically to prevent Samsung Tizen issues
- The creative communicates with LDSK player via postMessage API
- Console logs are included for debugging (remove in production if desired)

Good luck with your Westfield deployment!
