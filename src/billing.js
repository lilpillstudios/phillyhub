/**
 * billing.js — PhillyHub In-App Purchase Integration
 * Lil Pill Studios © 2026
 *
 * Uses cordova-plugin-purchase (CdvPurchase) for both:
 * - Google Play Billing (Android)
 * - Apple StoreKit (iOS)
 *
 * Setup:
 * Google Play Console: Create in-app product "locals_guide_unlock" at $3.99, non-consumable
 * App Store Connect: Create in-app purchase "locals_guide_unlock" at $3.99, non-consumable
 *
 * Usage in your React component:
 *   import { initBilling, purchaseLocalsGuide, restorePurchases, isPurchased } from './billing';
 *   useEffect(() => { initBilling(setIsPro); }, []);
 *   const handleUnlock = () => purchaseLocalsGuide();
 *   const handleRestore = () => restorePurchases();
 */

const PRODUCT_ID = "locals_guide_unlock";
const STORAGE_KEY = "ph_pro";

let storeReady = false;
let onPurchaseCallback = null;
let currentPlatform = null;

/**
 * Detect which platform we're running on.
 */
function detectPlatform() {
  if (typeof window === "undefined" || !window.CdvPurchase) return null;
  const { Platform } = window.CdvPurchase;
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
    return Platform.APPLE_APPSTORE;
  }
  if (/Android/.test(ua)) {
    return Platform.GOOGLE_PLAY;
  }
  if (window.webkit && window.webkit.messageHandlers) {
    return Platform.APPLE_APPSTORE;
  }
  return Platform.GOOGLE_PLAY;
}

/**
 * Initialize the billing system.
 * Call once on app mount. Pass a callback that sets your pro state.
 * On web/PWA (no native billing), this gracefully no-ops.
 */
export function initBilling(onPurchaseComplete) {
  onPurchaseCallback = onPurchaseComplete;

  if (typeof window === "undefined" || !window.CdvPurchase) {
    console.log("[Billing] Not in native context — billing disabled");
    checkLocalUnlock();
    return;
  }

  currentPlatform = detectPlatform();
  console.log("[Billing] Detected platform:", currentPlatform);

  const { store, ProductType } = window.CdvPurchase;

  store.register([
    {
      id: PRODUCT_ID,
      type: ProductType.NON_CONSUMABLE,
      platform: currentPlatform,
    },
  ]);

  store.when()
    .productUpdated(() => {
      console.log("[Billing] Product catalog updated");
      storeReady = true;
    })
    .approved((transaction) => {
      console.log("[Billing] Purchase approved:", transaction.transactionId);
      transaction.verify();
    })
    .verified((receipt) => {
      console.log("[Billing] Receipt verified");
      receipt.finish();
      unlockPro();
    })
    .finished(() => {
      console.log("[Billing] Transaction finished");
    })
    .receiptUpdated((receipt) => {
      if (receipt.hasTransaction({ id: PRODUCT_ID })) {
        unlockPro();
      }
    });

  store.initialize([currentPlatform]).then(() => {
    console.log("[Billing] Store initialized for", currentPlatform);
    storeReady = true;
    checkExistingPurchases();
  }).catch((err) => {
    console.error("[Billing] Init error:", err);
    const { Platform } = window.CdvPurchase;
    const fallback = currentPlatform === Platform.GOOGLE_PLAY
      ? Platform.APPLE_APPSTORE
      : Platform.GOOGLE_PLAY;
    console.log("[Billing] Trying fallback platform:", fallback);
    store.initialize([fallback]).then(() => {
      currentPlatform = fallback;
      storeReady = true;
      console.log("[Billing] Fallback initialized for", fallback);
      checkExistingPurchases();
    }).catch((err2) => {
      console.error("[Billing] Fallback also failed:", err2);
    });
  });
}

/**
 * Trigger the purchase flow for Local's Guide.
 */
export function purchaseLocalsGuide() {
  if (!window.CdvPurchase) {
    alert(
      "In-app purchase is available in the app.\n\n" +
      "Download PhillyHub from the App Store or Google Play to unlock Local's Guide."
    );
    return;
  }

  if (!storeReady) {
    alert("Store is loading. Please try again in a moment.");
    return;
  }

  const { store } = window.CdvPurchase;
  const product = store.get(PRODUCT_ID);

  if (!product) {
    console.error("[Billing] Product not found:", PRODUCT_ID);
    alert("Unable to load purchase. Please check your internet connection.");
    return;
  }

  if (product.owned) {
    unlockPro();
    return;
  }

  const offer = product.getOffer();
  if (offer) {
    store.order(offer).then(() => {
      console.log("[Billing] Purchase initiated");
    }).catch((err) => {
      console.error("[Billing] Purchase error:", err);
      if (err.code !== "6777001" && err.code !== 2) {
        alert("Purchase failed. Please try again.");
      }
    });
  }
}

/**
 * Restore previous purchases.
 * Required by both Apple and Google policies.
 */
export function restorePurchases() {
  if (!window.CdvPurchase) {
    checkLocalUnlock();
    return;
  }

  const { store } = window.CdvPurchase;
  store.restorePurchases().then(() => {
    console.log("[Billing] Restore complete");
    checkExistingPurchases();
  }).catch((err) => {
    console.error("[Billing] Restore error:", err);
  });
}

/**
 * Check if Local's Guide is currently unlocked.
 */
export function isPurchased() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

// ─── Internal ────────────────────────────────────────────────────────

function unlockPro() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {}
  if (onPurchaseCallback) {
    onPurchaseCallback(true);
  }
}

function checkLocalUnlock() {
  if (isPurchased() && onPurchaseCallback) {
    onPurchaseCallback(true);
  }
}

function checkExistingPurchases() {
  if (!window.CdvPurchase) return;
  const { store } = window.CdvPurchase;
  const product = store.get(PRODUCT_ID);
  if (product && product.owned) {
    unlockPro();
  }
}
