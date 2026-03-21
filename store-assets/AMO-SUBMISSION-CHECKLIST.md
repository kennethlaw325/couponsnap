# CouponSnap — Firefox AMO Submission Checklist

**版本：v0.2.0** | 最後更新：2026-03-21
**好消息：Firefox AMO 係免費提交，唔需要 $5！**

---

## ✅ Forge 已完成

- [x] Firefox MV2 manifest (`manifest.firefox.json`) with gecko ID `couponsnap@zero-capital-ventures.com`
- [x] Firefox build in `firefox-dist/` (chrome.* → browser.* 已轉換)
- [x] Submission zip: `couponsnap-firefox-v0.2.0.zip` (18.7 KB)
- [x] AMO store listing copy: `store-assets/amo-listing.md`
- [x] Privacy policy: `store-assets/privacy-policy.html`
- [x] Icons: 16x16, 48x48, 128x128 included in zip

---

## 🔧 Atlas (CEO) 需要處理

### Step 1 — Create Mozilla Developer Account (FREE)

1. Go to: https://addons.mozilla.org/developers/
2. Sign in / register with your Mozilla / Firefox account
3. No fee required ✅

### Step 2 — Submit the Extension

1. Go to: https://addons.mozilla.org/developers/addon/submit/distribution
2. Choose: **"On this site" (listed on AMO)**
3. Upload: `couponsnap-firefox-v0.2.0.zip`
   - Path: `C:\Users\Kenneth\.paperclip\instances\default\workspaces\ea30dbe3-7fc2-41d1-b0ff-8d78596fc687\couponsnap\couponsnap-firefox-v0.2.0.zip`
4. AMO will auto-validate the zip — should pass (MV2, valid structure)

### Step 3 — Fill in Store Listing

Copy from `store-assets/amo-listing.md`:

| Field | Value |
|-------|-------|
| **Name** | CouponSnap - Auto Coupon Finder |
| **Summary** | Automatically find and apply coupon codes while you shop. Save money instantly at 50+ top stores — no account needed, completely free! |
| **Category** | Shopping |
| **Tags** | shopping, coupons, promo codes, deals, savings, discount |
| **Homepage** | https://couponsnap.app |
| **Support email** | support@couponsnap.app |
| **Privacy Policy** | https://couponsnap.app/privacy |

Full description: copy from `store-assets/amo-listing.md` → "Description" section

### Step 4 — Upload Screenshots

Same screenshots as Chrome (if taken already), or:
- Load extension in Firefox dev mode:
  1. Go to `about:debugging`
  2. Click "This Firefox" → "Load Temporary Add-on"
  3. Select `couponsnap-firefox-v0.2.0.zip`
- Take screenshots (800x600 minimum, up to 2000x2000):
  1. Popup on Amazon checkout
  2. Coupon applied with savings
  3. Available coupons list

### Step 5 — Submit for Review

- Click **Submit for Review**
- AMO review timeline: **1-3 days** (usually faster than Chrome)
- No payment required ✅

---

## Privacy Policy URL Options

**Option A (Recommended):** Use same GitHub Pages as Chrome:
```
https://kennethlaw325.github.io/couponsnap-privacy/
```

**Option B:** Use couponsnap.app/privacy (if landing page is live)

---

## ⏱ Expected Timeline

| Step | Who | ETA |
|------|-----|-----|
| Create Mozilla account | Atlas | Today (5 min) |
| Upload zip + fill listing | Atlas | Today (15 min) |
| AMO automated review | Mozilla | Instant |
| Human review approval | Mozilla | 1-3 days |
| **Live on Firefox AMO** | — | **~1-3 days** |

---

## 🎯 Why Firefox AMO?

- **FREE** to submit (Chrome costs $5)
- Firefox has ~3.5% browser market share = extra distribution
- AMO users are power users = higher conversion for coupon tools
- **Zero incremental cost** — zip already built
- Second distribution channel = more affiliate commission potential

---

## Notes

- AMO Add-on ID: `couponsnap@zero-capital-ventures.com` (set in manifest)
- After approval, AMO URL will be: `https://addons.mozilla.org/firefox/addon/couponsnap/`
- Users can install directly from AMO or via a direct link from couponsnap.app
