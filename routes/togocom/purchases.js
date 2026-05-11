// ─────────────────────────────────────────────
//  Togocom — Purchases Routes (Airtime / Data / Bundles)
//
//  GET  /purchase/v3/bundles/:msisdn  → Available bundles
//  GET  /purchase/v3/airtime/:msisdn  → Airtime options
//  POST /purchase/v3/airtime/self     → Buy airtime for self
//  POST /purchase/v3/airtime          → Buy airtime for other
//  POST /purchase/v3/data/self        → Buy data for self
//  POST /purchase/v3/data             → Buy data for other
//  POST /purchase/v3/bundles/self     → Buy bundle for self
//  POST /purchase/v3/bundles          → Buy bundle for other
// ─────────────────────────────────────────────
const router = require('express').Router();
const { txRef, txReceipt } = require('../../utils');

// ── Get Available Bundles ──────────────────────────────────────
router.get('/purchase/v3/bundles/:msisdn', (req, res) => {
  console.log('Get Available Bundles Request:', req.params);
  res.json({
    msisdn: req.params.msisdn,
    bundles: [
      { id: '83',  packageName: 'NET100',   displayName: 'NET100: 45Mo (1J) 100F',                          type: 'Data',  price: '100',  validity: '1J', isBoosted: '0', boostedPackageLabel: null,                                     boostType: null,         boostedPriceDifference: null, boostedPackageName: null,        boostedPrice: null,  boostedPackageDisplayName: null,            boostedPackageVolume: null, option: '1', loanProductCode: null,          benifits: { unit: 'Mo',   data: '45',  sms: null, national: null,   'data-social': null, cfa: null, onNet: null } },
      { id: '84',  packageName: 'NET200',   displayName: 'NET200: 100Mo (1J) 200F',                         type: 'Data',  price: '200',  validity: '1J', isBoosted: '1', boostedPackageLabel: 'Rajoute 50F et reçoit 150Mo en plus',    boostType: 'direct',     boostedPriceDifference: '50', boostedPackageName: 'NET250',        boostedPrice: '250', boostedPackageDisplayName: 'NET250: 250Mo',     boostedPackageVolume: '250', option: '2', loanProductCode: null,          benifits: { unit: 'Mo',   data: '100', sms: null, national: null,   'data-social': null, cfa: null, onNet: null } },
      { id: '88',  packageName: 'NET1000',  displayName: 'NET1000: 1.5Go (7J) 1000F',                       type: 'Data',  price: '1000', validity: '7J', isBoosted: '0', boostedPackageLabel: null,                                     boostType: null,         boostedPriceDifference: null, boostedPackageName: null,        boostedPrice: null,  boostedPackageDisplayName: null,            boostedPackageVolume: null, option: '6', loanProductCode: 'BNPL_NET1000', benifits: { unit: 'Go',   data: '1.5', sms: null, national: null,   'data-social': null, cfa: null, onNet: null } },
      { id: '91',  packageName: 'NET5000',  displayName: 'NET5000: 6Go (30J) 5000F',                        type: 'Data',  price: '5000', validity: '30J',isBoosted: '0', boostedPackageLabel: null,                                     boostType: null,         boostedPriceDifference: null, boostedPackageName: null,        boostedPrice: null,  boostedPackageDisplayName: null,            boostedPackageVolume: null, option: '9', loanProductCode: 'BNPL_NET5000', benifits: { unit: 'Go',   data: '6',   sms: null, national: null,   'data-social': null, cfa: null, onNet: null } },
      { id: '131', packageName: 'Lema200+', displayName: 'Léma200+: 1000F TR+20Mo+20sms (1j) 200F',         type: 'Mixte', price: '200',  validity: '1',  isBoosted: '1', boostedPackageLabel: 'Ajoute 50F et obtiens 2500F+20Mo+20SMS à 250F', boostType: 'adjustment', boostedPriceDifference: null, boostedPackageName: 'Lema200+boost', boostedPrice: '250', boostedPackageDisplayName: 'Lema200+boost: 2500F+20Mo+20SMS', boostedPackageVolume: '20', option: '1', loanProductCode: null,          benifits: { unit: 'FCFA', data: '20',  sms: '20', national: '1000', 'data-social': null, cfa: null, onNet: null } },
    ],
  });
});

// ── Fetch Airtime Options ──────────────────────────────────────
router.get('/purchase/v3/airtime/:msisdn', (req, res) => {
  console.log('Fetch Airtime Request:', req.params);
  res.json({
    msisdn: req.params.msisdn,
    rechargeAmounts: [
      { id: '162', displayName: 'Recharge_500',   price: '500',   option: '2', isBoosted: '0', boostedPackageLabel: null, boostType: null, boostedPriceDifference: null, boostedPackageName: null, boostedPrice: null, boostedPackageDisplayName: null, boostedPackageVolume: null, loanProductCode: null },
      { id: '163', displayName: 'Recharge_1000',  price: '1000',  option: '3', isBoosted: '0', boostedPackageLabel: null, boostType: null, boostedPriceDifference: null, boostedPackageName: null, boostedPrice: null, boostedPackageDisplayName: null, boostedPackageVolume: null, loanProductCode: null },
      { id: '161', displayName: 'Recharge_2000',  price: '2000',  option: '4', isBoosted: '0', boostedPackageLabel: null, boostType: null, boostedPriceDifference: null, boostedPackageName: null, boostedPrice: null, boostedPackageDisplayName: null, boostedPackageVolume: null, loanProductCode: null },
      { id: '165', displayName: 'Recharge_4500',  price: '4500',  option: '5', isBoosted: '0', boostedPackageLabel: null, boostType: null, boostedPriceDifference: null, boostedPackageName: null, boostedPrice: null, boostedPackageDisplayName: null, boostedPackageVolume: null, loanProductCode: null },
      { id: '160', displayName: 'Recharge_9000',  price: '9000',  option: '6', isBoosted: '0', boostedPackageLabel: null, boostType: null, boostedPriceDifference: null, boostedPackageName: null, boostedPrice: null, boostedPackageDisplayName: null, boostedPackageVolume: null, loanProductCode: null },
      { id: '158', displayName: 'Recharge_22500', price: '22500', option: '7', isBoosted: '0', boostedPackageLabel: null, boostType: null, boostedPriceDifference: null, boostedPackageName: null, boostedPrice: null, boostedPackageDisplayName: null, boostedPackageVolume: null, loanProductCode: null },
    ],
  });
});

// ── Buy Airtime for Self ───────────────────────────────────────
router.post('/purchase/v3/airtime/self', (req, res) => {
  console.log('Buy Airtime (Self) Request:', req.body);
  res.json({
    amount: req.body.amount || '1.00',
    currency: req.body.currency || 'XOF',
    type: 'transfer',
    subType: 'custtopup4self',
    requestDate: new Date().toISOString(),
    requestingOrganisationTransactionReference: `${Date.now()}-mock`,
    debitParty:  [{ key: 'accountid', value: req.body.debitParty?.find(p => p.key === 'accountid')?.value || '70210044' }],
    creditParty: [{ key: 'accountcategory', value: 'predefined' }],
    metadata: [
      { key: 'suppress_sms', value: '0' },
      { key: 'Status',        value: 'pass' },
      { key: 'AdditionalInfo', value: 'SUCCESS' },
      { key: 'ResultCode',    value: '00' },
    ],
    transactionStatus: 'completed',
    creationDate: new Date().toISOString(),
    transactionReference: txRef(),
    transactionReceipt: txReceipt(),
  });
});

// ── Buy Airtime for Other ──────────────────────────────────────
router.post('/purchase/v3/airtime', (req, res) => {
  console.log('Buy Airtime (Other) Request:', req.body);
  res.json({
    amount: req.body.amount || '1.00',
    currency: req.body.currency || 'XOF',
    type: 'transfer',
    subType: 'custtopup4other',
    requestDate: new Date().toISOString(),
    requestingOrganisationTransactionReference: `${Date.now()}-mock`,
    debitParty:  [{ key: 'accountid', value: req.body.debitParty?.find(p => p.key === 'accountid')?.value || '29506967' }],
    creditParty: [{ key: 'accountcategory', value: 'predefined' }],
    metadata: [
      { key: 'suppress_sms', value: '0' },
      { key: 'Status',        value: 'pass' },
      { key: 'AdditionalInfo', value: 'SUCCESS' },
      { key: 'ResultCode',    value: '00' },
    ],
    transactionStatus: 'completed',
    creationDate: new Date().toISOString(),
    transactionReference: txRef(),
    transactionReceipt: txReceipt(),
  });
});

// ── Buy Data for Self ──────────────────────────────────────────
router.post('/purchase/v3/data/self', (req, res) => {
  console.log('Buy Data (Self) Request:', req.body);
  res.json({
    amount: req.body.amount || '200.00',
    currency: req.body.currency || 'XOF',
    type: 'transfer',
    subType: 'custbuydata4self',
    requestDate: new Date().toISOString(),
    requestingOrganisationTransactionReference: `${Date.now()}-mock`,
    debitParty:  [{ key: 'accountid', value: req.body.debitParty?.find(p => p.key === 'accountid')?.value || '70210044' }],
    creditParty: [{ key: 'accountcategory', value: 'predefined' }],
    metadata: [
      { key: 'suppress_sms', value: '0' },
      { key: 'bundle_name',  value: req.body.metadata?.find(m => m.key === 'bundle_name')?.value || 'NET200' },
    ],
    transactionStatus: 'completed',
    creationDate: new Date().toISOString(),
    transactionReference: txRef(),
    transactionReceipt: txReceipt(),
    bundleProvisioned: 'true',
    primaryBalance: '94576.01',
  });
});

// ── Buy Data for Other ─────────────────────────────────────────
router.post('/purchase/v3/data', (req, res) => {
  console.log('Buy Data (Other) Request:', req.body);
  res.json({
    amount: req.body.amount || '50.00',
    currency: req.body.currency || 'XOF',
    type: 'transfer',
    subType: 'custbydata4other',
    requestDate: new Date().toISOString(),
    requestingOrganisationTransactionReference: `${Date.now()}-mock`,
    debitParty:  [{ key: 'accountid', value: req.body.debitParty?.find(p => p.key === 'accountid')?.value || '29506967' }],
    creditParty: [{ key: 'accountcategory', value: 'predefined' }],
    metadata: [
      { key: 'suppress_sms', value: '0' },
      { key: 'bundle_name',  value: req.body.metadata?.find(m => m.key === 'bundle_name')?.value || 'FD_VT_1J_50' },
    ],
    transactionStatus: 'completed',
    creationDate: new Date().toISOString(),
    transactionReference: txRef(),
    transactionReceipt: txReceipt(),
    bundleProvisioned: 'true',
    primaryBalance: '94576.01',
  });
});

// ── Buy Bundle for Self ────────────────────────────────────────
router.post('/purchase/v3/bundles/self', (req, res) => {
  console.log('Buy Bundle (Self) Request:', req.body);
  res.json({
    amount: req.body.amount || '200.00',
    currency: req.body.currency || 'XOF',
    type: 'transfer',
    subType: 'buypack4self',
    requestDate: new Date().toISOString(),
    requestingOrganisationTransactionReference: `${Date.now()}-mock`,
    debitParty:  [{ key: 'accountid', value: req.body.debitParty?.find(p => p.key === 'accountid')?.value || '70210044' }],
    creditParty: [{ key: 'accountcategory', value: 'predefined' }],
    metadata: [
      { key: 'bundle_name',  value: req.body.metadata?.find(m => m.key === 'bundle_name')?.value || 'OVO200' },
      { key: 'suppress_sms', value: '0' },
    ],
    transactionStatus: 'completed',
    creationDate: new Date().toISOString(),
    transactionReference: txRef(),
    transactionReceipt: txReceipt(),
    bundleProvisioned: 'true',
    primaryBalance: '94576.01',
  });
});

// ── Buy Bundle for Other ───────────────────────────────────────
router.post('/purchase/v3/bundles', (req, res) => {
  console.log('Buy Bundle (Other) Request:', req.body);
  res.json({
    amount: req.body.amount || '200.00',
    currency: req.body.currency || 'XOF',
    type: 'transfer',
    subType: 'buypack4other',
    requestDate: new Date().toISOString(),
    requestingOrganisationTransactionReference: `${Date.now()}-mock`,
    debitParty:  [{ key: 'accountid', value: req.body.debitParty?.find(p => p.key === 'accountid')?.value || '29506967' }],
    creditParty: [{ key: 'accountcategory', value: 'predefined' }],
    metadata: [
      { key: 'bundle_name',  value: req.body.metadata?.find(m => m.key === 'bundle_name')?.value || 'OVO200' },
      { key: 'suppress_sms', value: '0' },
      { key: 'recipient',    value: req.body.creditParty?.find(p => p.key === 'accountid')?.value || '70210044' },
    ],
    transactionStatus: 'completed',
    creationDate: new Date().toISOString(),
    transactionReference: txRef(),
    transactionReceipt: txReceipt(),
    bundleProvisioned: 'true',
    primaryBalance: '94576.01',
  });
});

module.exports = router;
