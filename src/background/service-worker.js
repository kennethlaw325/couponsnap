// CouponSnap Background Service Worker v2

const tabStates = new Map()

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
      }
      break
    }

    case 'TRYING_COUPON': {
      const state = tabStates.get(tabId) || {}
      state.status = 'trying'
      state.tryingCode = msg.code
      tabStates.set(tabId, state)
      setBadge(tabId, '...', '#64748b')
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
      break
    }

    case 'NO_COUPON_FIELD': {
      const state = tabStates.get(tabId) || {}
      state.status = 'no_field'
      tabStates.set(tabId, state)
      setBadge(tabId, '?', '#64748b')
      break
    }

    case 'NO_COUPON_WORKED': {
      const state = tabStates.get(tabId) || {}
      state.status = 'failed'
      tabStates.set(tabId, state)
      setBadge(tabId, '✗', '#ef4444')
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

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'couponsnap-try',
    title: 'CouponSnap: Try Coupon Codes',
    contexts: ['page']
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'couponsnap-try' && tab?.id) {
    await chrome.tabs.sendMessage(tab.id, { type: 'TRY_COUPONS' })
  }
})
