# Quick Reference Card

## What Westfield Must Replace

### 1️⃣ Live Stream URL
**File:** `main.js`
**Line:** 9
**Replace:**
```javascript
const LIVE_STREAM_URL = 'YOUR_LIVE_STREAM_URL_HERE';
```
**With:**
```javascript
const LIVE_STREAM_URL = 'https://your-actual-stream-url.m3u8';
```

---

### 2️⃣ Branded Frame Asset
**Location:** `assets/` folder
**Action:** Add your PNG or MP4 frame file
**Filename:** `frame.png` (recommended)

If using different filename:
- **File:** `styles.css`
- **Line:** 32
- Update: `background-image: url('assets/YOUR_FILENAME.png');`

---

### 3️⃣ Video Position (Optional)
**File:** `styles.css`
**Lines:** 43-52

Adjust these values to position the video in your frame:
```css
#video-container {
    top: 10%;      /* Adjust */
    left: 50%;     /* Adjust */
    width: 40%;    /* Adjust */
    height: 80%;   /* Adjust */
}
```

---

## Creating the ZIP File

### What to Include:
```
✓ index.html
✓ main.js
✓ styles.css
✓ assets/ folder (with your frame file)
```

### What to EXCLUDE:
```
✗ INSTRUCTIONS.md (optional, can include)
✗ README.md (optional, can include)
✗ QUICK_REFERENCE.md (optional, can include)
```

### Critical Rule:
**index.html MUST be at the root of the ZIP** (not in a subfolder)

---

## Testing

1. Open `index.html` in Chrome/Firefox
2. Press F12 to open console
3. Check for errors
4. Verify frame and video positioning

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Video doesn't play | Check stream URL is HLS/DASH format |
| Frame doesn't show | Verify file is in `assets/` folder |
| Wrong position | Adjust CSS in `styles.css` |
| Black screen (Samsung) | Video must be created via JS (already done) |

---

## File Sizes

- Keep ZIP under 50MB
- Compress images
- Optimize video frames

---

## Contact

Questions? See full INSTRUCTIONS.md or contact LiveDOOH support.
