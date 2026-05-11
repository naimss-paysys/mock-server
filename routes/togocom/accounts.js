// ─────────────────────────────────────────────
//  Togocom — Accounts Routes
//
//  GET  /accounts/v2/msisdn/:msisdn/status-v5   → Check Merchant Account
//  POST /accounts/v2/msisdn/:msisdn/identity    → Merchant Login (PIN verify)
//  GET  /accounts/v2/msisdn/:msisdn/balance     → Merchant Balance
//  GET  /accounts/v2/msisdn/:msisdn/statemententries → Transaction History
//  PATCH /accounts/v2/pin                       → Change PIN
//  POST /accounts/v2/upgrade-kyc/:msisdn        → KYC Upgrade / Change Status
// ─────────────────────────────────────────────
const router = require('express').Router();

// ── Check Merchant Account ─────────────────────────────────────
router.get('/accounts/v2/msisdn/:msisdn/status-v5', (req, res) => {
  console.log('Check Merchant Account Request:', req.params);
  res.json({
    gender: 'M',
    app_self_auth: '0',
    date_of_birth: '2026-04-07T00:00:00.000Z',
    latitude: '1.8874455',
    language: 'fr',
    nation_nationality: 'TOGO',
    shortcode: req.params.msisdn.slice(-5),
    limit_kyc: 'KYC 2 (full registration / certification)',
    legal_doc_up: '1',
    reference: 'c161395',
    region_province: 'AGOE-NYIVE',
    region_district: 'Agoé-Nyivé 1',
    id_exp_date: '2027-04-08T00:00:00.000Z',
    legal_exp_date: '2030-04-08T00:00:00.000Z',
    id_type: 'national_id',
    legal_doc_ref: '98541236',
    msisdn: req.params.msisdn,
    region_area: 'Agoé-Nyivé',
    longitude: '2.856644',
    placeOfBirth: 'LOME',
    id_number: '1236454987',
    hi_bal_amount: 'null',
    id_del_date: '2022-04-08T00:00:00.000Z',
    address_country: 'TOGO',
    lo_bal_amount: 'null',
    region_region: 'LOME',
    sms_address: '90898190',
    address_continent: 'Afrique',
    web_self_auth: '0',
    last_name: 'MIXX',
    classification: 'CORPORATE',
    legal_del_date: '2024-04-08T00:00:00.000Z',
    referenceID: '185260',
    tx_id_number: '96854',
    email_address: 'merchant@mixx.tg',
    registration_date: '2026-04-07',
    hi_bal_thres: 'null',
    organization: 'MIXX',
    name: 'TEST',
    subType: 'responseMerchantAccount',
    tax_regime: 'Réel sans TVA',
    category: 'merchant',
    status: '3',
  });
});

// ── Merchant Login (PIN verification) ─────────────────────────
router.post('/accounts/v2/msisdn/:msisdn/identity', (req, res) => {
  console.log('Merchant Login Request:', req.params, req.body);
  res.json({
    accountIdenfication: 'valid',
    message: 'Valid user PIN',
  });
});

// ── Merchant Balance ───────────────────────────────────────────
router.get('/accounts/v2/msisdn/:msisdn/balance', (req, res) => {
  console.log('Merchant Balance Request:', req.params);
  res.json({
    accounts: [
      {
        accountcategory: { key: 'type', value: 'wallet.ewallet' },
        accountcategoryName: 'E-Wallet',
        accountBalance: {
          currentBalance: '494339.00',
          availableBalance: '494338.00',
          reservedBalance: '1.00',
          unclearedBalance: '0.00',
          upperLimit: '2000000000.00',
          notificationThreshold: '50000000.00',
          lastDebit: '2026-04-08 14:59:04.34',
          lastCredit: '2026-04-07 17:59:04.44',
          lowerLimit: '0.00',
          currency: 'XOF',
          status: 'available',
        },
      },
      {
        accountcategory: { key: 'type', value: 'wallet.points' },
        accountcategoryName: 'Points Wallet',
        accountBalance: {
          currentBalance: '0.00',
          availableBalance: '0.00',
          reservedBalance: '0.00',
          unclearedBalance: '0.00',
          upperLimit: '0',
          notificationThreshold: '0',
          lastDebit: '',
          lastCredit: '',
          lowerLimit: '0',
          status: 'available',
        },
      },
    ],
    transactionReference: '2229633605',
    transactionReceipt: '10C37G8',
  });
});

// ── Merchant Transaction History ───────────────────────────────
router.get('/accounts/v2/msisdn/:msisdn/statemententries', (req, res) => {
  console.log('Merchant History Request:', req.params, req.query);
  res.json([
    {
      amount: '1.00',
      currency: 'XOF',
      displayType: 'sell',
      transactionStatus: 'completed',
      descriptionText: 'Subscriber Sell',
      modificationDate: '2026-04-09T16:19:32.877Z',
      transactionReference: '2229633658',
      transactionReceipt: '10C37GH',
      bonus: '0.00',
      fee: '0.00',
      debitParty: [{ key: 'accountid', value: req.params.msisdn }, { key: 'accountcategory', value: 'ewallet' }],
      creditParty: [{ key: 'accountid', value: '08938' }, { key: 'accountcategory', value: 'ewallet' }],
    },
    {
      amount: '1.00',
      currency: 'XOF',
      displayType: 'sendmoney',
      transactionStatus: 'completed',
      descriptionText: 'P2P',
      modificationDate: '2026-04-09T16:17:00.659Z',
      transactionReference: '2229633627',
      transactionReceipt: '10C37G5',
      bonus: '0.00',
      fee: '0.00',
      debitParty: [{ key: 'accountid', value: req.params.msisdn }, { key: 'accountcategory', value: 'ewallet' }],
      creditParty: [{ key: 'accountid', value: '90008938' }, { key: 'accountcategory', value: 'ewallet' }],
    },
    {
      amount: '300.00',
      currency: 'XOF',
      displayType: 'billpay',
      transactionStatus: 'completed',
      descriptionText: 'Billpay',
      modificationDate: '2026-04-09T16:12:11.727Z',
      transactionReference: '2229633657',
      transactionReceipt: '10C37G4',
      bonus: '0.00',
      fee: '3.00',
      debitParty: [{ key: 'accountid', value: req.params.msisdn }, { key: 'accountcategory', value: 'ewallet' }],
      creditParty: [{ key: 'accountid', value: '01519' }, { key: 'accountcategory', value: 'ewallet' }],
    },
    {
      amount: '100.00',
      currency: 'XOF',
      displayType: 'cashout',
      transactionStatus: 'completed',
      descriptionText: 'Subscriber Cashout',
      modificationDate: '2026-04-08T11:18:11.595Z',
      transactionReference: '2229632048',
      transactionReceipt: '10C34AD',
      bonus: '0.00',
      fee: '0.00',
      debitParty: [{ key: 'accountid', value: req.params.msisdn }, { key: 'accountcategory', value: 'ewallet' }],
      creditParty: [{ key: 'accountid', value: '90009045' }, { key: 'accountcategory', value: 'ewallet' }],
    },
  ]);
});

// ── Change PIN ─────────────────────────────────────────────────
router.patch('/accounts/v2/pin', (req, res) => {
  console.log('Change PIN Request:', req.body);
  res.json({ transactionStatus: 'completed' });
});

// ── Change Account Status / KYC Upgrade ───────────────────────
router.post('/accounts/v2/upgrade-kyc/:msisdn', (req, res) => {
  console.log('Change Account Status Request:', req.params, req.body);
  res.status(204).end();
});

module.exports = router;
