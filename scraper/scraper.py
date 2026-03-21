#!/usr/bin/env python3
"""
CouponSnap Scraper — coupons.com Deal Descriptions + Crowdsource Codes
Scrapes coupons.com for deal descriptions (affiliate-linkable).
Falls back to seed data for promo codes.

Usage:
  python scraper.py                  # Full run
  python scraper.py --domain nike    # Single domain debug
  python scraper.py --dry-run        # Print output without writing
  python scraper.py --seed-only      # Fast, no browser

Requirements:
  pip install playwright requests
  playwright install chromium
"""

import json
import time
import random
import re
import sys
import argparse
import os
from datetime import datetime

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False
    print("WARNING: playwright not installed. Run: pip install playwright && playwright install chromium")

# ─── Config ───────────────────────────────────────────────────────────────────

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'coupon-db.json')

# coupons.com URL slug mappings (domain → slug)
COUPONS_COM_SLUGS = {
    'amazon.com':       'amazon',
    'walmart.com':      'walmart',
    'target.com':       'target',
    'ebay.com':         'ebay',
    'bestbuy.com':      'best-buy',
    'newegg.com':       'newegg',
    'sephora.com':      'sephora',
    'nike.com':         'nike',
    'adidas.com':       'adidas',
    'wayfair.com':      'wayfair',
    'nordstrom.com':    'nordstrom',
    'macys.com':        'macys',
    'homedepot.com':    'home-depot',
    'lowes.com':        'lowes',
    'chewy.com':        'chewy',
    'kohls.com':        'kohls',
    'gap.com':          'gap',
    'oldnavy.com':      'old-navy',
    'asos.com':         'asos',
    'underarmour.com':  'under-armour',
    'cvs.com':          'cvs',
    'walgreens.com':    'walgreens',
    'ulta.com':         'ulta-beauty',
    'doordash.com':     'doordash',
    'expedia.com':      'expedia',
    'booking.com':      'booking-com',
    'petco.com':        'petco',
    'petsmart.com':     'petsmart',
    'hm.com':           'h-m',
    'zara.com':         'zara',
    'forever21.com':    'forever-21',
    'ae.com':           'american-eagle',
    'hollister.com':    'hollister',
    'reebok.com':       'reebok',
    'puma.com':         'puma',
    'overstock.com':    'overstock',
    'costco.com':       'costco',
    'bathandbodyworks.com': 'bath-body-works',
    'dominos.com':      'dominos',
    'papajohns.com':    'papa-johns',
    'ubereats.com':     'uber-eats',
    'grubhub.com':      'grubhub',
    'instacart.com':    'instacart',
    'hotels.com':       'hotels-com',
    'airbnb.com':       'airbnb',
    'apple.com':        'apple',
    'microsoft.com':    'microsoft',
}

TARGET_DOMAINS = list(COUPONS_COM_SLUGS.keys())

REQUEST_DELAY_MIN = 2.0
REQUEST_DELAY_MAX = 4.0
PAGE_TIMEOUT = 20000

# ─── Seed data (fallback promo codes) ─────────────────────────────────────────

SEED_CODES = {
    'amazon.com': [
        {'code': 'SAVE10', 'desc': '10% off select items', 'discount': '10%'},
        {'code': 'PRIME20', 'desc': '20% off for Prime members', 'discount': '20%'},
        {'code': 'WELCOME5', 'desc': '$5 off first order', 'discount': '$5'},
        {'code': 'AMZFRESH10', 'desc': '10% off grocery', 'discount': '10%'},
        {'code': 'SPRING15', 'desc': '15% off spring sale', 'discount': '15%'},
        {'code': 'TECH10', 'desc': '10% off electronics', 'discount': '10%'},
    ],
    'walmart.com': [
        {'code': 'WMTSHIP', 'desc': 'Free shipping on $35+', 'discount': 'Free Shipping'},
        {'code': 'SAVE15WMT', 'desc': '15% off select items', 'discount': '15%'},
        {'code': 'WMT20', 'desc': '20% off first pickup order', 'discount': '20%'},
        {'code': 'GROCERY5', 'desc': '$5 off grocery $50+', 'discount': '$5'},
    ],
    'target.com': [
        {'code': 'TARGET10', 'desc': '10% off your order', 'discount': '10%'},
        {'code': 'CIRCLE20', 'desc': '20% off for Circle members', 'discount': '20%'},
        {'code': 'HOME10', 'desc': '10% off home items', 'discount': '10%'},
        {'code': 'BEAUTY20', 'desc': '20% off beauty', 'discount': '20%'},
        {'code': 'TGT25', 'desc': '25% off clothing', 'discount': '25%'},
    ],
    'ebay.com': [
        {'code': 'EBAYSAVE', 'desc': '5% off eligible items', 'discount': '5%'},
        {'code': 'EXTRA10', 'desc': 'Extra 10% off select categories', 'discount': '10%'},
        {'code': 'DEALS15', 'desc': '15% off daily deals', 'discount': '15%'},
    ],
    'bestbuy.com': [
        {'code': 'BBYTECH10', 'desc': '10% off electronics', 'discount': '10%'},
        {'code': 'MEMBER15', 'desc': '15% off for My Best Buy members', 'discount': '15%'},
        {'code': 'SHIP50', 'desc': 'Free shipping on $50+', 'discount': 'Free Shipping'},
    ],
    'newegg.com': [
        {'code': 'NEWEGG5', 'desc': '$5 off $50+', 'discount': '$5'},
        {'code': 'PC10OFF', 'desc': '10% off PC components', 'discount': '10%'},
        {'code': 'SHIP25', 'desc': 'Free shipping on $25+', 'discount': 'Free Shipping'},
    ],
    'sephora.com': [
        {'code': 'BEAUTY15', 'desc': '15% off beauty products', 'discount': '15%'},
        {'code': 'VIB20', 'desc': '20% off for VIB members', 'discount': '20%'},
        {'code': 'FREESHIP', 'desc': 'Free shipping on $50+', 'discount': 'Free Shipping'},
    ],
    'nike.com': [
        {'code': 'NIKE10', 'desc': '10% off your order', 'discount': '10%'},
        {'code': 'MEMBER20', 'desc': '20% off for Nike members', 'discount': '20%'},
        {'code': 'SALE25', 'desc': 'Extra 25% off sale items', 'discount': '25%'},
    ],
    'adidas.com': [
        {'code': 'ADIDAS15', 'desc': '15% off full price items', 'discount': '15%'},
        {'code': 'CREATOR20', 'desc': '20% off for creators club', 'discount': '20%'},
        {'code': 'SALE30', 'desc': 'Extra 30% off sale', 'discount': '30%'},
    ],
    'wayfair.com': [
        {'code': 'WAY10', 'desc': '10% off your first order', 'discount': '10%'},
        {'code': 'FREESHIP', 'desc': 'Free shipping on $35+', 'discount': 'Free Shipping'},
        {'code': 'HOME15', 'desc': '15% off home furniture', 'discount': '15%'},
    ],
    'nordstrom.com': [
        {'code': 'NORD10', 'desc': '10% off your order', 'discount': '10%'},
        {'code': 'CLEARANCE20', 'desc': 'Extra 20% off clearance', 'discount': '20%'},
    ],
    'macys.com': [
        {'code': 'SAVE20', 'desc': '20% off your purchase', 'discount': '20%'},
        {'code': 'FRIEND25', 'desc': '25% off friends & family', 'discount': '25%'},
        {'code': 'EXTRA15', 'desc': 'Extra 15% off sale', 'discount': '15%'},
    ],
    'homedepot.com': [
        {'code': 'HD10', 'desc': '10% off your order', 'discount': '10%'},
        {'code': 'SPRING20', 'desc': '20% off garden items', 'discount': '20%'},
    ],
    'lowes.com': [
        {'code': 'LOWES10', 'desc': '10% off your purchase', 'discount': '10%'},
        {'code': 'PRO5', 'desc': '5% off for Pro members', 'discount': '5%'},
    ],
    'chewy.com': [
        {'code': 'CHEWY15', 'desc': '15% off your first order', 'discount': '15%'},
        {'code': 'PET10', 'desc': '10% off pet supplies', 'discount': '10%'},
        {'code': 'AUTOSHIP5', 'desc': '5% off autoship orders', 'discount': '5%'},
    ],
    'kohls.com': [
        {'code': 'SAVE30', 'desc': '30% off your order', 'discount': '30%'},
        {'code': 'KOHLS15', 'desc': '15% off sale items', 'discount': '15%'},
        {'code': 'EXTRA20', 'desc': 'Extra 20% off', 'discount': '20%'},
    ],
    'gap.com': [
        {'code': 'GAP40', 'desc': '40% off your purchase', 'discount': '40%'},
        {'code': 'EXTRA30', 'desc': 'Extra 30% off sale', 'discount': '30%'},
    ],
    'oldnavy.com': [
        {'code': 'NAVY50', 'desc': '50% off everything', 'discount': '50%'},
        {'code': 'FAMILY30', 'desc': '30% off family styles', 'discount': '30%'},
    ],
    'asos.com': [
        {'code': 'ASOS20', 'desc': '20% off your order', 'discount': '20%'},
        {'code': 'STUDENT10', 'desc': '10% student discount', 'discount': '10%'},
    ],
    'underarmour.com': [
        {'code': 'UA25', 'desc': '25% off your order', 'discount': '25%'},
        {'code': 'SPORT20', 'desc': '20% off sports gear', 'discount': '20%'},
    ],
    'cvs.com': [
        {'code': 'CVS30', 'desc': '30% off your order', 'discount': '30%'},
        {'code': 'EXTRA25', 'desc': 'Extra 25% off beauty', 'discount': '25%'},
    ],
    'walgreens.com': [
        {'code': 'WAGS20', 'desc': '20% off online orders', 'discount': '20%'},
        {'code': 'HEALTH15', 'desc': '15% off health items', 'discount': '15%'},
    ],
    'ulta.com': [
        {'code': 'ULTA20', 'desc': '20% off your purchase', 'discount': '20%'},
        {'code': 'BEAUTY15', 'desc': '15% off beauty essentials', 'discount': '15%'},
    ],
    'doordash.com': [
        {'code': 'DASH25', 'desc': '$25 off your first 3 orders', 'discount': '$25'},
        {'code': 'FREEDELIVER', 'desc': 'Free delivery for 30 days', 'discount': 'Free Delivery'},
    ],
    'expedia.com': [
        {'code': 'TRAVEL10', 'desc': '10% off hotels', 'discount': '10%'},
        {'code': 'PACKAGE20', 'desc': '20% off vacation packages', 'discount': '20%'},
    ],
    'booking.com': [
        {'code': 'BOOK10', 'desc': '10% off selected hotels', 'discount': '10%'},
        {'code': 'GENIUS15', 'desc': '15% off for Genius members', 'discount': '15%'},
    ],
    'petco.com': [
        {'code': 'PETCO15', 'desc': '15% off your order', 'discount': '15%'},
        {'code': 'VITAL20', 'desc': '20% off Vital Care members', 'discount': '20%'},
    ],
    'petsmart.com': [
        {'code': 'PET20', 'desc': '20% off pet supplies', 'discount': '20%'},
        {'code': 'ADOPT15', 'desc': '15% off with adoption', 'discount': '15%'},
    ],
}

STORE_NAMES = {
    'amazon.com': 'Amazon', 'walmart.com': 'Walmart', 'target.com': 'Target',
    'ebay.com': 'eBay', 'bestbuy.com': 'Best Buy', 'newegg.com': 'Newegg',
    'sephora.com': 'Sephora', 'nike.com': 'Nike', 'adidas.com': 'Adidas',
    'wayfair.com': 'Wayfair', 'nordstrom.com': 'Nordstrom', 'macys.com': "Macy's",
    'homedepot.com': 'Home Depot', 'lowes.com': "Lowe's", 'chewy.com': 'Chewy',
    'kohls.com': "Kohl's", 'gap.com': 'Gap', 'oldnavy.com': 'Old Navy',
    'asos.com': 'ASOS', 'underarmour.com': 'Under Armour', 'cvs.com': 'CVS',
    'walgreens.com': 'Walgreens', 'ulta.com': 'Ulta Beauty', 'doordash.com': 'DoorDash',
    'expedia.com': 'Expedia', 'booking.com': 'Booking.com', 'petco.com': 'Petco',
    'petsmart.com': 'PetSmart', 'hm.com': 'H&M', 'zara.com': 'Zara',
    'forever21.com': 'Forever 21', 'ae.com': 'American Eagle', 'hollister.com': 'Hollister',
    'reebok.com': 'Reebok', 'puma.com': 'Puma', 'overstock.com': 'Overstock',
    'costco.com': 'Costco', 'bathandbodyworks.com': 'Bath & Body Works',
    'dominos.com': "Domino's", 'papajohns.com': "Papa John's", 'ubereats.com': 'Uber Eats',
    'grubhub.com': 'Grubhub', 'instacart.com': 'Instacart', 'hotels.com': 'Hotels.com',
    'airbnb.com': 'Airbnb', 'apple.com': 'Apple', 'microsoft.com': 'Microsoft',
}

AFFILIATE_CONFIG = {
    'amazon.com': {'affiliateTag': 'couponsnap09-20', 'affiliateParam': 'tag'},
}

# ─── Helpers ──────────────────────────────────────────────────────────────────

def extract_discount(text):
    if not text:
        return 'Discount'
    pct = re.search(r'(\d+)%', text)
    if pct:
        return f"{pct.group(1)}%"
    dollar = re.search(r'\$(\d+(?:\.\d{2})?)', text)
    if dollar:
        return f"${dollar.group(1)}"
    low = text.lower()
    if 'free shipping' in low or 'free delivery' in low:
        return 'Free Shipping'
    if 'free' in low:
        return 'Free Item'
    if 'buy' in low and 'get' in low:
        return 'BOGO'
    return 'Discount'


def make_browser_context(playwright):
    browser = playwright.chromium.launch(
        headless=True,
        args=['--no-sandbox', '--disable-dev-shm-usage', '--disable-blink-features=AutomationControlled']
    )
    context = browser.new_context(
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        viewport={'width': 1280, 'height': 800},
        locale='en-US',
    )
    context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return browser, context


# ─── coupons.com Deal Scraper ──────────────────────────────────────────────────

def scrape_coupons_com_deals(page, domain):
    """
    Scrape deal descriptions from coupons.com.
    Returns list of: {"desc": "...", "discount": "..."}
    These are affiliate-linkable deals (no code needed).
    """
    slug = COUPONS_COM_SLUGS.get(domain)
    if not slug:
        return []

    url = f"https://www.coupons.com/coupon-codes/{slug}/"
    deals = []

    try:
        page.goto(url, timeout=PAGE_TIMEOUT, wait_until='domcontentloaded')
        try:
            page.wait_for_selector('[class*="offer"], [class*="deal"], [class*="coupon"]', timeout=8000)
        except PlaywrightTimeout:
            pass

        content = page.content()

        # Strategy 1: JSON-LD structured data
        json_ld_matches = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', content, re.DOTALL)
        for block in json_ld_matches:
            try:
                data = json.loads(block)
                if isinstance(data, list):
                    data = data[0] if data else {}
                offers = data.get('offers', [])
                if isinstance(offers, dict):
                    offers = [offers]
                for offer in offers[:5]:
                    desc = offer.get('description') or offer.get('name') or ''
                    if desc and len(desc) > 10:
                        deals.append({
                            'desc': desc.strip()[:120],
                            'discount': extract_discount(desc)
                        })
            except:
                pass

        # Strategy 2: DOM — look for offer title/description elements
        if len(deals) < 3:
            selectors = [
                '[class*="offer-title"]', '[class*="deal-title"]',
                '[class*="offer-description"]', '[class*="deal-description"]',
                'h3[class*="offer"]', 'h2[class*="deal"]',
                '[data-testid*="offer"] h3', '[data-testid*="deal"] h3',
            ]
            for selector in selectors:
                try:
                    els = page.query_selector_all(selector)
                    for el in els[:5]:
                        text = (el.inner_text() or '').strip()
                        if len(text) > 10 and len(text) < 150:
                            if not any(d['desc'] == text for d in deals):
                                deals.append({
                                    'desc': text[:120],
                                    'discount': extract_discount(text)
                                })
                except:
                    continue

        # Strategy 3: Meta description & title patterns
        if len(deals) < 2:
            meta_match = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']{20,200})["\']', content, re.IGNORECASE)
            if meta_match:
                meta_desc = meta_match.group(1)
                # Extract individual savings mentions
                savings = re.findall(r'(?:save|get|earn|up to)\s+(?:\$\d+|\d+%)[^,.;]*', meta_desc, re.IGNORECASE)
                for s in savings[:3]:
                    s = s.strip()
                    if not any(d['desc'].lower() == s.lower() for d in deals):
                        deals.append({'desc': s[:120], 'discount': extract_discount(s)})

    except PlaywrightTimeout:
        print(f"      Timeout loading coupons.com/{slug}")
    except Exception as e:
        print(f"      Error scraping coupons.com/{slug}: {e}")

    return deals[:5]


# ─── Build DB ─────────────────────────────────────────────────────────────────

def build_coupon_db(domains=None, verbose=True, seed_only=False):
    if domains is None:
        domains = TARGET_DOMAINS

    result = []

    if seed_only or not PLAYWRIGHT_AVAILABLE:
        if not seed_only:
            print("Playwright unavailable — using seed data only")
        # Load existing DB to preserve scraped deals
        existing_db = {}
        if os.path.exists(OUTPUT_PATH):
            try:
                with open(OUTPUT_PATH, 'r', encoding='utf-8') as f:
                    for entry in json.load(f):
                        existing_db[entry['domain']] = entry
            except:
                pass

        for domain in domains:
            codes = SEED_CODES.get(domain, [])
            existing = existing_db.get(domain, {})
            entry = {
                'domain': domain,
                'name': STORE_NAMES.get(domain, domain.split('.')[0].title()),
                'deals': existing.get('deals', []),
                'codes': codes,
            }
            aff = AFFILIATE_CONFIG.get(domain)
            if aff:
                entry.update(aff)
            if entry['codes'] or entry['deals']:
                result.append(entry)
        return result

    with sync_playwright() as p:
        browser, context = make_browser_context(p)
        page = context.new_page()

        try:
            for domain in domains:
                if verbose:
                    print(f"\n[{domain}]")

                entry = {
                    'domain': domain,
                    'name': STORE_NAMES.get(domain, domain.split('.')[0].title()),
                    'deals': [],
                    'codes': SEED_CODES.get(domain, []),
                }
                aff = AFFILIATE_CONFIG.get(domain)
                if aff:
                    entry.update(aff)

                # Scrape deals from coupons.com
                if COUPONS_COM_SLUGS.get(domain):
                    print(f"  Scraping coupons.com/{COUPONS_COM_SLUGS[domain]}...")
                    deals = scrape_coupons_com_deals(page, domain)
                    if deals:
                        entry['deals'] = deals
                        print(f"    ✓ Got {len(deals)} deal descriptions")
                    else:
                        print(f"    → No deals scraped, using seed data")
                    time.sleep(random.uniform(REQUEST_DELAY_MIN, REQUEST_DELAY_MAX))

                if entry['codes'] or entry['deals']:
                    result.append(entry)
                    if verbose:
                        print(f"    Total: {len(entry['deals'])} deals, {len(entry['codes'])} codes")

        finally:
            browser.close()

    return result


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='CouponSnap Scraper — Deal Finder Edition')
    parser.add_argument('--domain', help='Scrape single domain only')
    parser.add_argument('--dry-run', action='store_true', help='Print output without writing')
    parser.add_argument('--quiet', action='store_true', help='Minimal output')
    parser.add_argument('--seed-only', action='store_true', help='Use seed data only (fast, no browser)')
    args = parser.parse_args()

    start = datetime.now()
    print(f"CouponSnap Scraper (Deal Finder) — {start.strftime('%Y-%m-%d %H:%M:%S')}")
    mode = 'seed-only' if args.seed_only else 'live scrape (coupons.com)'
    print(f"Target: {args.domain or f'{len(TARGET_DOMAINS)} domains'} [{mode}]")
    print()

    domains = [args.domain] if args.domain else TARGET_DOMAINS
    db = build_coupon_db(domains, verbose=not args.quiet, seed_only=args.seed_only)

    total_deals = sum(len(e.get('deals', [])) for e in db)
    total_codes = sum(len(e.get('codes', [])) for e in db)
    elapsed = (datetime.now() - start).total_seconds()

    print(f"\n{'─' * 40}")
    print(f"Done: {len(db)} stores, {total_deals} deals, {total_codes} codes ({elapsed:.1f}s)")

    output = json.dumps(db, indent=2, ensure_ascii=False)

    if args.dry_run:
        print("\n--- Output preview ---")
        print(output[:2000])
    else:
        out_path = os.path.abspath(OUTPUT_PATH)
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"Written to: {out_path}")


if __name__ == '__main__':
    main()
