// ═══════════════════════════════════════════════════════════════
//  Mock Server — Entry Point
//
//  How it works
//  ─────────────
//  • PORT and BASE_URL constants live in config.js.
//    Change them there; nothing else needs editing.
//
//  • Each logical group of endpoints lives in its own file
//    under routes/. server.js just mounts them.
//
//  • Base URL is set via app.use(BASE_URLS.X, router):
//      /osb/services  → routes/osb.js
//      /              → everything else (auth, merchant, mmp,
//                        payment, misc)
//
//  How to add a new API
//  ─────────────────────
//  1. Pick (or create) the right routes/*.js file.
//  2. Add:  router.post('/YourPath', (req, res) => { ... })
//  3. Set Content-Type ('text/xml', 'application/xml', or JSON).
//  4. Add the path to the health check endpoint list below.
//  5. Restart the server.  That's it.
// ═══════════════════════════════════════════════════════════════

const express    = require('express');
const bodyParser = require('body-parser');
const { PORT, BASE_URLS } = require('./config');

const app = express();

// ─── Middleware ─────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/xml' }));
app.use(bodyParser.text({ type: 'application/xml' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log('\n==============================================');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('==============================================\n');
  next();
});

// ─── Route Mounts ───────────────────────────────────────────────
// OSB SOAP services live under /osb/services (see config.js).
// All other route groups mount at the root.
app.use(BASE_URLS.OSB, require('./routes/osb'));
app.use(require('./routes/auth'));
app.use(require('./routes/merchant'));
app.use(require('./routes/mmp'));
app.use(require('./routes/payment'));
app.use(require('./routes/misc'));
app.use(require('./routes/togocom')); // Togocom/Prep-API (MMP_request&responses.xlsx)

// ============================================
// Health Check Endpoint
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    categories: {
      'AUTH': {
        'WSO2 Token': 'POST /oauth2/token',
      },
      'MERCHANT (JSON)': {
        'Get Merchant KYC': 'POST /api/merchant/kyc',
        'Check Merchant Status': 'POST /tigoagentapp_pesaliveNew/api/merchant/CheckMerchantStatus',
      },
      'OSB / SOAP': {
        'Wallet Account Registration': 'POST /osb/services/UserRegistration_5_0',
        'Change Group ID': 'POST /osb/services/ChangeCustomerTigoPesaGroup_1_0',
        'Update Alias Code': 'POST /osb/services/UpdateAliasCode_1_0',
        'Change PIN': 'POST /osb/services/PinManagement_2_0',
        'View MFS Account Type': 'POST /osb/services/ViewMFSAccountType_1_0',
        'Get Balance': 'POST /osb/services/GetBalance_3_0',
      },
      'MMP (XML/SOAP)': {
        'MMP View MFS Account Type': 'POST /MMPViewMFSAccountType',
        'MMP Create Handler': 'POST /MMPCreateHandler',
        'MMP PIN Validation': 'POST /MMPPinValidation',
        'MMP Get MFS Balance Proxy': 'POST /MMPGetMFSBalanceProxy',
        'MMP Get MFS User Status': 'POST /MMPGetMFSUserStatus',
        'MMP Change PIN': 'POST /MMPChangePIN',
        'MMP Disable Terminal User': 'POST /MMPDisableTerminalUser',
        'MMP Bill Query': 'POST /MMPBillQuery',
        'MMP Bill Payment': 'POST /MMPBillPayment',
        'MMP Cash Out Payment': 'POST /MMPCashOutPayment',
        'MMP Send Money Payment': 'POST /MMPSendMoneyPayment',
        'MMP Proxy Transfer': 'POST /MMPProxyTransfer',
        'MMP Calculate Fee Namecheck': 'POST /MMPCalculateFeeNamecheck',
        'MMP Send Money M2M': 'POST /MMPSendMoneyM2M',
        'MPP Cash Out Fee': 'POST /MPPCashOutFee',
        'Payment QR & Till Code (MMP-Telepin)': 'POST /PaymentQRAndTillCodeMmpTelepin',
        'Request to Pay Payment (MMP-Telepin)': 'POST /RequestToPayPaymentMmpTelepinCopy',
        'Request-topay-checkfee': 'POST /Request-topay-checkfee',
      },
      'PAYMENT GATEWAY (XML)': {
        'Tigo Gateway — BetPawa Payment': 'POST /TigoPaymentGateway_1_2?p=7005',
        'Tigo Gateway — Calculate Fee': 'POST /TigoPaymentGateway_1_2?p=2136',
        'Tigo Gateway — Send Money GePG': 'POST /TigoPaymentGateway_1_2?p=1945',
        'Tigo Gateway — Calculate Fee Merchant': 'POST /TigoPaymentGateway_1_2?p=1944',
        'Tigo Gateway — Bill Query': 'POST /TigoPaymentGateway_1_2?p=2022',
        'Super App Transaction Inquiry': 'POST /SuperAppTransInquiry2TigoTQS',
        'Biller Payment (API Key)': 'POST /USSDrouterPushBillpaySupperApp',
        'Biller Callback (typo compat)': 'POST /1.0/tz/test/merchant/api/RequestToPay/BillerCallbac',
        'Biller Callback': 'POST /1.0/tz/test/merchant/api/RequestToPay/BillerCallback',
      },
      'MISC': {
        'CVM Trigger': 'POST /sim-card-registration',
        'Send SMS': 'POST /SendSMSHandler',
        'Send Notification Apigee': 'POST /live/sendnotificationapigee',
      },
      'TOGOCOM — Accounts': {
        'Check Merchant Account': 'GET /accounts/v2/msisdn/:msisdn/status-v5',
        'Merchant Login / PIN Verify': 'POST /accounts/v2/msisdn/:msisdn/identity',
        'Merchant Balance': 'GET /accounts/v2/msisdn/:msisdn/balance',
        'Merchant Transaction History': 'GET /accounts/v2/msisdn/:msisdn/statemententries',
        'Change PIN': 'PATCH /accounts/v2/pin',
        'KYC Upgrade / Change Status': 'POST /accounts/v2/upgrade-kyc/:msisdn',
      },
      'TOGOCOM — Bill Payments': {
        'Preauth Pay Bill (Ref List)': 'POST /bill-payments/v2/payment-info-v2',
        'Preauth Pay Bill (REF — postpaid)': 'POST /bill-payments/v2/payment-info  [body: type=REF]',
        'Preauth Pay Bill (AMT-REF — prepaid)': 'POST /bill-payments/v2/payment-info  [body: type=AMT_REF]',
        'Pay Bill Transaction': 'POST /bill-payments/v2/payment',
      },
      'TOGOCOM — Transactions': {
        'Send Money M2M / M2C / P2P (sendmoney)': 'POST /transactions/v2  [subType: sendmoney]',
        'Merchant Payment (sell)': 'POST /transactions/v2  [subType: sell]',
        'Merchant Cashout (cashout)': 'POST /transactions/v2  [subType: cashout]',
        'Money Order — Self Create MMO': 'POST /transactions/v2  [subType: self_create_mmo]',
      },
      'TOGOCOM — Purchases': {
        'Get Available Bundles': 'GET /purchase/v3/bundles/:msisdn',
        'Fetch Airtime Options': 'GET /purchase/v3/airtime/:msisdn',
        'Buy Airtime (Self)': 'POST /purchase/v3/airtime/self',
        'Buy Airtime (Other)': 'POST /purchase/v3/airtime',
        'Buy Data (Self)': 'POST /purchase/v3/data/self',
        'Buy Data (Other)': 'POST /purchase/v3/data',
        'Buy Bundle (Self)': 'POST /purchase/v3/bundles/self',
        'Buy Bundle (Other)': 'POST /purchase/v3/bundles',
      },
      'TOGOCOM — Contacts & Finance': {
        'Get Favorite List': 'POST /contacts/v2/list',
        'Add Favorite': 'POST /contacts/v2/  [subType: addalias]',
        'Delete Favorite': 'POST /contacts/v2/  [subType: deletealias]',
        'Get Quotation': 'POST /quotations/v3',
        'Wallet to Bank (w2b)': 'POST /bank-transactions/v2/transfer/w2b',
        'Bank to Wallet (b2w)': 'POST /bank-transactions/v2/transfer/b2w',
      },
      'TOGOCOM — BCEAO / PI (Interoperability)': {
        'PI Initiate Search': 'POST /bceao-api/v1/alias/initiate-search',
        'PI Alias Delete': 'POST /bceao-api/v1/alias/initiate-delete',
        'PI Alias Update': 'POST /bceao-api/v1/alias/initiate-update',
        'PI Alias Creation': 'POST /bceao-api/v1/alias/initiate-creation',
        'PI Confirm Alias Creation': 'POST /bceao-api/v1/alias/validate-creationinitiated',
        'QR Code Generate': 'POST /bceao-api/v1/features/qr-generate',
        'QR Code Decode': 'POST /bceao-api/v1/features/qr-decode',
        'PI Payment Request': 'POST /bceao-api/v1/payment-request/request',
      },
      'TOGOCOM — Auth & Misc': {
        'Get OTP': 'POST /otp/v1',
        'AML Check': 'POST /reis-apis/v1/reis-aml',
        'Forget PIN — Get Data': 'GET /self-reset-pin/v1/get-data',
        'Forget PIN — Process Reset': 'POST /self-reset-pin/v1/process',
      },
    },
  });
});

// ============================================
// Root endpoint
// ============================================
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Mock Server</title>
  <style>
    body { font-family: sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; color: #333; }
    h1   { color: #1a1a2e; border-bottom: 2px solid #0066cc; padding-bottom: 8px; }
    h2   { color: #0066cc; margin-top: 28px; margin-bottom: 6px; font-size: 1em; text-transform: uppercase; letter-spacing: 1px; }
    ul   { margin: 0 0 8px 0; padding-left: 20px; }
    li   { padding: 3px 0; font-size: 0.9em; }
    code { background: #f0f4ff; padding: 1px 5px; border-radius: 3px; font-size: 0.88em; }
    .method { display: inline-block; min-width: 50px; font-weight: bold; }
    .get    { color: #28a745; }
    .post   { color: #0066cc; }
    .patch  { color: #fd7e14; }
    footer  { margin-top: 30px; color: #888; font-size: 0.8em; border-top: 1px solid #eee; padding-top: 10px; }
  </style>
</head>
<body>
  <h1>Mock Server is Running</h1>

  <h2>Auth</h2>
  <ul>
    <li><span class="method post">POST</span> <code>/oauth2/token</code> — WSO2 Token</li>
  </ul>

  <h2>Merchant</h2>
  <ul>
    <li><span class="method post">POST</span> <code>/api/merchant/kyc</code> — Get Merchant KYC</li>
    <li><span class="method post">POST</span> <code>/tigoagentapp_pesaliveNew/api/merchant/CheckMerchantStatus</code> — Check Merchant Status</li>
  </ul>

  <h2>OSB / SOAP</h2>
  <ul>
    <li><span class="method post">POST</span> <code>/osb/services/UserRegistration_5_0</code> — Wallet Account Registration</li>
    <li><span class="method post">POST</span> <code>/osb/services/ChangeCustomerTigoPesaGroup_1_0</code> — Change Group ID</li>
    <li><span class="method post">POST</span> <code>/osb/services/UpdateAliasCode_1_0</code> — Update Alias Code</li>
    <li><span class="method post">POST</span> <code>/osb/services/PinManagement_2_0</code> — Change PIN</li>
    <li><span class="method post">POST</span> <code>/osb/services/ViewMFSAccountType_1_0</code> — View MFS Account Type</li>
    <li><span class="method post">POST</span> <code>/osb/services/GetBalance_3_0</code> — Get Balance</li>
  </ul>

  <h2>MMP (XML/SOAP)</h2>
  <ul>
    <li><span class="method post">POST</span> <code>/MMPViewMFSAccountType</code></li>
    <li><span class="method post">POST</span> <code>/MMPCreateHandler</code></li>
    <li><span class="method post">POST</span> <code>/MMPPinValidation</code></li>
    <li><span class="method post">POST</span> <code>/MMPGetMFSBalanceProxy</code></li>
    <li><span class="method post">POST</span> <code>/MMPGetMFSUserStatus</code></li>
    <li><span class="method post">POST</span> <code>/MMPChangePIN</code></li>
    <li><span class="method post">POST</span> <code>/MMPDisableTerminalUser</code></li>
    <li><span class="method post">POST</span> <code>/MMPBillQuery</code></li>
    <li><span class="method post">POST</span> <code>/MMPBillPayment</code></li>
    <li><span class="method post">POST</span> <code>/MMPCashOutPayment</code></li>
    <li><span class="method post">POST</span> <code>/MMPSendMoneyPayment</code></li>
    <li><span class="method post">POST</span> <code>/MMPProxyTransfer</code></li>
    <li><span class="method post">POST</span> <code>/MMPCalculateFeeNamecheck</code></li>
    <li><span class="method post">POST</span> <code>/MMPSendMoneyM2M</code></li>
    <li><span class="method post">POST</span> <code>/MPPCashOutFee</code></li>
    <li><span class="method post">POST</span> <code>/PaymentQRAndTillCodeMmpTelepin</code></li>
    <li><span class="method post">POST</span> <code>/RequestToPayPaymentMmpTelepinCopy</code></li>
    <li><span class="method post">POST</span> <code>/Request-topay-checkfee</code></li>
  </ul>

  <h2>Payment Gateway (XML)</h2>
  <ul>
    <li><span class="method post">POST</span> <code>/TigoPaymentGateway_1_2?p=7005</code> — BetPawa Payment</li>
    <li><span class="method post">POST</span> <code>/TigoPaymentGateway_1_2?p=2136</code> — Calculate Fee</li>
    <li><span class="method post">POST</span> <code>/TigoPaymentGateway_1_2?p=1945</code> — Send Money GePG</li>
    <li><span class="method post">POST</span> <code>/TigoPaymentGateway_1_2?p=1944</code> — Calculate Fee Merchant</li>
    <li><span class="method post">POST</span> <code>/TigoPaymentGateway_1_2?p=2022</code> — Bill Query</li>
    <li><span class="method post">POST</span> <code>/SuperAppTransInquiry2TigoTQS</code></li>
    <li><span class="method post">POST</span> <code>/USSDrouterPushBillpaySupperApp</code> — Biller Payment</li>
    <li><span class="method post">POST</span> <code>/1.0/tz/test/merchant/api/RequestToPay/BillerCallback</code> — Biller Callback</li>
  </ul>

  <h2>Misc</h2>
  <ul>
    <li><span class="method post">POST</span> <code>/sim-card-registration</code> — CVM Trigger</li>
    <li><span class="method post">POST</span> <code>/SendSMSHandler</code></li>
    <li><span class="method post">POST</span> <code>/live/sendnotificationapigee</code></li>
  </ul>

  <h2>Togocom — Accounts</h2>
  <ul>
    <li><span class="method get">GET</span>   <code>/accounts/v2/msisdn/:msisdn/status-v5</code> — Check Merchant Account</li>
    <li><span class="method post">POST</span> <code>/accounts/v2/msisdn/:msisdn/identity</code> — Merchant Login / PIN Verify</li>
    <li><span class="method get">GET</span>   <code>/accounts/v2/msisdn/:msisdn/balance</code> — Merchant Balance</li>
    <li><span class="method get">GET</span>   <code>/accounts/v2/msisdn/:msisdn/statemententries</code> — Transaction History</li>
    <li><span class="method patch">PATCH</span> <code>/accounts/v2/pin</code> — Change PIN</li>
    <li><span class="method post">POST</span> <code>/accounts/v2/upgrade-kyc/:msisdn</code> — KYC Upgrade</li>
  </ul>

  <h2>Togocom — Bill Payments</h2>
  <ul>
    <li><span class="method post">POST</span> <code>/bill-payments/v2/payment-info-v2</code> — Preauth Pay Bill (Ref List)</li>
    <li><span class="method post">POST</span> <code>/bill-payments/v2/payment-info</code> — Preauth Pay Bill — REF (postpaid) <em>[body: type=REF]</em></li>
    <li><span class="method post">POST</span> <code>/bill-payments/v2/payment-info</code> — Preauth Pay Bill — AMT-REF (prepaid) <em>[body: type=AMT_REF]</em></li>
    <li><span class="method post">POST</span> <code>/bill-payments/v2/payment</code> — Pay Bill Transaction</li>
  </ul>

  <h2>Togocom — Transactions</h2>
  <ul>
    <li><span class="method post">POST</span> <code>/transactions/v2</code> — Send Money M2M / M2C / P2P <em>[subType: sendmoney]</em></li>
    <li><span class="method post">POST</span> <code>/transactions/v2</code> — Merchant Payment <em>[subType: sell]</em></li>
    <li><span class="method post">POST</span> <code>/transactions/v2</code> — Merchant Cashout <em>[subType: cashout]</em></li>
    <li><span class="method post">POST</span> <code>/transactions/v2</code> — Money Order / Self Create MMO <em>[subType: self_create_mmo]</em></li>
  </ul>

  <h2>Togocom — Purchases</h2>
  <ul>
    <li><span class="method get">GET</span>   <code>/purchase/v3/bundles/:msisdn</code> — Available Bundles</li>
    <li><span class="method get">GET</span>   <code>/purchase/v3/airtime/:msisdn</code> — Airtime Options</li>
    <li><span class="method post">POST</span> <code>/purchase/v3/airtime/self</code> — Buy Airtime (Self)</li>
    <li><span class="method post">POST</span> <code>/purchase/v3/airtime</code> — Buy Airtime (Other)</li>
    <li><span class="method post">POST</span> <code>/purchase/v3/data/self</code> — Buy Data (Self)</li>
    <li><span class="method post">POST</span> <code>/purchase/v3/data</code> — Buy Data (Other)</li>
    <li><span class="method post">POST</span> <code>/purchase/v3/bundles/self</code> — Buy Bundle (Self)</li>
    <li><span class="method post">POST</span> <code>/purchase/v3/bundles</code> — Buy Bundle (Other)</li>
  </ul>

  <h2>Togocom — Contacts &amp; Finance</h2>
  <ul>
    <li><span class="method post">POST</span> <code>/contacts/v2/list</code> — Get Favorite List</li>
    <li><span class="method post">POST</span> <code>/contacts/v2/</code> — Add Favorite <em>[subType: addalias]</em></li>
    <li><span class="method post">POST</span> <code>/contacts/v2/</code> — Delete Favorite <em>[subType: deletealias]</em></li>
    <li><span class="method post">POST</span> <code>/quotations/v3</code> — Get Quotation</li>
    <li><span class="method post">POST</span> <code>/bank-transactions/v2/transfer/w2b</code> — Wallet to Bank</li>
    <li><span class="method post">POST</span> <code>/bank-transactions/v2/transfer/b2w</code> — Bank to Wallet</li>
  </ul>

  <h2>Togocom — BCEAO / PI (Interoperability)</h2>
  <ul>
    <li><span class="method post">POST</span> <code>/bceao-api/v1/alias/initiate-search</code> — PI Initiate Search</li>
    <li><span class="method post">POST</span> <code>/bceao-api/v1/alias/initiate-delete</code> — PI Alias Delete</li>
    <li><span class="method post">POST</span> <code>/bceao-api/v1/alias/initiate-update</code> — PI Alias Update</li>
    <li><span class="method post">POST</span> <code>/bceao-api/v1/alias/initiate-creation</code> — PI Alias Creation</li>
    <li><span class="method post">POST</span> <code>/bceao-api/v1/alias/validate-creationinitiated</code> — PI Confirm Alias Creation</li>
    <li><span class="method post">POST</span> <code>/bceao-api/v1/features/qr-generate</code> — QR Code Generate</li>
    <li><span class="method post">POST</span> <code>/bceao-api/v1/features/qr-decode</code> — QR Code Decode</li>
    <li><span class="method post">POST</span> <code>/bceao-api/v1/payment-request/request</code> — PI Payment Request</li>
  </ul>

  <h2>Togocom — Auth &amp; Misc</h2>
  <ul>
    <li><span class="method post">POST</span> <code>/otp/v1</code> — Get OTP</li>
    <li><span class="method post">POST</span> <code>/reis-apis/v1/reis-aml</code> — AML Check</li>
    <li><span class="method get">GET</span>   <code>/self-reset-pin/v1/get-data</code> — Forget PIN Get Data</li>
    <li><span class="method post">POST</span> <code>/self-reset-pin/v1/process</code> — Forget PIN Process</li>
  </ul>

  <footer>Server Time: ${new Date().toISOString()} &nbsp;|&nbsp; <a href="/health">/health (JSON)</a></footer>
</body>
</html>`);
});

// Start server
app.listen(PORT, () => {
  console.log('==============================================');
  console.log(`🚀 Mock Server running on http://localhost:${PORT}`);
  console.log('==============================================');
  console.log('  [AUTH]     POST /oauth2/token');
  console.log('  [MERCHANT] POST /api/merchant/kyc');
  console.log('  [MERCHANT] POST /tigoagentapp_pesaliveNew/api/merchant/CheckMerchantStatus');
  console.log('  [OSB SOAP] POST /osb/services/UserRegistration_5_0');
  console.log('  [OSB SOAP] POST /osb/services/ChangeCustomerTigoPesaGroup_1_0');
  console.log('  [OSB SOAP] POST /osb/services/UpdateAliasCode_1_0');
  console.log('  [OSB SOAP] POST /osb/services/PinManagement_2_0');
  console.log('  [OSB SOAP] POST /osb/services/ViewMFSAccountType_1_0');
  console.log('  [OSB SOAP] POST /osb/services/GetBalance_3_0');
  console.log('  [MMP XML]  POST /MMPViewMFSAccountType');
  console.log('  [MMP XML]  POST /MMPCreateHandler | /MMPPinValidation | /MMPGetMFSBalanceProxy');
  console.log('  [MMP XML]  POST /MMPGetMFSUserStatus | /MMPChangePIN | /MMPDisableTerminalUser');
  console.log('  [MMP XML]  POST /MMPBillQuery | /MMPBillPayment | /MMPCashOutPayment');
  console.log('  [MMP XML]  POST /MMPSendMoneyPayment | /MMPProxyTransfer | /MMPCalculateFeeNamecheck');
  console.log('  [MMP XML]  POST /MMPSendMoneyM2M | /MPPCashOutFee | /Request-topay-checkfee');
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=7005|2136|1945|1944|2022');
  console.log('  [PAYMENT]  POST /SuperAppTransInquiry2TigoTQS');
  console.log('  [PAYMENT]  POST /USSDrouterPushBillpaySupperApp');
  console.log('  [PAYMENT]  POST /1.0/tz/test/merchant/api/RequestToPay/BillerCallback');
  console.log('  [MISC]     POST /sim-card-registration | /SendSMSHandler | /live/sendnotificationapigee');
  console.log('  --- Togocom / Prep-API ---');
  console.log('  [ACCOUNTS] GET  /accounts/v2/msisdn/:msisdn/status-v5 | balance | statemententries');
  console.log('  [ACCOUNTS] POST /accounts/v2/msisdn/:msisdn/identity');
  console.log('  [ACCOUNTS] PATCH /accounts/v2/pin | POST /accounts/v2/upgrade-kyc/:msisdn');
  console.log('  [BILLPAY]  POST /bill-payments/v2/payment-info-v2 | payment-info | payment');
  console.log('  [TXNS]     POST /transactions/v2  (subType: sendmoney|sell|cashout|self_create_mmo)');
  console.log('  [PURCHASE] GET  /purchase/v3/bundles/:msisdn | airtime/:msisdn');
  console.log('  [PURCHASE] POST /purchase/v3/airtime/self | airtime | data/self | data | bundles/self | bundles');
  console.log('  [CONTACTS] POST /contacts/v2/list | /contacts/v2/');
  console.log('  [FINANCE]  POST /quotations/v3 | /bank-transactions/v2/transfer/w2b | b2w');
  console.log('  [BCEAO]    POST /bceao-api/v1/alias/initiate-search');
  console.log('  [BCEAO]    POST /bceao-api/v1/alias/initiate-delete');
  console.log('  [BCEAO]    POST /bceao-api/v1/alias/initiate-update');
  console.log('  [BCEAO]    POST /bceao-api/v1/alias/initiate-creation');
  console.log('  [BCEAO]    POST /bceao-api/v1/alias/validate-creationinitiated');
  console.log('  [BCEAO]    POST /bceao-api/v1/features/qr-generate');
  console.log('  [BCEAO]    POST /bceao-api/v1/features/qr-decode');
  console.log('  [BCEAO]    POST /bceao-api/v1/payment-request/request');
  console.log('  [AUTH]     POST /otp/v1 | /reis-apis/v1/reis-aml');
  console.log('  [AUTH]     GET  /self-reset-pin/v1/get-data | POST /self-reset-pin/v1/process');
  console.log('==============================================');
  console.log(`  Open http://localhost:${PORT}/ for HTML docs`);
  console.log(`  Open http://localhost:${PORT}/health for JSON status`);
  console.log('==============================================\n');
});
  // ── OSB (SOAP) ──
  console.log('  [OSB SOAP] POST /osb/services/UserRegistration_5_0');
  console.log('  [OSB SOAP] POST /osb/services/ChangeCustomerTigoPesaGroup_1_0');
  console.log('  [OSB SOAP] POST /osb/services/UpdateAliasCode_1_0');
  console.log('  [OSB SOAP] POST /osb/services/PinManagement_2_0');
  console.log('  [OSB SOAP] POST /osb/services/ViewMFSAccountType_1_0');
  console.log('  [OSB SOAP] POST /osb/services/GetBalance_3_0');
  // ── MMP (XML/SOAP) ──
  console.log('  [MMP XML]  POST /MMPViewMFSAccountType');
  console.log('  [MMP XML]  POST /MMPCreateHandler');
  console.log('  [MMP XML]  POST /MMPPinValidation');
  console.log('  [MMP XML]  POST /MMPGetMFSBalanceProxy');
  console.log('  [MMP XML]  POST /MMPGetMFSUserStatus');
  console.log('  [MMP XML]  POST /MMPChangePIN');
  console.log('  [MMP XML]  POST /MMPDisableTerminalUser');
  console.log('  [MMP XML]  POST /MMPBillQuery');
  console.log('  [MMP XML]  POST /MMPBillPayment');
  console.log('  [MMP XML]  POST /MMPCashOutPayment');
  console.log('  [MMP XML]  POST /MMPSendMoneyPayment');
  console.log('  [MMP XML]  POST /MMPProxyTransfer');
  console.log('  [MMP XML]  POST /PaymentQRAndTillCodeMmpTelepin');
  console.log('  [MMP XML]  POST /RequestToPayPaymentMmpTelepinCopy');
  console.log('  [MMP XML]  POST /MPPCashOutFee');
  console.log('  [MMP XML]  POST /MMPCalculateFeeNamecheck');
  console.log('  [MMP XML]  POST /MMPSendMoneyM2M');
  console.log('  [MMP XML]  POST /Request-topay-checkfee');
  // ── Payment Gateway ──
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=2022  (Bill Query)');
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=7005  (BetPawa Payment)');
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=2136  (Calculate Fee)');
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=1945  (Send Money GePG)');
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=1944  (Calculate Fee Merchant)');
  console.log('  [PAYMENT]  POST /SuperAppTransInquiry2TigoTQS');
  console.log('  [PAYMENT]  POST /USSDrouterPushBillpaySupperApp');

