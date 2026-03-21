// CouponSnap Content Script v2
// Detects checkout pages, auto-applies coupons (Shopify + generic)
// Injects affiliate tags for commission tracking

import { getCouponsForDomain, injectAffiliateTag } from '../data/coupons.js'

// ─── Checkout Detection ───────────────────────────────────────────────────────

const CHECKOUT_URL_PATTERNS = [
  /\/checkout/i, /\/checkouts\//i, /\/cart/i, /\/payment/i, /\/order/i,
  /\/basket/i, /\/purchase/i, /\/buy\//i, /\/secure/i,
  /\/wc-api\/wc_gateway/i,        // WooCommerce payment gateway
  /\/finalize/i,                  // BigCommerce finalize
]

const CHECKOUT_DOM_SIGNALS = [
  '[data-step="contact_information"]',  // Shopify
  '[data-step="payment_method"]',       // Shopify
  '[data-step="shipping_method"]',      // Shopify
  '.order-summary',                     // Shopify
  '#checkout',                          // Generic
  '.checkout-form',
  '#payment-form',
  '[data-testid="checkout"]',
  '.cart-checkout',
  'form[action*="checkout"]',
  'form[action*="payment"]',
  // WooCommerce
  '.woocommerce-checkout',
  '#order_review',
  'form.woocommerce-checkout',
  // BigCommerce
  '[data-cart-status]',
  '.optimizedCheckout-form',
  '#checkoutApp',
]

function isCheckoutPage() {
  const url = window.location.href
  if (CHECKOUT_URL_PATTERNS.some(p => p.test(url))) return true
  return CHECKOUT_DOM_SIGNALS.some(sel => {
    try { return !!document.querySelector(sel) } catch { return false }
  })
}

// ─── Platform Detection ───────────────────────────────────────────────────────

function detectPlatform() {
  const meta = document.querySelector('meta[name="generator"]')?.content || ''
  if (meta.includes('Shopify') || window.Shopify || document.querySelector('.shopify-checkout-form')) {
    return 'shopify'
  }
  if (document.querySelector('form[id*="woocommerce"]') || window.wc_checkout_params) {
    return 'woocommerce'
  }
  if (document.querySelector('[data-component="checkout"]') || window.__NEXT_DATA__) {
    return 'nextjs'
  }
  return 'generic'
}

// ─── Coupon Field Selectors ───────────────────────────────────────────────────

const SHOPIFY_SELECTORS = {
  field: [
    '#checkout_reduction_code',           // Shopify classic
    'input[name="checkout[reduction_code]"]',
    '.reduction-code__text-field input',
    '[data-discount-field]',
    'input[placeholder*="discount" i]',
    'input[placeholder*="gift card" i]'
  ],
  button: [
    'button[data-trekkie-id="apply_discount_button"]',
    '.reduction-code__submit',
    'button[aria-label*="Apply" i]',
    'button[type="submit"][form*="reduction"]',
    'button:has(span:contains("Apply"))'
  ]
}

const GENERIC_SELECTORS = {
  field: [
    'input[name*="coupon" i]',
    'input[name*="promo" i]',
    'input[name*="discount" i]',
    'input[name*="voucher" i]',
    'input[name*="code" i]',
    'input[id*="coupon" i]',
    'input[id*="promo" i]',
    'input[id*="discount" i]',
    'input[id*="voucher" i]',
    'input[placeholder*="coupon" i]',
    'input[placeholder*="promo" i]',
    'input[placeholder*="discount" i]',
    'input[placeholder*="code" i]',
    'input[aria-label*="coupon" i]',
    'input[aria-label*="promo" i]',
    // Amazon
    'input#spc-gcpromoinput',
    // WooCommerce
    '#coupon_code',
    'input.coupon-input',
    // BigCommerce
    'input[data-coupon]'
  ],
  button: [
    'button[name*="apply" i]',
    'button[id*="apply" i]',
    'button[class*="apply" i]',
    'input[type="submit"][value*="apply" i]',
    'button[aria-label*="apply coupon" i]',
    // WooCommerce
    'button[name="apply_coupon"]',
    // Generic
    'button:has(span[class*="apply" i])'
  ]
}

function findElement(selectors) {
  for (const sel of selectors) {
    try {
      const el = document.querySelector(sel)
      if (el && el.offsetParent !== null) return el
    } catch {}
  }
  return null
}

function findCouponField(platform) {
  const primary = platform === 'shopify' ? SHOPIFY_SELECTORS.field : []
  return findElement([...primary, ...GENERIC_SELECTORS.field])
}

function findApplyButton(platform, couponField) {
  const primary = platform === 'shopify' ? SHOPIFY_SELECTORS.button : []
  let btn = findElement([...primary, ...GENERIC_SELECTORS.button])

  if (!btn && couponField) {
    // Fallback: look for submit buttons near the input field
    const container = couponField.closest('form') || couponField.parentElement
    if (container) {
      const btns = container.querySelectorAll('button, input[type="submit"]')
      for (const b of btns) {
        const text = (b.textContent + (b.value || '')).toLowerCase()
        if (/apply|redeem|submit|use|validate/.test(text)) {
          btn = b
          break
        }
      }
    }
  }
  return btn
}

// ─── Input Simulation ─────────────────────────────────────────────────────────

function setNativeValue(input, value) {
  const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
  if (proto?.set) {
    proto.set.call(input, value)
  } else {
    input.value = value
  }
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
  input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }))
}

// ─── Success/Failure Detection ────────────────────────────────────────────────

const SUCCESS_SIGNALS = [
  'coupon applied', 'discount applied', 'promo applied',
  'code applied', 'saved', 'you save', 'savings applied',
  'gift card applied', 'offer applied', 'deal applied'
]

const ERROR_SIGNALS = [
  'invalid', 'expired', 'not valid', 'not found', 'cannot be',
  'does not exist', 'already used', 'not applicable', 'minimum',
  'sorry', 'cannot apply', "doesn't apply", 'not eligible'
]

function checkPageForResult() {
  const text = document.body.innerText.toLowerCase()

  // Also check specific result elements
  const resultEls = document.querySelectorAll(
    '.reduction-code__text, .coupon-message, [data-coupon-message], ' +
    '.woocommerce-message, .alert, .notice, .notification, [role="alert"]'
  )
  let elText = ''
  resultEls.forEach(el => { elText += el.textContent.toLowerCase() })
  const combined = text + ' ' + elText

  if (SUCCESS_SIGNALS.some(s => combined.includes(s))) return 'success'
  if (ERROR_SIGNALS.some(s => combined.includes(s))) return 'error'
  return 'unknown'
}

// ─── Core Apply Engine ────────────────────────────────────────────────────────

async function tryCoupon(code, couponField, applyButton) {
  couponField.focus()
  setNativeValue(couponField, code)
  await sleep(200)

  if (applyButton) {
    applyButton.click()
    applyButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  } else {
    // Try pressing Enter
    couponField.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13, bubbles: true }))
    couponField.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }))
    couponField.closest('form')?.requestSubmit()
  }

  await sleep(1800)
  return checkPageForResult()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Shopify-specific: Expand Coupon Section ──────────────────────────────────

async function expandCouponSection() {
  const togglers = document.querySelectorAll(
    '[data-toggle="coupon"], [aria-controls*="coupon"], ' +
    'button[class*="coupon-toggle"], .coupon-toggle, ' +
    'a[href*="#coupon"], .js-toggle-coupon'
  )
  for (const toggler of togglers) {
    if (toggler.offsetParent) {
      toggler.click()
      await sleep(400)
      return true
    }
  }
  return false
}

// ─── Main Coupon Runner ───────────────────────────────────────────────────────

async function runCouponFinder(manual = false) {
  if (!isCheckoutPage() && !manual) return

  const hostname = window.location.hostname
  const couponData = getCouponsForDomain(hostname)

  chrome.runtime.sendMessage({
    type: 'CHECKOUT_DETECTED',
    hostname,
    hasCoupons: !!couponData,
    couponCount: couponData?.codes?.length || 0
  })

  if (!couponData) return

  // Try to expand coupon section if collapsed
  await expandCouponSection()

  // Wait for coupon field with polling
  let couponField = null
  const platform = detectPlatform()

  for (let i = 0; i < 30; i++) {
    couponField = findCouponField(platform)
    if (couponField) break
    await sleep(500)
  }

  if (!couponField) {
    logFailedAttempts(hostname, couponData?.codes?.map(c => c.code) || [])
    chrome.runtime.sendMessage({ type: 'NO_COUPON_FIELD', hostname })
    return
  }

  const applyButton = findApplyButton(platform, couponField)

  // Try codes one by one
  for (const coupon of couponData.codes) {
    chrome.runtime.sendMessage({ type: 'TRYING_COUPON', code: coupon.code })

    const result = await tryCoupon(coupon.code, couponField, applyButton)

    if (result === 'success') {
      chrome.runtime.sendMessage({
        type: 'COUPON_APPLIED',
        code: coupon.code,
        description: coupon.desc,
        discount: coupon.discount
      })
      return
    }

    // Clear field before next attempt
    setNativeValue(couponField, '')
    await sleep(300)
  }

  logFailedAttempts(hostname, couponData.codes.map(c => c.code))
  chrome.runtime.sendMessage({ type: 'NO_COUPON_WORKED' })
}

// ─── Failed Attempt Logging ───────────────────────────────────────────────────

async function logFailedAttempts(hostname, codes) {
  try {
    const key = 'failed_attempts'
    const result = await chrome.storage.local.get(key)
    const log = result[key] || []
    log.push({
      domain: hostname.replace(/^www\./, ''),
      codes,
      ts: Date.now(),
      url: window.location.pathname
    })
    // Keep last 200 entries
    await chrome.storage.local.set({ [key]: log.slice(-200) })
  } catch {}
}

// ─── Affiliate Tag Injection ──────────────────────────────────────────────────

function injectAffiliateLinks() {
  const hostname = window.location.hostname

  // Inject tag into all product links on page
  document.querySelectorAll('a[href]').forEach(link => {
    try {
      const url = new URL(link.href)
      if (url.hostname.includes(hostname.replace('www.', ''))) {
        link.href = injectAffiliateTag(link.href, hostname)
      }
    } catch {}
  })

  // Observe future links
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return
        const links = node.tagName === 'A' ? [node] : [...node.querySelectorAll('a[href]')]
        links.forEach(link => {
          try {
            const url = new URL(link.href)
            if (url.hostname.includes(hostname.replace('www.', ''))) {
              link.href = injectAffiliateTag(link.href, hostname)
            }
          } catch {}
        })
      })
    })
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

// ─── Message Listener ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'TRY_COUPONS') {
    runCouponFinder(true)
    sendResponse({ started: true })
  }
  if (msg.type === 'GET_PAGE_STATUS') {
    sendResponse({
      isCheckout: isCheckoutPage(),
      hostname: window.location.hostname,
      platform: detectPlatform()
    })
  }
  return true
})

// ─── Init ─────────────────────────────────────────────────────────────────────

// Inject affiliate tags on all pages
injectAffiliateLinks()

// Auto-run coupon finder on checkout pages
runCouponFinder()

// Re-run on SPA navigation (Shopify uses history API)
let lastUrl = location.href
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href
    setTimeout(() => runCouponFinder(), 1000)
  }
}).observe(document, { subtree: true, childList: true })
