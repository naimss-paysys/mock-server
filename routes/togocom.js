// ─────────────────────────────────────────────────────────────────
//  Togocom / Prep-API — Router index
//
//  Mounts all Togocom sub-routers. To add a new API:
//    1. Pick (or create) the right file under routes/togocom/
//    2. Add the route there and mount it below.
//
//  Sub-modules:
//    accounts.js              → /accounts/v2/...
//    bill-payments.js         → /bill-payments/v2/...
//    transactions.js          → /transactions/v2
//    purchases.js             → /purchase/v3/...
//    contacts-quotations-bank.js → /contacts/v2/ + /quotations/v3 + /bank-transactions/
//    bceao.js                 → /bceao-api/... + /otp/v1 + /reis-apis/... + /self-reset-pin/...
// ─────────────────────────────────────────────────────────────────
const router = require('express').Router();

router.use(require('./togocom/accounts'));
router.use(require('./togocom/bill-payments'));
router.use(require('./togocom/transactions'));
router.use(require('./togocom/purchases'));
router.use(require('./togocom/contacts-quotations-bank'));
router.use(require('./togocom/bceao'));

module.exports = router;
