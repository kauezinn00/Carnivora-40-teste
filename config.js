(function (root, factory) {
  const config = factory();
  if (typeof module === "object" && module.exports) module.exports = config;
  else root.CARNIVORA_CONFIG = config;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  return Object.freeze({
    BASE_PRICE_USD: 9.97,
    CHECKOUT_URL: "https://pay.wiapy.com/KX2LK3vXNU",
    CHECKOUT_PRICE_ENDPOINT: "",
    PRICE_API_URL: "/api/price",
    PRICE_CACHE_MS: 60 * 60 * 1000,
    BRAND: "PLAN CARNÍVORO 40+",
    META_PIXEL_ID: "1253168553664712",
    UTMIFY_SCRIPT: "https://cdn.utmify.com.br/scripts/utms/latest.js"
  });
});
