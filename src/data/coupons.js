// CouponSnap Coupon Database — v4 (Deal Finder + Crowdsource)
// Remote-first: fetches from GitHub, falls back to bundled data
// Supports deals (affiliate links) + codes (promo codes) + user-submitted codes

import bundledCouponDB from './coupon-db.json'

// ─── Remote Data Config ───────────────────────────────────────────────────────

const REMOTE_COUPON_DB_URL = 'https://raw.githubusercontent.com/kennethlaw325/couponsnap/main/src/data/coupon-db.json'

const CACHE_KEY = 'coupon_db_cache'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000  // 24 hours
const USER_CODES_PREFIX = 'user_codes_'

// ─── Affiliate Config ─────────────────────────────────────────────────────────

export const AFFILIATE_CONFIG = {
  'amazon.com':    { param: 'tag',         tag: 'couponsnap09-20' },
  'amazon.ca':     { param: 'tag',         tag: 'couponsnap09-20' },
  'amazon.co.uk':  { param: 'tag',         tag: 'couponsnap09-20' },
  'walmart.com':   { param: 'wmlspartner', tag: 'couponsnap' },
  'target.com':    { param: 'afid',        tag: 'couponsnap' },
  'bestbuy.com':   { param: 'ref',         tag: 'couponsnap' },
  'ebay.com':      { param: 'campid',      tag: '5338999999' },
  'newegg.com':    { param: 'nm_mc',       tag: 'couponsnap' },
  'sephora.com':   { param: 'cm_mmc',      tag: 'couponsnap' },
  'nike.com':      { param: 'cp',          tag: 'couponsnap' },
  'adidas.com':    { param: 'utm_source',  tag: 'couponsnap' },
  'wayfair.com':   { param: 'refid',       tag: 'couponsnap' },
  'nordstrom.com': { param: 'refferer',    tag: 'couponsnap' },
  'macys.com':     { param: 'ID',          tag: 'couponsnap' },
  'homedepot.com': { param: 'MERCH',       tag: 'couponsnap' },
  'lowes.com':     { param: 'cm_mmc',      tag: 'couponsnap' },
  'chewy.com':     { param: 'ref',         tag: 'couponsnap' },
  'booking.com':   { param: 'aid',         tag: '2311285' },
  'expedia.com':   { param: 'affcid',      tag: 'couponsnap' },
}

// ─── Cache Management ─────────────────────────────────────────────────────────

async function getCachedDB() {
  try {
    const result = await chrome.storage.local.get(CACHE_KEY)
    const cached = result[CACHE_KEY]
    if (cached && cached.data && (Date.now() - cached.ts) < CACHE_TTL_MS) {
      return cached.data
    }
  } catch {}
  return null
}

async function setCachedDB(data) {
  try {
    await chrome.storage.local.set({
      [CACHE_KEY]: { data, ts: Date.now() }
    })
  } catch {}
}

// ─── Remote Fetch ─────────────────────────────────────────────────────────────

async function fetchRemoteDB() {
  if (REMOTE_COUPON_DB_URL.includes('YOUR_USERNAME')) return null
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const resp = await fetch(REMOTE_COUPON_DB_URL, {
      signal: controller.signal,
      cache: 'no-store'
    })
    clearTimeout(timeout)
    if (!resp.ok) return null
    const data = await resp.json()
    if (Array.isArray(data) && data.length > 0) {
      await setCachedDB(data)
      return data
    }
  } catch {}
  return null
}

// ─── Active DB ────────────────────────────────────────────────────────────────

let _activeDB = bundledCouponDB

;(async () => {
  const cached = await getCachedDB()
  if (cached) _activeDB = cached
  const remote = await fetchRemoteDB()
  if (remote) _activeDB = remote
})()

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeHost(hostname) {
  return hostname.replace(/^www\./, '')
}

function storageKeyForDomain(domain) {
  return USER_CODES_PREFIX + normalizeHost(domain)
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getCouponsForDomain(hostname) {
  const host = normalizeHost(hostname)
  return _activeDB.find(entry => {
    const entryDomain = normalizeHost(entry.domain)
    return host === entryDomain || host.endsWith('.' + entryDomain)
  }) || null
}

export function getAffiliateConfig(hostname) {
  const host = normalizeHost(hostname)
  for (const [domain, config] of Object.entries(AFFILIATE_CONFIG)) {
    if (host === domain || host.endsWith('.' + domain)) {
      return config
    }
  }
  return null
}

export function injectAffiliateTag(url, hostname) {
  const config = getAffiliateConfig(hostname)
  if (!config) return url
  try {
    const u = new URL(url)
    u.searchParams.set(config.param, config.tag)
    return u.toString()
  } catch {
    return url
  }
}

/**
 * Get user-submitted codes for a domain from local storage.
 * Returns array of {code, desc, discount, submittedAt}
 */
export async function getUserSubmittedCodes(hostname) {
  const key = storageKeyForDomain(hostname)
  try {
    const result = await chrome.storage.local.get(key)
    return result[key] || []
  } catch {
    return []
  }
}

/**
 * Submit a user code for a domain. Stored locally in chrome.storage.
 * @param {string} hostname
 * @param {string} code - the promo code (will be uppercased)
 * @param {string} desc - optional description
 * @returns {boolean} true if saved, false if duplicate
 */
export async function submitUserCode(hostname, code, desc = '') {
  const normalizedCode = code.trim().toUpperCase()
  if (!normalizedCode || normalizedCode.length < 2) return false

  const key = storageKeyForDomain(hostname)
  try {
    const result = await chrome.storage.local.get(key)
    const existing = result[key] || []

    // Check for duplicate
    if (existing.some(c => c.code === normalizedCode)) return false

    existing.unshift({
      code: normalizedCode,
      desc: desc.trim() || `Community code for ${normalizeHost(hostname)}`,
      discount: 'Community',
      submittedAt: Date.now(),
      userSubmitted: true
    })

    // Keep max 20 user-submitted codes per domain
    await chrome.storage.local.set({ [key]: existing.slice(0, 20) })
    return true
  } catch {
    return false
  }
}

/**
 * Get all codes for a domain: bundled + user-submitted merged.
 * User-submitted codes appear first.
 */
export async function getAllCodesForDomain(hostname) {
  const entry = getCouponsForDomain(hostname)
  const bundled = entry?.codes || []
  const userCodes = await getUserSubmittedCodes(hostname)

  // Merge: user codes first, then bundled (no duplicates)
  const seen = new Set(userCodes.map(c => c.code.toUpperCase()))
  const merged = [...userCodes]
  for (const c of bundled) {
    if (!seen.has(c.code.toUpperCase())) {
      merged.push(c)
      seen.add(c.code.toUpperCase())
    }
  }
  return merged
}

export async function refreshCouponDB() {
  const remote = await fetchRemoteDB()
  if (remote) _activeDB = remote
  return _activeDB.length
}

export { bundledCouponDB as couponDB }
