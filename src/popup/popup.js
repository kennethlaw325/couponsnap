// CouponSnap Popup — Deal Finder + Crowdsource Edition
import { getCouponsForDomain, getAllCodesForDomain, submitUserCode, injectAffiliateTag } from '../data/coupons.js'

const GITHUB_RELEASE_URL = 'https://github.com/kennethlaw325/couponsnap/releases/latest'
const FEEDBACK_FORM_URL = 'https://mail.google.com/mail/?view=cm&to=support@couponsnap.app&su=CouponSnap%20Beta%20Feedback&body=Rating%20(1-5)%3A%20%0D%0AWhat%20I%20like%20most%3A%20%0D%0AWhat%20to%20improve%3A%20%0D%0ATestimonial%20(can%20we%20share%3F)%3A%20%0D%0AEmail%20for%20updates%20(optional)%3A%20'

const content = document.getElementById('content')
const tabsEl = document.getElementById('tabs')
const dealsCountEl = document.getElementById('deals-count')
const codesCountEl = document.getElementById('codes-count')

// ─── Tab State ────────────────────────────────────────────────────────────────

let _activeTab = 'deals'

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _activeTab = btn.dataset.tab
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn))
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${_activeTab}`))
    })
  })
}

// ─── Chrome API Helpers ───────────────────────────────────────────────────────

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab
}

async function getTabState(tabId) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: 'GET_TAB_STATE', tabId }, resolve)
  })
}

// ─── Render: No Shop ─────────────────────────────────────────────────────────

function renderIdle() {
  tabsEl.style.display = 'none'
  content.innerHTML = `
    <div class="status-card">
      <div class="status-icon">🛒</div>
      <div class="status-title">Browse to a shopping site</div>
      <div class="status-subtitle">CouponSnap finds deals and coupon codes automatically as you shop.</div>
    </div>
  `
}

// ─── Render: Site Found ───────────────────────────────────────────────────────

async function renderSiteFound(hostname, checkoutState, tabId) {
  const entry = getCouponsForDomain(hostname)
  const deals = entry?.deals || []
  const allCodes = await getAllCodesForDomain(hostname)

  // If no data at all
  if (!deals.length && !allCodes.length) {
    tabsEl.style.display = 'none'
    content.innerHTML = `
      <div class="status-card">
        <div class="status-icon">🔍</div>
        <div class="status-title">No savings found for this site</div>
        <div class="status-subtitle">We don't have deals or codes for <strong>${hostname}</strong> yet. Know a code? Submit it below!</div>
      </div>
      ${renderSubmitCodeSection(hostname)}
    `
    bindSubmitCode(hostname)
    return
  }

  // Show tabs
  tabsEl.style.display = 'flex'
  dealsCountEl.textContent = deals.length
  codesCountEl.textContent = allCodes.length

  // Determine initial tab: if checkout detected and has codes → codes tab
  if (checkoutState?.status === 'found' && allCodes.length) {
    _activeTab = 'codes'
  } else if (deals.length) {
    _activeTab = 'deals'
  } else {
    _activeTab = 'codes'
  }

  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === _activeTab)
  })

  // Build panels
  const dealsPanel = buildDealsPanel(deals, hostname, entry)
  const codesPanel = await buildCodesPanel(allCodes, checkoutState, tabId, hostname)

  content.innerHTML = `
    <div class="tab-panel ${_activeTab === 'deals' ? 'active' : ''}" id="panel-deals">
      ${dealsPanel}
    </div>
    <div class="tab-panel ${_activeTab === 'codes' ? 'active' : ''}" id="panel-codes">
      ${codesPanel}
      ${renderSubmitCodeSection(hostname)}
    </div>
  `

  bindDealsButtons(hostname, entry)
  bindCodesApplyButton(tabId, checkoutState)
  bindCopyButtons()
  bindSharePrompt()
  bindSubmitCode(hostname)
}

// ─── Deals Panel ─────────────────────────────────────────────────────────────

function buildDealsPanel(deals, hostname, entry) {
  if (!deals.length) {
    return `<div class="empty-state"><div class="icon">🏷️</div>No deals available right now.</div>`
  }

  const items = deals.map((deal, i) => `
    <div class="deal-card">
      <div class="deal-info">
        <span class="deal-discount">${deal.discount}</span>
        <div class="deal-desc">${deal.desc}</div>
      </div>
      <button class="btn-shop" data-deal-index="${i}">Shop →</button>
    </div>
  `).join('')

  return `<div class="deal-list">${items}</div>`
}

function bindDealsButtons(hostname, entry) {
  document.querySelectorAll('.btn-shop').forEach(btn => {
    btn.addEventListener('click', async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab?.url) return

      // Build affiliate URL
      let url = tab.url
      try {
        const u = new URL(url)
        const aff = getAffiliateConfigForEntry(entry)
        if (aff) {
          u.searchParams.set(aff.affiliateParam || aff.param, aff.affiliateTag || aff.tag)
          url = u.toString()
        }
      } catch {}

      // Open affiliate URL (or current page with tag)
      chrome.tabs.update(tab.id, { url })
      window.close()
    })
  })
}

function getAffiliateConfigForEntry(entry) {
  if (entry?.affiliateTag) {
    return { affiliateParam: entry.affiliateParam, affiliateTag: entry.affiliateTag }
  }
  return null
}

// ─── Codes Panel ─────────────────────────────────────────────────────────────

async function buildCodesPanel(allCodes, checkoutState, tabId, hostname) {
  if (!allCodes.length) {
    return `<div class="empty-state"><div class="icon">🏷️</div>No codes yet — be the first to submit one!</div>`
  }

  // Checkout CTA
  let ctaHtml = ''
  if (checkoutState?.status === 'found') {
    ctaHtml = `<button class="btn-primary" id="btn-apply">⚡ Try ${allCodes.length} Code${allCodes.length > 1 ? 's' : ''} Automatically</button>`
  } else if (checkoutState?.status === 'trying') {
    ctaHtml = `<button class="btn-primary" disabled><span class="loading-dots">Trying codes</span></button>`
  } else if (checkoutState?.status === 'applied') {
    ctaHtml = `
      <div class="success-badge">
        <div class="code">${checkoutState.appliedCode}</div>
        <div class="desc">${checkoutState.savings ? `Saved ${checkoutState.savings}` : 'Coupon applied!'}</div>
        ${checkoutState.savings ? `<span class="savings-pill">${checkoutState.savings} OFF</span>` : ''}
      </div>
      ${renderSharePrompt(checkoutState.savings, hostname)}
    `
  } else if (checkoutState?.status === 'failed') {
    ctaHtml = `
      <div class="status-card">
        <div class="status-icon">😞</div>
        <div class="status-title">No codes worked this time</div>
        <div class="status-subtitle">Know a working code? Submit it below!</div>
      </div>
    `
  }

  const items = allCodes.map(c => `
    <div class="code-card ${c.userSubmitted ? 'user-submitted' : ''}">
      <div class="code-meta">
        <div class="code-badge">${c.code}</div>
        <div class="code-desc">${c.desc}</div>
        ${c.userSubmitted ? '<div class="user-badge">👤 Community</div>' : ''}
      </div>
      <div class="code-actions">
        <span class="code-discount">${c.discount}</span>
        <button class="btn-copy" data-code="${c.code}" title="Copy code">📋</button>
      </div>
    </div>
  `).join('')

  // Show copy-fallback hint when auto-apply unavailable
  const copyHint = (checkoutState?.status === 'no_field')
    ? `<div class="copy-hint">⚠️ Auto-apply not available here — copy a code and paste it at checkout</div>`
    : ''

  return `
    ${ctaHtml}
    ${copyHint}
    <div class="code-list" style="margin-top:${ctaHtml || copyHint ? '10px' : '0'}">${items}</div>
  `
}

function bindCopyButtons() {
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = btn.dataset.code
      try {
        await navigator.clipboard.writeText(code)
        const orig = btn.textContent
        btn.textContent = '✓'
        btn.style.color = '#22c55e'
        setTimeout(() => {
          btn.textContent = orig
          btn.style.color = ''
        }, 1500)
      } catch {
        // Fallback: select text via temp input
        const tmp = document.createElement('input')
        tmp.value = code
        document.body.appendChild(tmp)
        tmp.select()
        document.execCommand('copy')
        document.body.removeChild(tmp)
        btn.textContent = '✓'
        setTimeout(() => { btn.textContent = '📋' }, 1500)
      }
    })
  })
}

function bindCodesApplyButton(tabId, checkoutState) {
  const btn = document.getElementById('btn-apply')
  if (!btn || !tabId) return

  btn.addEventListener('click', async () => {
    btn.disabled = true
    btn.innerHTML = '<span class="loading-dots">Trying codes</span>'
    await chrome.tabs.sendMessage(tabId, { type: 'TRY_COUPONS' })
    setTimeout(() => init(), 4000)
  })
}

// ─── Submit Code Section ──────────────────────────────────────────────────────

function renderSubmitCodeSection(hostname) {
  return `
    <div class="submit-section">
      <div class="submit-title">💡 Know a working code? Share it!</div>
      <div class="submit-row">
        <input type="text" class="input-code" id="input-submit-code"
          placeholder="e.g. SAVE20"
          maxlength="30"
          autocomplete="off"
          spellcheck="false" />
        <button class="btn-submit" id="btn-submit-code">Submit</button>
      </div>
      <div class="submit-feedback" id="submit-feedback"></div>
    </div>
  `
}

function bindSubmitCode(hostname) {
  const input = document.getElementById('input-submit-code')
  const btn = document.getElementById('btn-submit-code')
  const feedback = document.getElementById('submit-feedback')
  if (!input || !btn || !feedback) return

  // Uppercase as user types
  input.addEventListener('input', () => {
    const pos = input.selectionStart
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9\-_]/g, '')
    input.setSelectionRange(pos, pos)
  })

  btn.addEventListener('click', async () => {
    const code = input.value.trim()
    if (!code || code.length < 2) {
      showFeedback(feedback, 'Enter a valid code', 'error')
      return
    }

    btn.disabled = true
    const saved = await submitUserCode(hostname, code, '')

    if (saved) {
      input.value = ''
      showFeedback(feedback, `✓ "${code}" saved! It'll be tried next checkout.`, 'success')
      // Refresh codes count
      setTimeout(() => init(), 1500)
    } else {
      showFeedback(feedback, 'This code is already in the list.', 'error')
    }
    btn.disabled = false
  })

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click()
  })
}

function showFeedback(el, msg, type) {
  el.textContent = msg
  el.className = `submit-feedback ${type}`
  setTimeout(() => {
    el.textContent = ''
    el.className = 'submit-feedback'
  }, 4000)
}

// ─── Savings Counter ─────────────────────────────────────────────────────────

async function loadSavingsStrip() {
  try {
    const r = await chrome.storage.local.get([
      'savings_cents', 'coupons_applied',
      'total_checkout_sessions', 'total_codes_tried'
    ])
    const cents = r.savings_cents || 0
    const applied = r.coupons_applied || 0
    const sessions = r.total_checkout_sessions || 0
    const tried = r.total_codes_tried || 0

    const stripEl = document.getElementById('savings-strip')
    const amountEl = document.getElementById('savings-amount')
    const rateEl = document.getElementById('savings-rate')
    if (!stripEl || !amountEl) return

    if (cents > 0 || applied > 0) {
      // Primary display: dollar savings or coupon count
      if (cents > 0) {
        amountEl.textContent = '$' + (cents / 100).toFixed(2)
      } else {
        amountEl.textContent = applied + ' coupon' + (applied > 1 ? 's' : '')
      }
      stripEl.style.display = 'flex'

      // Secondary: success rate (only show if we have meaningful data)
      if (rateEl && sessions >= 3) {
        const rate = Math.round((applied / sessions) * 100)
        rateEl.textContent = `${rate}% success rate · ${sessions} sessions`
        rateEl.style.display = 'block'
      }
    }

    const shareBtn = document.getElementById('btn-share-savings')
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const savingsTxt = cents > 0
          ? '$' + (cents / 100).toFixed(2)
          : applied + ' coupon' + (applied > 1 ? 's' : '')
        const shareText = cents > 0
          ? `I saved ${savingsTxt} shopping online with @CouponSnap! 🎉 Free Chrome extension that automatically finds & applies coupon codes: ${GITHUB_RELEASE_URL} #savings #frugal`
          : `CouponSnap auto-applied ${savingsTxt} for me while shopping! Free Chrome extension: ${GITHUB_RELEASE_URL} #savings`
        chrome.tabs.create({ url: buildTweetUrl(shareText) })
      })
    }
  } catch {}
}

function buildTweetUrl(text) {
  return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text)
}

// ─── Share Prompt (after coupon applied) ─────────────────────────────────────

function renderSharePrompt(savingsText, hostname) {
  const storeLabel = hostname.replace(/^www\./, '')
  const savedLabel = savingsText || 'money'
  const shareMsg = savingsText
    ? `I saved ${savedLabel} on ${storeLabel} with @CouponSnap! 🎉 It automatically found and applied the coupon code for me. Get it free: ${GITHUB_RELEASE_URL} #savings #deals`
    : `Just used @CouponSnap on ${storeLabel} — free Chrome extension that auto-applies coupon codes at checkout! ${GITHUB_RELEASE_URL} #savings`
  return `
    <div class="share-prompt">
      <div class="share-prompt-title">🎉 Tell a friend and help them save too!</div>
      <div class="share-buttons">
        <button class="btn-tweet" data-tweet="${encodeURIComponent(shareMsg)}">𝕏 Tweet this</button>
        <button class="btn-copy-link" id="btn-copy-ext-link">Copy link</button>
      </div>
    </div>
  `
}

function bindSharePrompt() {
  document.querySelectorAll('.btn-tweet').forEach(btn => {
    btn.addEventListener('click', () => {
      const tweetUrl = buildTweetUrl(decodeURIComponent(btn.dataset.tweet))
      chrome.tabs.create({ url: tweetUrl })
    })
  })
  const copyLinkBtn = document.getElementById('btn-copy-ext-link')
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(GITHUB_RELEASE_URL)
        copyLinkBtn.textContent = '✓ Copied!'
        setTimeout(() => { copyLinkBtn.textContent = 'Copy link' }, 2000)
      } catch {}
    })
  }
}

// ─── Onboarding Tooltip ───────────────────────────────────────────────────────

async function maybeShowOnboarding() {
  try {
    const r = await chrome.storage.local.get('onboarding_seen')
    if (r.onboarding_seen) return

    const overlay = document.getElementById('onboarding-overlay')
    if (!overlay) return
    overlay.style.display = 'flex'

    document.getElementById('btn-get-started')?.addEventListener('click', async () => {
      overlay.style.display = 'none'
      await chrome.storage.local.set({ onboarding_seen: true })
    })
  } catch {}
}

// ─── Main Init ────────────────────────────────────────────────────────────────

async function init() {
  try {
    const tab = await getCurrentTab()
    if (!tab?.id || !tab?.url || !tab.url.startsWith('http')) {
      renderIdle()
      return
    }

    const hostname = new URL(tab.url).hostname
    const state = await getTabState(tab.id)

    await renderSiteFound(hostname, state, tab.id)
  } catch (e) {
    renderIdle()
  }
}

// ─── Feedback Link ────────────────────────────────────────────────────────────

document.getElementById('link-feedback')?.addEventListener('click', (e) => {
  e.preventDefault()
  chrome.tabs.create({ url: FEEDBACK_FORM_URL })
})

initTabs()
maybeShowOnboarding()
loadSavingsStrip()
init()
