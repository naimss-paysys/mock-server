// ─────────────────────────────────────────────
//  Togocom — Bill Payments Routes
//
//  POST /bill-payments/v2/payment-info-v2  → Preauth Pay Bill (Ref List mode)
//  POST /bill-payments/v2/payment-info     → Preauth Pay Bill (REF / AMT_REF mode)
//  POST /bill-payments/v2/payment          → Pay Bill Transaction
// ─────────────────────────────────────────────
const router  = require('express').Router();
const { txRef, txReceipt } = require('../../utils');

// ── Preauth Pay Bill (Ref List mode) ──────────────────────────
router.post('/bill-payments/v2/payment-info-v2', (req, res) => {
  console.log('Preauth Pay Bill v2 Request:', req.body);
  res.json({
    data: {
      amount: null,
      info: 'Factures CEET',
      bills: [
        { id: '711020300006', label: '11-1997(10000 F)', amount: 10000 },
        { id: '709020100002', label: '09-1997(23057 F)', amount: 23057 },
        { id: '708020100003', label: '08-1997(22973 F)', amount: 22973 },
        { id: '707020100004', label: '07-1997(22722 F)', amount: 22722 },
      ],
    },
  });
});

// ── Preauth Pay Bill (REF / AMT_REF mode) ─────────────────────
// Branches on req.body.mode:
//   REF     → bill list with fixed amount
//   AMT_REF → bill info with the requested amount
router.post('/bill-payments/v2/payment-info', (req, res) => {
  console.log('Preauth Pay Bill Request:', req.body);

  const mode = String(req.body?.mode || '').toUpperCase();

  if (mode === 'AMT_REF') {
    return res.json({
      data: {
        amount: req.body.billAmount || 5000,
        info: 'Recharge de la carte 476292*****3737 de AKANYA Thierry',
      },
    });
  }

  return res.json({
    data: {
      info: "Ticket d'entree au Parc PVO",
      bills: [
        {
          id: req.body.billReference || '1',
          label: "Ticket d'entree au Parc PVO",
          amount: 300,
        },
      ],
    },
  });
});

// ── Pay Bill Transaction ───────────────────────────────────────
router.post('/bill-payments/v2/payment', (req, res) => {
  console.log('Pay Bill Transaction Request:', req.body);
  res.json({
    amount: req.body.amount ? `${parseFloat(req.body.amount).toFixed(2)}` : '300.00',
    currency: req.body.currency || 'XOF',
    type: 'transfer',
    subType: 'billpay',
    requestDate: req.body.requestDate || new Date().toISOString(),
    requestingOrganisationTransactionReference: `${Date.now()}-mock`,
    debitParty: [{ key: 'accountid', value: req.body.clientAlias || '29506967' }],
    creditParty: [{ key: 'accountid', value: req.body.billerAlias || '01519' }],
    metadata: req.body.metadata || [],
    transactionStatus: 'completed',
    creationDate: new Date().toISOString(),
    transactionReference: txRef(),
    transactionReceipt: txReceipt(),
    billerData: { info: "Ticket d'entree au Parc PVO" },
  });
});

module.exports = router;
