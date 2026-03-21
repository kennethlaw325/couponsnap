(() => {
  // src/background/service-worker.js
  var tabStates = /* @__PURE__ */ new Map();
  function setBadge(tabId, text, color = "#f97316") {
    browser.action.setBadgeText({ tabId, text: String(text) });
    browser.action.setBadgeBackgroundColor({ tabId, color });
  }
  function clearBadge(tabId) {
    browser.action.setBadgeText({ tabId, text: "" });
  }
  browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    const tabId = sender.tab?.id;
    if (!tabId && msg.type !== "GET_TAB_STATE") return;
    switch (msg.type) {
      case "CHECKOUT_DETECTED": {
        const state = {
          isCheckout: true,
          hostname: msg.hostname,
          hasCoupons: msg.hasCoupons,
          couponCount: msg.couponCount,
          status: msg.hasCoupons ? "found" : "none",
          appliedCode: null,
          savings: null,
          tryingCode: null
        };
        tabStates.set(tabId, state);
        if (msg.hasCoupons) {
          setBadge(tabId, String(msg.couponCount));
        }
        break;
      }
      case "TRYING_COUPON": {
        const state = tabStates.get(tabId) || {};
        state.status = "trying";
        state.tryingCode = msg.code;
        tabStates.set(tabId, state);
        setBadge(tabId, "...", "#64748b");
        break;
      }
      case "COUPON_APPLIED": {
        const state = tabStates.get(tabId) || {};
        state.status = "applied";
        state.appliedCode = msg.code;
        state.savings = msg.discount;
        state.description = msg.description;
        tabStates.set(tabId, state);
        setBadge(tabId, "\u2713", "#22c55e");
        break;
      }
      case "NO_COUPON_FIELD": {
        const state = tabStates.get(tabId) || {};
        state.status = "no_field";
        tabStates.set(tabId, state);
        setBadge(tabId, "?", "#64748b");
        break;
      }
      case "NO_COUPON_WORKED": {
        const state = tabStates.get(tabId) || {};
        state.status = "failed";
        tabStates.set(tabId, state);
        setBadge(tabId, "\u2717", "#ef4444");
        break;
      }
      case "GET_TAB_STATE": {
        const id = msg.tabId;
        sendResponse(tabStates.get(id) || null);
        return true;
      }
    }
  });
  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
      tabStates.delete(tabId);
      clearBadge(tabId);
    }
  });
  browser.tabs.onRemoved.addListener((tabId) => {
    tabStates.delete(tabId);
  });
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "couponsnap-try",
      title: "CouponSnap: Try Coupon Codes",
      contexts: ["page"]
    });
  });
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "couponsnap-try" && tab?.id) {
      await browser.tabs.sendMessage(tab.id, { type: "TRY_COUPONS" });
    }
  });
})();
