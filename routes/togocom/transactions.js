// ─────────────────────────────────────────────
//  Togocom — Transactions Routes
//
//  POST /transactions/v2  (branched by req.body.subType)
//    sendmoney      → P2P / M2M / M2C transfer
//    sell           → Merchant payment (includes merchantName)
//    cashout        → Cashout
//    self_create_mmo → Money Order
// ─────────────────────────────────────────────
const router = require('express').Router();
const { txRef, txReceipt, mmoId } = require('../../utils');

function buildTransactionResponse(overrides) {
  return {
    amount: '1.00',
    currency: 'XOF',
    type: 'transfer',
    subType: 'sendmoney',
    requestDate: new Date().toISOString(),
    requestingOrganisationTransactionReference: `${Date.now()}-mock`,
    debitParty:  [{ key: 'accountid', value: '29506967' }],
    creditParty: [{ key: 'accountid', value: '90008938' }],
    metadata: [],
    transactionStatus: 'completed',
    creationDate: new Date().toISOString(),
    transactionReference: txRef(),
    transactionReceipt: txReceipt(),
    ...overrides,
  };
}

router.post('/transactions/v2', (req, res) => {
  console.log('Transactions v2 Request:', req.body?.subType, req.body?.amount);

  const subType  = String(req.body?.subType || '').toLowerCase();
  const amount   = req.body?.amount   || '1.00';
  const currency = req.body?.currency || 'XOF';
  const debitId  = req.body?.debitParty?.find(p => p.key === 'accountid')?.value  || '29506967';
  const creditId = req.body?.creditParty?.find(p => p.key === 'accountid')?.value || '90008938';

  if (subType === 'sell') {
    return res.json(buildTransactionResponse({
      amount, currency, subType: 'sell',
      debitParty:  [{ key: 'accountid', value: debitId }],
      creditParty: [{ key: 'accountid', value: creditId }],
      merchantName: 'ATH',
      accountBalance: {
        debitParty: {
          accounts: [{
            accountcategory: { key: 'type', value: 'wallet.ewallet' },
            accountcategoryName: 'E-Wallet',
            accountBalance: {
              currentBalance: '494037.00', availableBalance: '494036.00',
              reservedBalance: '1.00', unclearedBalance: '0.00',
              upperLimit: '2000000000.00', notificationThreshold: '50000000.00',
              lastDebit: new Date().toISOString(), lastCredit: '2026-04-07 17:59:04.44',
              lowerLimit: '0.00', currency: 'XOF', status: 'available',
            },
          }],
        },
      },
    }));
  }

  if (subType === 'cashout') {
    return res.json(buildTransactionResponse({
      amount, currency, subType: 'cashout',
      debitParty:  [{ key: 'accountid', value: debitId }],
      creditParty: [{ key: 'accountid', value: creditId }],
      accountBalance: {
        debitParty: {
          accounts: [{
            accountcategory: { key: 'type', value: 'wallet.ewallet' },
            accountcategoryName: 'E-Wallet',
            accountBalance: {
              currentBalance: '493685.00', availableBalance: '493683.00',
              reservedBalance: '2.00', unclearedBalance: '0.00',
              upperLimit: '2000000000.00', notificationThreshold: '50000000.00',
              lastDebit: new Date().toISOString(), lastCredit: '2026-04-07 17:59:04.44',
              lowerLimit: '0.00', currency: 'XOF', status: 'available',
            },
          }],
        },
      },
    }));
  }

  if (subType === 'self_create_mmo') {
    return res.json({
      originalAmount: amount,
      currency,
      subType: 'self_create_mmo',
      creditParty: [],
      recipient: [],
      metadata: [{ key: 'fee.XOF', value: '250.00' }],
      mmoId: mmoId(),
      availableAmount: amount,
      usageType: 'singleUseWhole',
      expiryTime: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString(),
      transactionStatus: 'completed',
      transactionReference: txRef(),
      transactionReceipt: txReceipt(),
    });
  }

  // sendmoney (M2M / M2C / P2P)
  return res.json(buildTransactionResponse({
    amount, currency, subType: 'sendmoney',
    debitParty:  [{ key: 'accountid', value: debitId }],
    creditParty: [{ key: 'accountid', value: creditId }],
    accountBalance: {
      creditParty: {
        accounts: [{
          accountcategory: { key: 'type', value: 'wallet.ewallet' },
          accountcategoryName: 'E-Wallet',
          accountBalance: {
            currentBalance: '253348.00', availableBalance: '253348.00',
            reservedBalance: '0.00', unclearedBalance: '0.00',
            upperLimit: '2000000000.00', notificationThreshold: '50000000.00',
            lastDebit: '2026-04-08 12:51:34.154', lastCredit: new Date().toISOString(),
            lowerLimit: '0.00', currency: 'XOF', status: 'available',
          },
        }],
      },
    },
  }));
});

module.exports = router;
