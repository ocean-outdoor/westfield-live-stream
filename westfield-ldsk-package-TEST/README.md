# Westfield Live Stream - LDSK HTML5 Creative Package

## Quick Start

This is a ready-to-use LDSK HTML5 package for displaying live streams on Westfield digital screens.

### Required Changes (2 minutes):

1. **Add your branded frame:**
   - Place your PNG/MP4 frame in `assets/` folder
   - Name it `frame.png` (or update `styles.css`)

2. **Add your live stream URL:**
   - Open `main.js`
   - Replace `YOUR_LIVE_STREAM_URL_HERE` with your HLS/DASH stream URL

3. **Adjust video positioning (if needed):**
   - Open `styles.css`
   - Modify `#video-container` dimensions to match your frame design

4. **Package and upload:**
   - ZIP all files (ensure `index.html` is at root)
   - Upload to LDSK dashboard

### Full Documentation

See **INSTRUCTIONS.md** for complete step-by-step setup guide.

---

## Package Contents

- `index.html` - Main HTML file
- `main.js` - LDSK player communication & video logic
- `styles.css` - Layout and styling
- `INSTRUCTIONS.md` - Detailed setup guide
- `assets/` - Folder for your branded frame

---

## What This Package Does

- Displays a branded frame (PNG/MP4) as background
- Plays your live stream in a positioned video window
- Communicates with LDSK player using postMessage API
- Creates video element programmatically (Samsung Tizen compatible)
- Supports dynamic content based on screen location

---

## Support

- **LDSK Dev Kit:** https://github.com/livedooh-Git/ldsk-dynamic-samples
- **Questions:** Contact your technical team

---

**Ready to customize!** Start with INSTRUCTIONS.md
