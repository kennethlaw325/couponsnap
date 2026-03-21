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
  var USER_CODES_PREFIX = "user_codes_";
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
  function storageKeyForDomain(domain) {
    return USER_CODES_PREFIX + normalizeHost(domain);
  }
  function getCouponsForDomain(hostname) {
    const host = normalizeHost(hostname);
    return _activeDB.find((entry) => {
      const entryDomain = normalizeHost(entry.domain);
      return host === entryDomain || host.endsWith("." + entryDomain);
    }) || null;
  }
  async function getUserSubmittedCodes(hostname) {
    const key = storageKeyForDomain(hostname);
    try {
      const result = await browser.storage.local.get(key);
      return result[key] || [];
    } catch {
      return [];
    }
  }
  async function submitUserCode(hostname, code, desc = "") {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode || normalizedCode.length < 2) return false;
    const key = storageKeyForDomain(hostname);
    try {
      const result = await browser.storage.local.get(key);
      const existing = result[key] || [];
      if (existing.some((c) => c.code === normalizedCode)) return false;
      existing.unshift({
        code: normalizedCode,
        desc: desc.trim() || `Community code for ${normalizeHost(hostname)}`,
        discount: "Community",
        submittedAt: Date.now(),
        userSubmitted: true
      });
      await browser.storage.local.set({ [key]: existing.slice(0, 20) });
      return true;
    } catch {
      return false;
    }
  }
  async function getAllCodesForDomain(hostname) {
    const entry = getCouponsForDomain(hostname);
    const bundled = entry?.codes || [];
    const userCodes = await getUserSubmittedCodes(hostname);
    const seen = new Set(userCodes.map((c) => c.code.toUpperCase()));
    const merged = [...userCodes];
    for (const c of bundled) {
      if (!seen.has(c.code.toUpperCase())) {
        merged.push(c);
        seen.add(c.code.toUpperCase());
      }
    }
    return merged;
  }

  // src/popup/popup.js
  var content = document.getElementById("content");
  var tabsEl = document.getElementById("tabs");
  var dealsCountEl = document.getElementById("deals-count");
  var codesCountEl = document.getElementById("codes-count");
  var _activeTab = "deals";
  function initTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        _activeTab = btn.dataset.tab;
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
        document.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === `panel-${_activeTab}`));
      });
    });
  }
  async function getCurrentTab() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    return tab;
  }
  async function getTabState(tabId) {
    return new Promise((resolve) => {
      browser.runtime.sendMessage({ type: "GET_TAB_STATE", tabId }, resolve);
    });
  }
  function renderIdle() {
    tabsEl.style.display = "none";
    content.innerHTML = `
    <div class="status-card">
      <div class="status-icon">\u{1F6D2}</div>
      <div class="status-title">Browse to a shopping site</div>
      <div class="status-subtitle">CouponSnap finds deals and coupon codes automatically as you shop.</div>
    </div>
  `;
  }
  async function renderSiteFound(hostname, checkoutState, tabId) {
    const entry = getCouponsForDomain(hostname);
    const deals = entry?.deals || [];
    const allCodes = await getAllCodesForDomain(hostname);
    if (!deals.length && !allCodes.length) {
      tabsEl.style.display = "none";
      content.innerHTML = `
      <div class="status-card">
        <div class="status-icon">\u{1F50D}</div>
        <div class="status-title">No savings found for this site</div>
        <div class="status-subtitle">We don't have deals or codes for <strong>${hostname}</strong> yet. Know a code? Submit it below!</div>
      </div>
      ${renderSubmitCodeSection(hostname)}
    `;
      bindSubmitCode(hostname);
      return;
    }
    tabsEl.style.display = "flex";
    dealsCountEl.textContent = deals.length;
    codesCountEl.textContent = allCodes.length;
    if (checkoutState?.status === "found" && allCodes.length) {
      _activeTab = "codes";
    } else if (deals.length) {
      _activeTab = "deals";
    } else {
      _activeTab = "codes";
    }
    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.tab === _activeTab);
    });
    const dealsPanel = buildDealsPanel(deals, hostname, entry);
    const codesPanel = await buildCodesPanel(allCodes, checkoutState, tabId, hostname);
    content.innerHTML = `
    <div class="tab-panel ${_activeTab === "deals" ? "active" : ""}" id="panel-deals">
      ${dealsPanel}
    </div>
    <div class="tab-panel ${_activeTab === "codes" ? "active" : ""}" id="panel-codes">
      ${codesPanel}
      ${renderSubmitCodeSection(hostname)}
    </div>
  `;
    bindDealsButtons(hostname, entry);
    bindCodesApplyButton(tabId, checkoutState);
    bindSubmitCode(hostname);
  }
  function buildDealsPanel(deals, hostname, entry) {
    if (!deals.length) {
      return `<div class="empty-state"><div class="icon">\u{1F3F7}\uFE0F</div>No deals available right now.</div>`;
    }
    const items = deals.map((deal, i) => `
    <div class="deal-card">
      <div class="deal-info">
        <span class="deal-discount">${deal.discount}</span>
        <div class="deal-desc">${deal.desc}</div>
      </div>
      <button class="btn-shop" data-deal-index="${i}">Shop \u2192</button>
    </div>
  `).join("");
    return `<div class="deal-list">${items}</div>`;
  }
  function bindDealsButtons(hostname, entry) {
    document.querySelectorAll(".btn-shop").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tab?.url) return;
        let url = tab.url;
        try {
          const u = new URL(url);
          const aff = getAffiliateConfigForEntry(entry);
          if (aff) {
            u.searchParams.set(aff.affiliateParam || aff.param, aff.affiliateTag || aff.tag);
            url = u.toString();
          }
        } catch {
        }
        browser.tabs.update(tab.id, { url });
        window.close();
      });
    });
  }
  function getAffiliateConfigForEntry(entry) {
    if (entry?.affiliateTag) {
      return { affiliateParam: entry.affiliateParam, affiliateTag: entry.affiliateTag };
    }
    return null;
  }
  async function buildCodesPanel(allCodes, checkoutState, tabId, hostname) {
    if (!allCodes.length) {
      return `<div class="empty-state"><div class="icon">\u{1F3F7}\uFE0F</div>No codes yet \u2014 be the first to submit one!</div>`;
    }
    let ctaHtml = "";
    if (checkoutState?.status === "found") {
      ctaHtml = `<button class="btn-primary" id="btn-apply">\u26A1 Try ${allCodes.length} Code${allCodes.length > 1 ? "s" : ""} Automatically</button>`;
    } else if (checkoutState?.status === "trying") {
      ctaHtml = `<button class="btn-primary" disabled><span class="loading-dots">Trying codes</span></button>`;
    } else if (checkoutState?.status === "applied") {
      ctaHtml = `
      <div class="success-badge">
        <div class="code">${checkoutState.appliedCode}</div>
        <div class="desc">${checkoutState.savings ? `Saved ${checkoutState.savings}` : "Coupon applied!"}</div>
        ${checkoutState.savings ? `<span class="savings-pill">${checkoutState.savings} OFF</span>` : ""}
      </div>
    `;
    } else if (checkoutState?.status === "failed") {
      ctaHtml = `
      <div class="status-card">
        <div class="status-icon">\u{1F61E}</div>
        <div class="status-title">No codes worked this time</div>
        <div class="status-subtitle">Know a working code? Submit it below!</div>
      </div>
    `;
    }
    const items = allCodes.map((c) => `
    <div class="code-card ${c.userSubmitted ? "user-submitted" : ""}">
      <div class="code-meta">
        <div class="code-badge">${c.code}</div>
        <div class="code-desc">${c.desc}</div>
        ${c.userSubmitted ? '<div class="user-badge">\u{1F464} Community</div>' : ""}
      </div>
      <span class="code-discount">${c.discount}</span>
    </div>
  `).join("");
    return `
    ${ctaHtml}
    <div class="code-list" style="margin-top:${ctaHtml ? "10px" : "0"}">${items}</div>
  `;
  }
  function bindCodesApplyButton(tabId, checkoutState) {
    const btn = document.getElementById("btn-apply");
    if (!btn || !tabId) return;
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.innerHTML = '<span class="loading-dots">Trying codes</span>';
      await browser.tabs.sendMessage(tabId, { type: "TRY_COUPONS" });
      setTimeout(() => init(), 4e3);
    });
  }
  function renderSubmitCodeSection(hostname) {
    return `
    <div class="submit-section">
      <div class="submit-title">\u{1F4A1} Know a working code? Share it!</div>
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
  `;
  }
  function bindSubmitCode(hostname) {
    const input = document.getElementById("input-submit-code");
    const btn = document.getElementById("btn-submit-code");
    const feedback = document.getElementById("submit-feedback");
    if (!input || !btn || !feedback) return;
    input.addEventListener("input", () => {
      const pos = input.selectionStart;
      input.value = input.value.toUpperCase().replace(/[^A-Z0-9\-_]/g, "");
      input.setSelectionRange(pos, pos);
    });
    btn.addEventListener("click", async () => {
      const code = input.value.trim();
      if (!code || code.length < 2) {
        showFeedback(feedback, "Enter a valid code", "error");
        return;
      }
      btn.disabled = true;
      const saved = await submitUserCode(hostname, code, "");
      if (saved) {
        input.value = "";
        showFeedback(feedback, `\u2713 "${code}" saved! It'll be tried next checkout.`, "success");
        setTimeout(() => init(), 1500);
      } else {
        showFeedback(feedback, "This code is already in the list.", "error");
      }
      btn.disabled = false;
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") btn.click();
    });
  }
  function showFeedback(el, msg, type) {
    el.textContent = msg;
    el.className = `submit-feedback ${type}`;
    setTimeout(() => {
      el.textContent = "";
      el.className = "submit-feedback";
    }, 4e3);
  }
  async function init() {
    try {
      const tab = await getCurrentTab();
      if (!tab?.id || !tab?.url || !tab.url.startsWith("http")) {
        renderIdle();
        return;
      }
      const hostname = new URL(tab.url).hostname;
      const state = await getTabState(tab.id);
      await renderSiteFound(hostname, state, tab.id);
    } catch (e) {
      renderIdle();
    }
  }
  initTabs();
  init();
})();
