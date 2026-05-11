// ─────────────────────────────────────────────
//  Togocom — Contacts, Quotations & Bank Transactions
//
//  POST /contacts/v2/list              → Get Favorite List
//  POST /contacts/v2/                  → Add / Delete Favorite (subType branch)
//  POST /quotations/v3                 → Get Quotation
//  POST /bank-transactions/v2/transfer/w2b → Wallet to Bank
//  POST /bank-transactions/v2/transfer/b2w → Bank to Wallet
// ─────────────────────────────────────────────
const router = require('express').Router();
const { txRef, txReceipt } = require('../../utils');

// ── Get Favorite List ──────────────────────────────────────────
router.post('/contacts/v2/list', (req, res) => {
  console.log('Get Favorite List Request:', req.body);
  res.json({
    lastIndex: 1.0,
    contactListData: [
      { aliasReference: 'FAF_1', contactDetails: 'buddy;29506967' },
    ],
  });
});

// ── Add / Delete Favorite ──────────────────────────────────────
// Branches on req.body.subType: addalias | deletealias
router.post('/contacts/v2/', (req, res) => {
  console.log('Contacts v2 Request:', req.body?.subType);
  res.json({
    transactionStatus: 'completed',
    transactionReference: txRef(),
    transactionReceipt: txReceipt(),
  });
});

// ── Quotation ──────────────────────────────────────────────────
router.post('/quotations/v3', (req, res) => {
  console.log('Quotation Request:', req.body);
  res.json({
    debitParty:    req.body.debitParty  || [{ key: 'accountid', value: '29506967' }],
    creditParty:   req.body.creditParty || [{ key: 'accountid', value: '01551' }],
    requestAmount: `${parseFloat(req.body.amount || 1000).toFixed(2)}`,
    quotes: [
      {
        sendingAmount:    `${parseFloat(req.body.amount || 1000).toFixed(2)}`,
        sendingCurrency:  req.body.currency || 'XOF',
        receivingAmount:  `${parseFloat(req.body.amount || 1000).toFixed(2)}`,
        receivingCurrency: req.body.currency || 'XOF',
      },
    ],
    metadata:          req.body.metadata || [],
    quotationReference: txRef(),
    fees:              [],
    bonuses:           [],
    quotationReceipt:  txReceipt(),
  });
});

// ── Wallet to Bank (w2b) ───────────────────────────────────────
router.post('/bank-transactions/v2/transfer/w2b', (req, res) => {
  console.log('W2B Request:', req.body);
  const amount = parseFloat(req.body.amount || 200);
  res.json({
    amount: `${amount.toFixed(2)}`,
    currency: req.body.currency || 'XOF',
    type: 'transfer',
    subType: 'bankcashout',
    requestDate: new Date().toISOString(),
    requestingOrganisationTransactionReference: `${Date.now()}-mock`,
    debitParty:  [{ key: 'accountid', value: req.body.debitParty?.find(p => p.key === 'accountid')?.value || '92506967' }],
    creditParty: [{ key: 'accountid', value: req.body.creditParty?.find(p => p.key === 'accountid')?.value || '22899993' }],
    metadata: [],
    transactionStatus: 'completed',
    creationDate: new Date().toISOString(),
    transactionReference: txRef(),
    transactionReceipt: txReceipt(),
    bankReferenceId: '01037-296-000015',
    accountNumber: '010373564360190104',
    bankAmount: amount,
    bankTransferDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
    balanceAfter: -789987,
    bankFees: 0,
    bankInfo: '',
    bankName: '',
    tmoneyCurrentBalance: '49748',
    tmoneyAvailableBalance: '49748',
  });
});

// ── Bank to Wallet (b2w) ───────────────────────────────────────
router.post('/bank-transactions/v2/transfer/b2w', (req, res) => {
  console.log('B2W Request:', req.body);
  const amount = parseFloat(req.body.amount || 2000);
  res.json({
    amount: `${amount.toFixed(2)}`,
    currency: req.body.currency || 'XOF',
    type: 'transfer',
    subType: 'bankcashin',
    requestDate: new Date().toISOString(),
    requestingOrganisationTransactionReference: `${Date.now()}-mock`,
    debitParty:  [{ key: 'accountid', value: req.body.debitParty?.find(p => p.key === 'accountid')?.value || '22872032' }],
    creditParty: [{ key: 'accountid', value: req.body.creditParty?.find(p => p.key === 'accountid')?.value || '92608487' }],
    metadata: [],
    transactionStatus: 'completed',
    creationDate: new Date().toISOString(),
    transactionReference: txRef(),
    transactionReceipt: txReceipt(),
    bankReferenceId: 'mockRefId',
    accountNumber: '000900020526',
    bankAmount: amount,
    bankTransferDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
    balanceAfter: 538029,
    bankFees: 0,
    bankInfo: '',
    bankName: '',
    tmoneyCurrentBalance: '163157',
    tmoneyAvailableBalance: '97877',
  });
});

module.exports = router;
