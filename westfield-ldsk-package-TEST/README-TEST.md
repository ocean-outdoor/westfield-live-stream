# Westfield Live Stream - TEST VERSION

## Ready to Test!

This is a pre-configured test version with:
- ✅ Big Buck Bunny test stream (HLS)
- ✅ Placeholder gradient frame with "WESTFIELD TEST FRAME" watermark
- ✅ Centered portrait video layout (9:16 slot)

## How to Test

### Option 1: Test in Browser (Quick)
1. Open `index.html` in Chrome, Firefox, or Safari
2. The video should start playing automatically
3. Open browser console (F12) to see debug messages

### Option 2: Test on LDSK Platform (Recommended)
1. Create a ZIP file containing:
   - index.html
   - main.js
   - styles.css
   - assets/ folder
2. Upload ZIP to LDSK dashboard
3. Deploy to test screen

## What You'll See

- **Background:** Purple gradient with decorative borders
- **Video:** Big Buck Bunny test video in center (portrait orientation)
- **Watermark:** "WESTFIELD TEST FRAME" at top

## Configuration

### Test Stream
- **URL:** https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
- **Format:** HLS (m3u8)
- **Content:** Big Buck Bunny (loops continuously)
- **Resolution:** Adaptive (multiple qualities)

### Video Positioning
- **Layout:** Centered portrait
- **Position:** 10% from top, centered horizontally
- **Size:** 40% width, 80% height

## Next Steps

Once testing is successful, replace:
1. **Stream URL:** Change in `main.js` line 9
2. **Frame:** Replace gradient with your branded PNG/MP4
3. **Positioning:** Adjust video position in `styles.css` if needed

## Troubleshooting

### Video doesn't play in browser
- **Chrome/Safari:** Autoplay should work (video is muted)
- **Check console:** Look for error messages
- **Network:** Ensure you have internet connection

### Video doesn't play on LDSK
- **Check ZIP structure:** `index.html` must be at root
- **Check LDSK logs:** Look for player communication messages
- **Verify deployment:** Ensure creative is properly deployed to screen

## Files Modified from Original

- **main.js:** Updated with Big Buck Bunny stream URL
- **styles.css:** Added CSS-based placeholder frame (no image file needed)

---

**This is a TEST version only.** For production, use the original `westfield-ldsk-package/` with your actual stream and branded frame.
