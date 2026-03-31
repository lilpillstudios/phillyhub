/**
 * billing.js — PhillyHub In-App Purchase Integration
 * Lil Pill Studios © 2026
 *
 * Uses cordova-plugin-purchase (CdvPurchase) for Google Play Billing.
 * This plugin works with Capacitor through the Cordova compatibility layer.
 *
 * Setup in Google Play Console:
 * 1. Create an in-app product with ID: "locals_guide_unlock"
 * 2. Set price: $3.99 (or your regional equivalent)
 * 3. Type: Non-consumable (one-time purchase)
 *
 * Usage in your React component:
 *   import { initBilling, purchaseLocalsGuide, restorePurchases, isPurchased } from './billing';
 *
 *   // On app mount:
 *   useEffect(() => { initBilling(setIsPro); }, []);
 *
 *   // On unlock button tap:
 *   const handleUnlock = () => purchaseLocalsGuide();
 *
 *   // On "Restore Purchases" tap:
 *   const handleRestore = () => restorePurchases();
 */

const PRODUCT_ID = "locals_guide_unlock";
const STORAGE_KEY = "ph_pro";

let storeReady = false;
let onPurchaseCallback = null;

/**
 * Initialize the billing system.
 * Call once on app mount. Pass a callback that sets your pro state.
 * On web/PWA (no native billing), this gracefully no-ops.
 */
export function initBilling(onPurchaseComplete) {
  onPurchaseCallback = onPurchaseComplete;

  // Check if we're in a Capacitor/Cordova native context
  if (typeof window === "undefined" || !window.CdvPurchase) {
    console.log("[Billing] Not in native context — billing disabled");
    // Check localStorage for existing unlock (PWA fallback)
    checkLocalUnlock();
    return;
  }

  const { store, ProductType, Platform } = window.CdvPurchase;

  // Register the product
  store.register([
    {
      id: PRODUCT_ID,
      type: ProductType.NON_CONSUMABLE,
      platform: Platform.GOOGLE_PLAY,
    },
  ]);

  // Listen for purchase approval
  store.when()
    .productUpdated(() => {
      console.log("[Billing] Product catalog updated");
      storeReady = true;
    })
    .approved((transaction) => {
      // Purchase approved — verify and finish
      console.log("[Billing] Purchase approved:", transaction.transactionId);
      transaction.verify();
    })
    .verified((receipt) => {
      // Receipt verified — unlock the content
      console.log("[Billing] Receipt verified");
      receipt.finish();
      unlockPro();
    })
    .finished(() => {
      console.log("[Billing] Transaction finished");
    })
    .receiptUpdated((receipt) => {
      // Check if product is already owned (restore flow)
      if (receipt.hasTransaction({ id: PRODUCT_ID })) {
        unlockPro();
      }
    });

  // Initialize the store
  store.initialize([Platform.GOOGLE_PLAY]).then(() => {
    console.log("[Billing] Store initialized");
    storeReady = true;

    // Check for existing purchases on startup
    checkExistingPurchases();
  }).catch((err) => {
    console.error("[Billing] Init error:", err);
  });
}

/**
 * Trigger the purchase flow for Local's Guide.
 */
export function purchaseLocalsGuide() {
  // PWA fallback — if no native billing, show a message
  if (!window.CdvPurchase) {
    // For PWA distribution, you could redirect to Gumroad or show a code entry
    alert(
      "In-app purchase is available in the Android app.\n\n" +
      "Download PhillyHub from Google Play or get the APK from lilpillstudios.gumroad.com to unlock Local's Guide."
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

  // Check if already owned
  if (product.owned) {
    unlockPro();
    return;
  }

  // Get the offer and initiate purchase
  const offer = product.getOffer();
  if (offer) {
    store.order(offer).then(() => {
      console.log("[Billing] Purchase initiated");
    }).catch((err) => {
      console.error("[Billing] Purchase error:", err);
      if (err.code !== "6777001") {
        // 6777001 = user cancelled — don't show error for that
        alert("Purchase failed. Please try again.");
      }
    });
  }
}

/**
 * Restore previous purchases.
 * Required by Google Play policy — must be accessible in your UI.
 */
export function restorePurchases() {
  if (!window.CdvPurchase) {
    // Check localStorage for PWA
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
