(() => {
  // src/data/coupon-db.json
  var coupon_db_default = [
    {
      domain: "amazon.com",
      name: "Amazon",
      deals: [
        { desc: "Up to 50% off in Today's Deals", discount: "Up to 50%" },
        { desc: "Free shipping on orders over $25 with Prime", discount: "Free Shipping" },
        { desc: "Extra savings on Spring Sale \u2014 electronics, home & more", discount: "Up to 40%" }
      ],
      codes: [
        { code: "SAVE10", desc: "10% off select items", discount: "10%" },
        { code: "PRIME20", desc: "20% off for Prime members", discount: "20%" },
        { code: "WELCOME5", desc: "$5 off first order", discount: "$5" },
        { code: "AMZFRESH10", desc: "10% off grocery", discount: "10%" },
        { code: "SPRING15", desc: "15% off spring sale", discount: "15%" },
        { code: "TECH10", desc: "10% off electronics", discount: "10%" }
      ],
      affiliateTag: "couponsnap09-20",
      affiliateParam: "tag"
    },
    {
      domain: "walmart.com",
      name: "Walmart",
      deals: [
        { desc: "Rollback prices \u2014 thousands of items on sale", discount: "Up to 30%" },
        { desc: "Free 2-day shipping on $35+ orders", discount: "Free Shipping" },
        { desc: "Grocery savings \u2014 fresh produce & pantry staples", discount: "Up to 20%" }
      ],
      codes: [
        { code: "WMTSHIP", desc: "Free shipping on $35+", discount: "Free Shipping" },
        { code: "SAVE15WMT", desc: "15% off select items", discount: "15%" },
        { code: "WMT20", desc: "20% off first pickup order", discount: "20%" },
        { code: "GROCERY5", desc: "$5 off grocery $50+", discount: "$5" },
        { code: "ROLLBACK10", desc: "Extra 10% off rollback items", discount: "10%" }
      ]
    },
    {
      domain: "target.com",
      name: "Target",
      deals: [
        { desc: "Circle Week \u2014 exclusive deals for Circle members", discount: "Up to 50%" },
        { desc: "Buy 2 get 1 free on toys & games", discount: "Buy 2 Get 1" },
        { desc: "20% off home essentials this week", discount: "20%" }
      ],
      codes: [
        { code: "TARGET10", desc: "10% off your order", discount: "10%" },
        { code: "CIRCLE20", desc: "20% off for Circle members", discount: "20%" },
        { code: "HOME10", desc: "10% off home items", discount: "10%" },
        { code: "BEAUTY20", desc: "20% off beauty", discount: "20%" },
        { code: "TGT25", desc: "25% off clothing", discount: "25%" }
      ]
    },
    {
      domain: "ebay.com",
      name: "eBay",
      deals: [
        { desc: "Daily Deals \u2014 limited time offers updated every day", discount: "Up to 60%" },
        { desc: "Refurbished electronics certified by eBay", discount: "Up to 50%" },
        { desc: "Free returns on millions of items", discount: "Free Returns" }
      ],
      codes: [
        { code: "EBAYSAVE", desc: "5% off eligible items", discount: "5%" },
        { code: "EXTRA10", desc: "Extra 10% off select categories", discount: "10%" },
        { code: "DEALS15", desc: "15% off daily deals", discount: "15%" }
      ]
    },
    {
      domain: "bestbuy.com",
      name: "Best Buy",
      deals: [
        { desc: "Deals of the Day \u2014 tech, appliances & more", discount: "Up to 40%" },
        { desc: "Open-box items \u2014 like new at a fraction of the cost", discount: "Up to 35%" },
        { desc: "Free next-day delivery on thousands of items", discount: "Free Delivery" }
      ],
      codes: [
        { code: "BBYTECH10", desc: "10% off electronics", discount: "10%" },
        { code: "MEMBER15", desc: "15% off for My Best Buy members", discount: "15%" },
        { code: "SHIP50", desc: "Free shipping on $50+", discount: "Free Shipping" }
      ]
    },
    {
      domain: "newegg.com",
      name: "Newegg",
      deals: [
        { desc: "Shell Shocker \u2014 hourly flash deals on PC parts", discount: "Up to 50%" },
        { desc: "Combo deals \u2014 save more when you bundle", discount: "Up to 30%" },
        { desc: "Rebate Center \u2014 extra savings after purchase", discount: "Extra Rebates" }
      ],
      codes: [
        { code: "NEWEGG5", desc: "$5 off $50+", discount: "$5" },
        { code: "PC10OFF", desc: "10% off PC components", discount: "10%" },
        { code: "SHIP25", desc: "Free shipping on $25+", discount: "Free Shipping" }
      ]
    },
    {
      domain: "sephora.com",
      name: "Sephora",
      deals: [
        { desc: "Beauty Insider Sale \u2014 up to 20% off for members", discount: "Up to 20%" },
        { desc: "Free 3-piece gift with $65+ purchase", discount: "Free Gift" },
        { desc: "Sale on skincare must-haves \u2014 limited time", discount: "Up to 30%" }
      ],
      codes: [
        { code: "BEAUTY15", desc: "15% off beauty products", discount: "15%" },
        { code: "VIB20", desc: "20% off for VIB members", discount: "20%" },
        { code: "FREESHIP", desc: "Free shipping on $50+", discount: "Free Shipping" }
      ]
    },
    {
      domain: "nike.com",
      name: "Nike",
      deals: [
        { desc: "Sale section \u2014 up to 50% off select styles", discount: "Up to 50%" },
        { desc: "Member-exclusive deals \u2014 extra savings for Nike members", discount: "Up to 25%" },
        { desc: "Free standard shipping on orders $50+", discount: "Free Shipping" }
      ],
      codes: [
        { code: "NIKE10", desc: "10% off your order", discount: "10%" },
        { code: "MEMBER20", desc: "20% off for Nike members", discount: "20%" },
        { code: "SALE25", desc: "Extra 25% off sale items", discount: "25%" }
      ]
    },
    {
      domain: "adidas.com",
      name: "Adidas",
      deals: [
        { desc: "Sale \u2014 up to 50% off shoes, clothing & accessories", discount: "Up to 50%" },
        { desc: "adiClub exclusive discounts for members", discount: "Up to 30%" },
        { desc: "Free shipping & free returns on all orders", discount: "Free Shipping" }
      ],
      codes: [
        { code: "ADIDAS15", desc: "15% off full price items", discount: "15%" },
        { code: "CREATOR20", desc: "20% off for creators club", discount: "20%" },
        { code: "SALE30", desc: "Extra 30% off sale", discount: "30%" }
      ]
    },
    {
      domain: "wayfair.com",
      name: "Wayfair",
      deals: [
        { desc: "Way Day Sale \u2014 huge discounts on furniture & decor", discount: "Up to 60%" },
        { desc: "Clearance \u2014 thousands of items up to 70% off", discount: "Up to 70%" },
        { desc: "Free shipping on all orders $35+", discount: "Free Shipping" }
      ],
      codes: [
        { code: "WAY10", desc: "10% off your first order", discount: "10%" },
        { code: "FREESHIP", desc: "Free shipping on $35+", discount: "Free Shipping" },
        { code: "HOME15", desc: "15% off home furniture", discount: "15%" }
      ]
    },
    {
      domain: "nordstrom.com",
      name: "Nordstrom",
      deals: [
        { desc: "Anniversary Sale \u2014 limited time designer deals", discount: "Up to 40%" },
        { desc: "Clearance \u2014 extra 25% off marked down styles", discount: "Up to 25%" },
        { desc: "Free shipping & returns on all orders", discount: "Free Shipping" }
      ],
      codes: [
        { code: "NORD10", desc: "10% off your order", discount: "10%" },
        { code: "CLEARANCE20", desc: "Extra 20% off clearance", discount: "20%" }
      ]
    },
    {
      domain: "macys.com",
      name: "Macy's",
      deals: [
        { desc: "Friends & Family Event \u2014 25% off almost everything", discount: "25%" },
        { desc: "Flash sale \u2014 extra 40% off clearance items today only", discount: "40%" },
        { desc: "Free standard shipping on $25+ orders", discount: "Free Shipping" }
      ],
      codes: [
        { code: "SAVE20", desc: "20% off your purchase", discount: "20%" },
        { code: "FRIEND25", desc: "25% off friends & family", discount: "25%" },
        { code: "EXTRA15", desc: "Extra 15% off sale", discount: "15%" }
      ]
    },
    {
      domain: "homedepot.com",
      name: "Home Depot",
      deals: [
        { desc: "Spring Black Friday \u2014 tools, garden & appliances on sale", discount: "Up to 40%" },
        { desc: "Deals of the Month \u2014 rotating monthly savings", discount: "Up to 30%" },
        { desc: "Free delivery on $45+ orders", discount: "Free Delivery" }
      ],
      codes: [
        { code: "HD10", desc: "10% off your order", discount: "10%" },
        { code: "SPRING20", desc: "20% off garden items", discount: "20%" }
      ]
    },
    {
      domain: "lowes.com",
      name: "Lowe's",
      deals: [
        { desc: "Spring savings on garden, tools & home improvement", discount: "Up to 30%" },
        { desc: "Appliance special buys \u2014 limited quantities", discount: "Up to 35%" },
        { desc: "Free delivery on select major appliances $299+", discount: "Free Delivery" }
      ],
      codes: [
        { code: "LOWES10", desc: "10% off your purchase", discount: "10%" },
        { code: "PRO5", desc: "5% off for Pro members", discount: "5%" }
      ]
    },
    {
      domain: "chewy.com",
      name: "Chewy",
      deals: [
        { desc: "Autoship & save \u2014 extra 5% off recurring orders", discount: "5%" },
        { desc: "Flash deals \u2014 limited time pet supply savings", discount: "Up to 40%" },
        { desc: "Free shipping on orders $49+", discount: "Free Shipping" }
      ],
      codes: [
        { code: "CHEWY15", desc: "15% off your first order", discount: "15%" },
        { code: "PET10", desc: "10% off pet supplies", discount: "10%" },
        { code: "AUTOSHIP5", desc: "5% off autoship orders", discount: "5%" }
      ]
    },
    {
      domain: "kohls.com",
      name: "Kohl's",
      deals: [
        { desc: "Kohl's Cash \u2014 earn $10 for every $50 spent", discount: "Kohl's Cash" },
        { desc: "Clearance \u2014 extra 15-30% off already reduced items", discount: "Up to 30%" },
        { desc: "Free shipping on orders $25+", discount: "Free Shipping" }
      ],
      codes: [
        { code: "SAVE30", desc: "30% off your order", discount: "30%" },
        { code: "KOHLS15", desc: "15% off sale items", discount: "15%" },
        { code: "EXTRA20", desc: "Extra 20% off", discount: "20%" }
      ]
    },
    {
      domain: "gap.com",
      name: "Gap",
      deals: [
        { desc: "Sale \u2014 up to 50% off jeans, tops & more", discount: "Up to 50%" },
        { desc: "Student discount \u2014 extra 15% off with UNiDAYS", discount: "15%" },
        { desc: "Free shipping on orders $50+", discount: "Free Shipping" }
      ],
      codes: [
        { code: "GAP40", desc: "40% off your purchase", discount: "40%" },
        { code: "EXTRA30", desc: "Extra 30% off sale", discount: "30%" }
      ]
    },
    {
      domain: "oldnavy.com",
      name: "Old Navy",
      deals: [
        { desc: "Super Cash \u2014 earn and redeem for big savings", discount: "Super Cash" },
        { desc: "Kids sale \u2014 up to 60% off children's clothing", discount: "Up to 60%" },
        { desc: "Free shipping on orders $50+", discount: "Free Shipping" }
      ],
      codes: [
        { code: "NAVY50", desc: "50% off everything", discount: "50%" },
        { code: "FAMILY30", desc: "30% off family styles", discount: "30%" }
      ]
    },
    {
      domain: "asos.com",
      name: "ASOS",
      deals: [
        { desc: "Sale \u2014 up to 70% off fashion & accessories", discount: "Up to 70%" },
        { desc: "ASOS Premiere \u2014 free next-day delivery subscription", discount: "Free Delivery" },
        { desc: "Student discount \u2014 10% off with UNiDAYS", discount: "10%" }
      ],
      codes: [
        { code: "ASOS20", desc: "20% off your order", discount: "20%" },
        { code: "STUDENT10", desc: "10% student discount", discount: "10%" }
      ]
    },
    {
      domain: "underarmour.com",
      name: "Under Armour",
      deals: [
        { desc: "Outlet \u2014 up to 50% off select styles", discount: "Up to 50%" },
        { desc: "UA Rewards member-only deals & early access", discount: "Up to 30%" },
        { desc: "Free shipping on orders $60+", discount: "Free Shipping" }
      ],
      codes: [
        { code: "UA25", desc: "25% off your order", discount: "25%" },
        { code: "SPORT20", desc: "20% off sports gear", discount: "20%" }
      ]
    },
    {
      domain: "cvs.com",
      name: "CVS",
      deals: [
        { desc: "ExtraCare deals \u2014 weekly savings for card members", discount: "Up to 30%" },
        { desc: "Buy 1 get 1 50% off on vitamins & supplements", discount: "50% off 2nd" },
        { desc: "Free shipping on orders $35+", discount: "Free Shipping" }
      ],
      codes: [
        { code: "CVS30", desc: "30% off your order", discount: "30%" },
        { code: "EXTRA25", desc: "Extra 25% off beauty", discount: "25%" }
      ]
    },
    {
      domain: "walgreens.com",
      name: "Walgreens",
      deals: [
        { desc: "myWalgreens deals \u2014 weekly member savings", discount: "Up to 25%" },
        { desc: "Buy 1 get 1 free on select health & beauty", discount: "Buy 1 Get 1" },
        { desc: "Free pickup & same-day delivery available", discount: "Free Pickup" }
      ],
      codes: [
        { code: "WAGS20", desc: "20% off online orders", discount: "20%" },
        { code: "HEALTH15", desc: "15% off health items", discount: "15%" }
      ]
    },
    {
      domain: "ulta.com",
      name: "Ulta Beauty",
      deals: [
        { desc: "21 Days of Beauty \u2014 rotating 50% off deals", discount: "50%" },
        { desc: "Platinum & Diamond member bonus rewards", discount: "Bonus Points" },
        { desc: "Free shipping on orders $35+", discount: "Free Shipping" }
      ],
      codes: [
        { code: "ULTA20", desc: "20% off your purchase", discount: "20%" },
        { code: "BEAUTY15", desc: "15% off beauty essentials", discount: "15%" }
      ]
    },
    {
      domain: "doordash.com",
      name: "DoorDash",
      deals: [
        { desc: "DashPass \u2014 free delivery & reduced fees for subscribers", discount: "Free Delivery" },
        { desc: "Flash deals \u2014 limited time restaurant discounts", discount: "Up to $10" },
        { desc: "First-time order savings with select restaurants", discount: "Up to $15" }
      ],
      codes: [
        { code: "DASH25", desc: "$25 off your first 3 orders", discount: "$25" },
        { code: "FREEDELIVER", desc: "Free delivery for 30 days", discount: "Free Delivery" }
      ]
    },
    {
      domain: "expedia.com",
      name: "Expedia",
      deals: [
        { desc: "Member prices \u2014 up to 10% off hotels for signed-in users", discount: "Up to 10%" },
        { desc: "Package deals \u2014 save when you bundle flight + hotel", discount: "Up to $500" },
        { desc: "Last minute travel deals \u2014 book now for big savings", discount: "Up to 40%" }
      ],
      codes: [
        { code: "TRAVEL10", desc: "10% off hotels", discount: "10%" },
        { code: "PACKAGE20", desc: "20% off vacation packages", discount: "20%" }
      ]
    },
    {
      domain: "booking.com",
      name: "Booking.com",
      deals: [
        { desc: "Genius discounts \u2014 up to 15% off for loyal members", discount: "Up to 15%" },
        { desc: "Early booker deals \u2014 save more when you plan ahead", discount: "Up to 20%" },
        { desc: "Last minute savings \u2014 top properties at reduced rates", discount: "Up to 30%" }
      ],
      codes: [
        { code: "BOOK10", desc: "10% off selected hotels", discount: "10%" },
        { code: "GENIUS15", desc: "15% off for Genius members", discount: "15%" }
      ]
    },
    {
      domain: "petco.com",
      name: "Petco",
      deals: [
        { desc: "Vital Care Premier \u2014 monthly credits & free grooming", discount: "Free Services" },
        { desc: "Repeat Delivery \u2014 extra 35% off first order + 5% off ongoing", discount: "35%" },
        { desc: "Weekly deals on food, toys & accessories", discount: "Up to 30%" }
      ],
      codes: [
        { code: "PETCO15", desc: "15% off your order", discount: "15%" },
        { code: "VITAL20", desc: "20% off Vital Care members", discount: "20%" }
      ]
    },
    {
      domain: "petsmart.com",
      name: "PetSmart",
      deals: [
        { desc: "Treats loyalty program \u2014 earn points on every purchase", discount: "Bonus Points" },
        { desc: "Pet sale \u2014 up to 40% off food, toys & supplies", discount: "Up to 40%" },
        { desc: "Free shipping on orders $49+", discount: "Free Shipping" }
      ],
      codes: [
        { code: "PET20", desc: "20% off pet supplies", discount: "20%" },
        { code: "ADOPT15", desc: "15% off with adoption", discount: "15%" }
      ]
    }
  ];

  // src/data/coupons.js
  var REMOTE_COUPON_DB_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/couponsnap/main/src/data/coupon-db.json";
  var CACHE_KEY = "coupon_db_cache";
  var CACHE_TTL_MS = 24 * 60 * 60 * 1e3;
  var AFFILIATE_CONFIG = {
    "amazon.com": { param: "tag", tag: "couponsnap09-20" },
    "amazon.ca": { param: "tag", tag: "couponsnap09-20" },
    "amazon.co.uk": { param: "tag", tag: "couponsnap09-20" },
    "walmart.com": { param: "wmlspartner", tag: "couponsnap" },
    "target.com": { param: "afid", tag: "couponsnap" },
    "bestbuy.com": { param: "ref", tag: "couponsnap" },
    "ebay.com": { param: "campid", tag: "5338999999" },
    "newegg.com": { param: "nm_mc", tag: "couponsnap" },
    "sephora.com": { param: "cm_mmc", tag: "couponsnap" },
    "nike.com": { param: "cp", tag: "couponsnap" },
    "adidas.com": { param: "utm_source", tag: "couponsnap" },
    "wayfair.com": { param: "refid", tag: "couponsnap" },
    "nordstrom.com": { param: "refferer", tag: "couponsnap" },
    "macys.com": { param: "ID", tag: "couponsnap" },
    "homedepot.com": { param: "MERCH", tag: "couponsnap" },
    "lowes.com": { param: "cm_mmc", tag: "couponsnap" },
    "chewy.com": { param: "ref", tag: "couponsnap" },
    "booking.com": { param: "aid", tag: "2311285" },
    "expedia.com": { param: "affcid", tag: "couponsnap" }
  };
  async function getCachedDB() {
    try {
      const result = await browser.storage.local.get(CACHE_KEY);
      const cached = result[CACHE_KEY];
      if (cached && cached.data && Date.now() - cached.ts < CACHE_TTL_MS) {
        return cached.data;
      }
    } catch {
    }
    return null;
  }
  async function setCachedDB(data) {
    try {
      await browser.storage.local.set({
        [CACHE_KEY]: { data, ts: Date.now() }
      });
    } catch {
    }
  }
  async function fetchRemoteDB() {
    if (REMOTE_COUPON_DB_URL.includes("YOUR_USERNAME")) return null;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8e3);
      const resp = await fetch(REMOTE_COUPON_DB_URL, {
        signal: controller.signal,
        cache: "no-store"
      });
      clearTimeout(timeout);
      if (!resp.ok) return null;
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        await setCachedDB(data);
        return data;
      }
    } catch {
    }
    return null;
  }
  var _activeDB = coupon_db_default;
  (async () => {
    const cached = await getCachedDB();
    if (cached) _activeDB = cached;
    const remote = await fetchRemoteDB();
    if (remote) _activeDB = remote;
  })();
  function normalizeHost(hostname) {
    return hostname.replace(/^www\./, "");
  }
  function getCouponsForDomain(hostname) {
    const host = normalizeHost(hostname);
    return _activeDB.find((entry) => {
      const entryDomain = normalizeHost(entry.domain);
      return host === entryDomain || host.endsWith("." + entryDomain);
    }) || null;
  }
  function getAffiliateConfig(hostname) {
    const host = normalizeHost(hostname);
    for (const [domain, config] of Object.entries(AFFILIATE_CONFIG)) {
      if (host === domain || host.endsWith("." + domain)) {
        return config;
      }
    }
    return null;
  }
  function injectAffiliateTag(url, hostname) {
    const config = getAffiliateConfig(hostname);
    if (!config) return url;
    try {
      const u = new URL(url);
      u.searchParams.set(config.param, config.tag);
      return u.toString();
    } catch {
      return url;
    }
  }

  // src/content/content.js
  var CHECKOUT_URL_PATTERNS = [
    /\/checkout/i,
    /\/cart/i,
    /\/payment/i,
    /\/order/i,
    /\/basket/i,
    /\/purchase/i,
    /\/buy\//i,
    /\/secure/i
  ];
  var CHECKOUT_DOM_SIGNALS = [
    '[data-step="contact_information"]',
    // Shopify
    '[data-step="payment_method"]',
    // Shopify
    ".order-summary",
    // Shopify
    "#checkout",
    // Generic
    ".checkout-form",
    "#payment-form",
    '[data-testid="checkout"]',
    ".cart-checkout",
    'form[action*="checkout"]',
    'form[action*="payment"]'
  ];
  function isCheckoutPage() {
    const url = window.location.href;
    if (CHECKOUT_URL_PATTERNS.some((p) => p.test(url))) return true;
    return CHECKOUT_DOM_SIGNALS.some((sel) => {
      try {
        return !!document.querySelector(sel);
      } catch {
        return false;
      }
    });
  }
  function detectPlatform() {
    const meta = document.querySelector('meta[name="generator"]')?.content || "";
    if (meta.includes("Shopify") || window.Shopify || document.querySelector(".shopify-checkout-form")) {
      return "shopify";
    }
    if (document.querySelector('form[id*="woocommerce"]') || window.wc_checkout_params) {
      return "woocommerce";
    }
    if (document.querySelector('[data-component="checkout"]') || window.__NEXT_DATA__) {
      return "nextjs";
    }
    return "generic";
  }
  var SHOPIFY_SELECTORS = {
    field: [
      "#checkout_reduction_code",
      // Shopify classic
      'input[name="checkout[reduction_code]"]',
      ".reduction-code__text-field input",
      "[data-discount-field]",
      'input[placeholder*="discount" i]',
      'input[placeholder*="gift card" i]'
    ],
    button: [
      'button[data-trekkie-id="apply_discount_button"]',
      ".reduction-code__submit",
      'button[aria-label*="Apply" i]',
      'button[type="submit"][form*="reduction"]',
      'button:has(span:contains("Apply"))'
    ]
  };
  var GENERIC_SELECTORS = {
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
      "input#spc-gcpromoinput",
      // WooCommerce
      "#coupon_code",
      "input.coupon-input",
      // BigCommerce
      "input[data-coupon]"
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
  };
  function findElement(selectors) {
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        if (el && el.offsetParent !== null) return el;
      } catch {
      }
    }
    return null;
  }
  function findCouponField(platform) {
    const primary = platform === "shopify" ? SHOPIFY_SELECTORS.field : [];
    return findElement([...primary, ...GENERIC_SELECTORS.field]);
  }
  function findApplyButton(platform, couponField) {
    const primary = platform === "shopify" ? SHOPIFY_SELECTORS.button : [];
    let btn = findElement([...primary, ...GENERIC_SELECTORS.button]);
    if (!btn && couponField) {
      const container = couponField.closest("form") || couponField.parentElement;
      if (container) {
        const btns = container.querySelectorAll('button, input[type="submit"]');
        for (const b of btns) {
          const text = (b.textContent + (b.value || "")).toLowerCase();
          if (/apply|redeem|submit|use|validate/.test(text)) {
            btn = b;
            break;
          }
        }
      }
    }
    return btn;
  }
  function setNativeValue(input, value) {
    const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    if (proto?.set) {
      proto.set.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
  }
  var SUCCESS_SIGNALS = [
    "coupon applied",
    "discount applied",
    "promo applied",
    "code applied",
    "saved",
    "you save",
    "savings applied",
    "gift card applied",
    "offer applied",
    "deal applied"
  ];
  var ERROR_SIGNALS = [
    "invalid",
    "expired",
    "not valid",
    "not found",
    "cannot be",
    "does not exist",
    "already used",
    "not applicable",
    "minimum",
    "sorry",
    "cannot apply",
    "doesn't apply",
    "not eligible"
  ];
  function checkPageForResult() {
    const text = document.body.innerText.toLowerCase();
    const resultEls = document.querySelectorAll(
      '.reduction-code__text, .coupon-message, [data-coupon-message], .woocommerce-message, .alert, .notice, .notification, [role="alert"]'
    );
    let elText = "";
    resultEls.forEach((el) => {
      elText += el.textContent.toLowerCase();
    });
    const combined = text + " " + elText;
    if (SUCCESS_SIGNALS.some((s) => combined.includes(s))) return "success";
    if (ERROR_SIGNALS.some((s) => combined.includes(s))) return "error";
    return "unknown";
  }
  async function tryCoupon(code, couponField, applyButton) {
    couponField.focus();
    setNativeValue(couponField, code);
    await sleep(200);
    if (applyButton) {
      applyButton.click();
      applyButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    } else {
      couponField.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter", keyCode: 13, bubbles: true }));
      couponField.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, bubbles: true }));
      couponField.closest("form")?.requestSubmit();
    }
    await sleep(1800);
    return checkPageForResult();
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function expandCouponSection() {
    const togglers = document.querySelectorAll(
      '[data-toggle="coupon"], [aria-controls*="coupon"], button[class*="coupon-toggle"], .coupon-toggle, a[href*="#coupon"], .js-toggle-coupon'
    );
    for (const toggler of togglers) {
      if (toggler.offsetParent) {
        toggler.click();
        await sleep(400);
        return true;
      }
    }
    return false;
  }
  async function runCouponFinder(manual = false) {
    if (!isCheckoutPage() && !manual) return;
    const hostname = window.location.hostname;
    const couponData = getCouponsForDomain(hostname);
    browser.runtime.sendMessage({
      type: "CHECKOUT_DETECTED",
      hostname,
      hasCoupons: !!couponData,
      couponCount: couponData?.codes?.length || 0
    });
    if (!couponData) return;
    await expandCouponSection();
    let couponField = null;
    const platform = detectPlatform();
    for (let i = 0; i < 30; i++) {
      couponField = findCouponField(platform);
      if (couponField) break;
      await sleep(500);
    }
    if (!couponField) {
      browser.runtime.sendMessage({ type: "NO_COUPON_FIELD", hostname });
      return;
    }
    const applyButton = findApplyButton(platform, couponField);
    for (const coupon of couponData.codes) {
      browser.runtime.sendMessage({ type: "TRYING_COUPON", code: coupon.code });
      const result = await tryCoupon(coupon.code, couponField, applyButton);
      if (result === "success") {
        browser.runtime.sendMessage({
          type: "COUPON_APPLIED",
          code: coupon.code,
          description: coupon.desc,
          discount: coupon.discount
        });
        return;
      }
      setNativeValue(couponField, "");
      await sleep(300);
    }
    browser.runtime.sendMessage({ type: "NO_COUPON_WORKED" });
  }
  function injectAffiliateLinks() {
    const hostname = window.location.hostname;
    document.querySelectorAll("a[href]").forEach((link) => {
      try {
        const url = new URL(link.href);
        if (url.hostname.includes(hostname.replace("www.", ""))) {
          link.href = injectAffiliateTag(link.href, hostname);
        }
      } catch {
      }
    });
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          const links = node.tagName === "A" ? [node] : [...node.querySelectorAll("a[href]")];
          links.forEach((link) => {
            try {
              const url = new URL(link.href);
              if (url.hostname.includes(hostname.replace("www.", ""))) {
                link.href = injectAffiliateTag(link.href, hostname);
              }
            } catch {
            }
          });
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "TRY_COUPONS") {
      runCouponFinder(true);
      sendResponse({ started: true });
    }
    if (msg.type === "GET_PAGE_STATUS") {
      sendResponse({
        isCheckout: isCheckoutPage(),
        hostname: window.location.hostname,
        platform: detectPlatform()
      });
    }
    return true;
  });
  injectAffiliateLinks();
  runCouponFinder();
  var lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(() => runCouponFinder(), 1e3);
    }
  }).observe(document, { subtree: true, childList: true });
})();
