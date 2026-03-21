# CouponSnap — Chrome Web Store Submission Checklist

**版本：v0.2.0** | 最後更新：2026-03-21

## ✅ Forge 已完成 (Code-level)

- [x] Extension v0.2.0 build (`dist/` folder ready)
- [x] manifest.json (MV3, correct permissions)
- [x] Icons: 16x16, 48x48, 128x128 (orange, in `dist/icons/`)
- [x] Privacy policy HTML (`store-assets/privacy-policy.html`)
- [x] Store listing copy (`store-assets/store-listing.md`)
- [x] `REMOTE_COUPON_DB_URL` 已設為 `kennethlaw325/couponsnap` (remote fetch 正常)
- [x] Deal Finder + Crowdsource 功能 (ZER-41)
- [x] Firefox Add-on build `couponsnap-firefox-v0.2.0.zip` (ZER-44)
- [x] GitHub Releases sideload beta (ZER-45)
- [x] Submission zip: `couponsnap-v0.2.0.zip` (14.99 KB)

---

## 🔧 Atlas (CEO) 需要處理

### 1. Pay Developer Fee
- **One-time fee:** $5 USD
- **URL:** https://chrome.google.com/webstore/devconsole
- Sign in with Google account → Pay $5 registration fee

### 2. Create Store Assets

#### 必需截圖 (5 screenshots, 1280x800 or 640x400)
Load extension in Chrome dev mode and capture:
1. **Extension popup on Amazon checkout** — showing "X coupons found"
2. **Extension popup with coupon applied** — showing green "✓" + savings
3. **Extension popup on non-checkout page** — showing available coupons list
4. **Badge on toolbar** — showing coupon count badge
5. **Right-click context menu** — showing CouponSnap option

#### How to load extension in dev mode:
1. Go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" → select `couponsnap/dist/` folder

#### Promotional Tile (440x280)
Create a simple graphic in Canva (free):
- Orange background (#f97316)
- Logo: ✂️ CouponSnap
- Tagline: "Automatic Coupon Codes — Save Money Instantly"
- Export as PNG, 440x280

### 3. Host Privacy Policy on GitHub Pages

```bash
# Create repo: couponsnap-privacy (public)
# Add store-assets/privacy-policy.html as index.html
# Enable GitHub Pages → Settings → Pages → main branch
# URL will be: https://[username].github.io/couponsnap-privacy/
```

Update `store-listing.md` privacy policy URL with the actual GitHub Pages URL.

### 4. Submit to Chrome Web Store

1. Go to https://chrome.google.com/webstore/devconsole
2. Click "+ New Item"
3. Upload `couponsnap-v0.2.0.zip` (see below)
4. Fill in store listing from `store-assets/store-listing.md`
5. Upload screenshots and promotional tile
6. Set Privacy Policy URL (from GitHub Pages)
7. Submit for review (typically 1-3 business days)

---

## 📦 Create Submission ZIP

Run this in the project directory:
```bash
cd couponsnap
npm run build
cd dist
zip -r ../couponsnap-v0.2.0.zip .
```

The zip should contain `manifest.json` at the root level.

---

## 📋 Store Listing Quick Copy

**Name:** CouponSnap - Automatic Coupon Finder

**Short desc:** Automatically find and apply coupon codes while you shop. Save money instantly at 50+ top stores!

**Category:** Shopping

**Privacy policy URL:** [your GitHub Pages URL]

---

## ⏱ Expected Timeline

| Step | Who | ETA |
|------|-----|-----|
| Pay $5 dev fee | Atlas | Today |
| Take screenshots | Atlas | Today |
| Create promo tile | Atlas (Canva) | Today |
| Host privacy policy | Atlas (GitHub) | Today |
| Submit to Web Store | Atlas | Today |
| Review approval | Google | 1-3 days |
| **Live on Chrome Store** | — | **~3 days** |
