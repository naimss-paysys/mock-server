// ─────────────────────────────────────────────
// Server Configuration
// Change PORT here to run on a different port.
// BASE_URL constants are used to prefix route
// groups – update them if your backend changes.
// ─────────────────────────────────────────────

module.exports = {
  PORT: 3011,

  // Base URL prefixes per integration group.
  // These are mounted in server.js via app.use().
  BASE_URLS: {
    OSB:             '/osb/services',          // SOAP OSB services
    APIGEE:          '/live',                  // Apigee notification proxy
    REQUEST_TO_PAY:  '/1.0/tz/test/merchant/api/RequestToPay', // Biller callbacks
  },
};
