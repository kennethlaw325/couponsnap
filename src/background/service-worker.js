// CouponSnap Background Service Worker v3

const tabStates = new Map()

// ─── Analytics (GA4 Measurement Protocol) ────────────────────────────────────
// Privacy-safe: no PII, aggregate counts only, no cross-site tracking

const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect'
const GA_MEASUREMENT_ID = 'G-COUPONSNAP01'  // Replace with real GA4 ID
const GA_API_SECRET = 'REPLACE_WITH_SECRET' // Replace with GA4 API secret

async function getClientId() {
  try {
    const result = await chrome.storage.local.get('ga_client_id')
    if (result.ga_client_id) return result.ga_client_id
    // Generate a random client ID (not linked to any user identity)
    const id = crypto.randomUUID()
    await chrome.storage.local.set({ ga_client_id: id })
    return id
  } catch {
    return 'unknown-' + Math.random().toString(36).slice(2)
  }
}

async function sendAnalyticsEvent(eventName, params = {}) {
  // Skip if placeholder keys not replaced yet
  if (GA_API_SECRET === 'REPLACE_WITH_SECRET') return
  try {
    const clientId = await getClientId()
    await fetch(`${GA_ENDPOINT}?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`, {
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        non_personalized_ads: true,
        events: [{ name: eventName, params }]
      })
    })
  } catch {
    // Fail silently — analytics is non-critical
  }
}

// ─── Badge Helpers ────────────────────────────────────────────────────────────

function setBadge(tabId, text, color = '#f97316') {
  chrome.action.setBadgeText({ tabId, text: String(text) })
  chrome.action.setBadgeBackgroundColor({ tabId, color })
}

function clearBadge(tabId) {
  chrome.action.setBadgeText({ tabId, text: '' })
}

// ─── Message Handler ──────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender.tab?.id
  if (!tabId && msg.type !== 'GET_TAB_STATE') return

  switch (msg.type) {
    case 'CHECKOUT_DETECTED': {
      const state = {
        isCheckout: true,
        hostname: msg.hostname,
        hasCoupons: msg.hasCoupons,
        couponCount: msg.couponCount,
        status: msg.hasCoupons ? 'found' : 'none',
        appliedCode: null,
        savings: null,
        tryingCode: null
      }
      tabStates.set(tabId, state)
      if (msg.hasCoupons) {
        setBadge(tabId, String(msg.couponCount))
        // Track checkout sessions where we actually have codes to try
        chrome.storage.local.get(['total_checkout_sessions'], r => {
          chrome.storage.local.set({
            total_checkout_sessions: (r.total_checkout_sessions || 0) + 1
          })
        })
      }
      break
    }

    case 'TRYING_COUPON': {
      const state = tabStates.get(tabId) || {}
      state.status = 'trying'
      state.tryingCode = msg.code
      tabStates.set(tabId, state)
      setBadge(tabId, '...', '#64748b')
      // Track total codes tried
      chrome.storage.local.get(['total_codes_tried'], r => {
        chrome.storage.local.set({
          total_codes_tried: (r.total_codes_tried || 0) + 1
        })
      })
      break
    }

    case 'COUPON_APPLIED': {
      const state = tabStates.get(tabId) || {}
      state.status = 'applied'
      state.appliedCode = msg.code
      state.savings = msg.discount
      state.description = msg.description
      tabStates.set(tabId, state)
      setBadge(tabId, '✓', '#22c55e')
      sendAnalyticsEvent('coupon_applied', {
        hostname: state.hostname || 'unknown',
        has_discount: !!msg.discount
      })
      // Track cumulative savings stats
      chrome.storage.local.get(['savings_cents', 'coupons_applied'], r => {
        const dollarMatch = (msg.discount || '').match(/\$?([\d]+\.?[\d]*)/)
        const newCents = dollarMatch ? Math.round(parseFloat(dollarMatch[1]) * 100) : 0
        chrome.storage.local.set({
          savings_cents: (r.savings_cents || 0) + newCents,
          coupons_applied: (r.coupons_applied || 0) + 1
        })
      })
      break
    }

    case 'NO_COUPON_FIELD': {
      const state = tabStates.get(tabId) || {}
      state.status = 'no_field'
      tabStates.set(tabId, state)
      setBadge(tabId, '?', '#64748b')
      sendAnalyticsEvent('no_coupon_field', { hostname: state.hostname || 'unknown' })
      break
    }

    case 'NO_COUPON_WORKED': {
      const state = tabStates.get(tabId) || {}
      state.status = 'failed'
      tabStates.set(tabId, state)
      setBadge(tabId, '✗', '#ef4444')
      sendAnalyticsEvent('coupon_failed', { hostname: state.hostname || 'unknown' })
      break
    }

    case 'AFFILIATE_INJECTED': {
      const state = tabStates.get(tabId) || {}
      // Accumulate total tagged links for this tab session
      state.affiliateLinksTagged = (state.affiliateLinksTagged || 0) + (msg.count || 0)
      state.affiliateHostname = msg.hostname
      tabStates.set(tabId, state)
      sendAnalyticsEvent('affiliate_injected', {
        hostname: msg.hostname,
        links_tagged: msg.count
      })
      break
    }

    case 'GET_TAB_STATE': {
      const id = msg.tabId
      sendResponse(tabStates.get(id) || null)
      return true
    }
  }
})

// ─── Tab Lifecycle ────────────────────────────────────────────────────────────

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    tabStates.delete(tabId)
    clearBadge(tabId)
  }
})

chrome.tabs.onRemoved.addListener((tabId) => {
  tabStates.delete(tabId)
})

// ─── Context Menu (right-click to force try) ──────────────────────────────────

chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    id: 'couponsnap-try',
    title: 'CouponSnap: Try Coupon Codes',
    contexts: ['page']
  })
  if (details.reason === 'install') {
    sendAnalyticsEvent('extension_installed', { version: chrome.runtime.getManifest().version })
  }
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'couponsnap-try' && tab?.id) {
    await chrome.tabs.sendMessage(tab.id, { type: 'TRY_COUPONS' })
  }
})
