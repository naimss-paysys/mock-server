// ─────────────────────────────────────────────
// Payment / Gateway Routes
// Base URL: / (mounted at root in server.js)
//
// GET  /TigoPaymentGateway_1_2               → usage hint
// POST /TigoPaymentGateway_1_2?p=7005        → BetPawa Payment (XML)
// POST /TigoPaymentGateway_1_2?p=2136        → Calculate Fee (XML)
// POST /TigoPaymentGateway_1_2?p=1945        → Send Money GePG (XML)
// POST /TigoPaymentGateway_1_2?p=1944        → Calculate Fee Merchant (XML)
// POST /TigoPaymentGateway_1_2?p=2022        → Bill Query (XML)
// POST /SuperAppTransInquiry2TigoTQS         → Transaction Inquiry (XML)
// POST /USSDrouterPushBillpaySupperApp       → Biller Payment (JSON)
// POST /1.0/tz/test/merchant/api/RequestToPay/BillerCallbac  (typo path, kept for compat)
// POST /1.0/tz/test/merchant/api/RequestToPay/BillerCallback → Biller Callback (JSON)
// ─────────────────────────────────────────────
const router = require('express').Router();

// In-memory deduplication set for biller payments.
// Resets when the server restarts.
const processedBillpayReferenceIds = new Set();

// ─────────────────────────────────────────────
// Tigo Payment Gateway (single route, branched by ?p=)
// ─────────────────────────────────────────────
router.get('/TigoPaymentGateway_1_2', (req, res) => {
  res.status(405).json({
    error: 'Method Not Allowed',
    message: 'Use POST for this endpoint.',
    examples: [
      'POST /TigoPaymentGateway_1_2?p=7005  → BetPawa Payment',
      'POST /TigoPaymentGateway_1_2?p=2136  → Calculate Fee',
      'POST /TigoPaymentGateway_1_2?p=1945  → Send Money GePG',
      'POST /TigoPaymentGateway_1_2?p=1944  → Calculate Fee Merchant',
      'POST /TigoPaymentGateway_1_2?p=2022  → Bill Query',
    ],
  });
});

router.post('/TigoPaymentGateway_1_2', (req, res) => {
  console.log(`Tigo Payment Gateway Request (p=${req.query.p}):`, req.body);

  switch (req.query.p) {
    case '7005': return handleBetPawaPayment(req, res);
    case '2136': return handleCalculateFee(req, res);
    case '1945': return handleSendMoneyGePG(req, res);
    case '1944': return handleCalculateFeeMerchant(req, res);
    case '2022': return handleBillQuery(req, res);
    default:
      return res.status(400).json({
        error: 'Unknown p parameter',
        received: req.query.p,
        valid: ['7005', '2136', '1945', '1944', '2022'],
      });
  }
});

// --- BetPawa Payment (p=7005) ---
function handleBetPawaPayment(req, res) {
  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<MTPGPaymentResponse>
  <ResultCode>0</ResultCode>
  <Message>Maelezo ya ankara BetPawa, no. ya kampuni: 445445, kumbukumbu no: Paw. Kiasi TSh 30,000. Salio jipya TSh 7,645. Ada TSh 600. VAT TSh 92.Muamala: 26885574977044.27/01/26 07:51.LKS</Message>
  <OrigAmount>30000.0</OrigAmount>
  <TransID>26885574977044</TransID>
  <NewBalance>7645.12</NewBalance>
  <TotalDebit>30600.00000</TotalDebit>
  <TotalCharge>600.00000</TotalCharge>
  <LevyTax>0.00000</LevyTax>
  <ServiceCharge>0.00000</ServiceCharge>
  <ReceiverMSISDN>Paw</ReceiverMSISDN>
  <TargetRefNumber>Paw</TargetRefNumber>
  <TargetRefName/>
  <ExtReferenceId>5cec321c-77b8-4d7b-a6a4-3e20463020ad</ExtReferenceId>
  <BillerAccNumber/>
  <BillerAccName/>
  <BillerBankID/>
  <BillPayer/>
  <BillPayee/>
  <PaymentType/>
  <BrandID>3842</BrandID>
  <BrandName>BetPawa</BrandName>
  <VAT>92</VAT>
  <DCommission2>0</DCommission2>
  <DCommission3>0</DCommission3>
</MTPGPaymentResponse>`;
  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
}

// --- Calculate Fee (p=2136) ---
function handleCalculateFee(req, res) {
  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<CalculateFeeResponse>
  <ResultCode>0</ResultCode>
  <Message>Ndugu Mteja BAINA JUMA LUHASI, Weka Namba ya siri kulipa TSh 1,000 Ada: TSh 20. kwenda Malipo ya Serikali.</Message>
  <Fee>20.0</Fee>
  <BillCtrNum>991040593832</BillCtrNum>
  <EnteredAmnt>1000.0</EnteredAmnt>
  <GepgWalletAccNum>001001</GepgWalletAccNum>
  <SpName>DAR ES SALAAM WATER SUPPLY AND SANITATION AUTHORITY</SpName>
  <BillPayOpt>PART</BillPayOpt>
  <TargetName>BAINA JUMA LUHASI</TargetName>
  <COFee>0.0</COFee>
  <VAT>Malipo ya Serikali</VAT>
</CalculateFeeResponse>`;
  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
}

// --- Send Money GePG (p=1945) ---
function handleSendMoneyGePG(req, res) {
  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<SendMoneyResponse>
  <ResultCode>0</ResultCode>
  <Message>Malipo yamekamilika, Kiasi TSh 500 kwenda Malipo ya Serikali (001001) kumbukumbu No:991040593832. Muamala 26885396061019. 09/01/26 10:38.Salio jipya TSh 7,344. Ada 10.</Message>
  <OrigAmount>500.0</OrigAmount>
  <TransID>26885396061019</TransID>
  <NewBalance>7344.00</NewBalance>
  <TotalDebit>510.00000</TotalDebit>
  <TotalCharge>10.00000</TotalCharge>
  <ReceiverMSISDN>991040593832</ReceiverMSISDN>
  <COFee>0.0</COFee>
  <BrandID>1230</BrandID>
  <BrandName>Malipo ya Serikali Old</BrandName>
</SendMoneyResponse>`;
  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
}

// --- Calculate Fee Merchant (p=1944) ---
function handleCalculateFeeMerchant(req, res) {
  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<CalculateFeeResponse>
  <ResultCode>0</ResultCode>
  <Message>Hakiki jina la wakala kisha ingiza namba ya siri kutoa TSh 264,500 kwa wakala EJENI MNJEJA. Jumla ya Makato TSh 500. (Ada TSh 0, Tozo TSh 0)</Message>
  <Fee>500.0</Fee>
  <BillCtrNum>255711404306</BillCtrNum>
  <TotalAmnt>264500.0</TotalAmnt>
  <GepgWalletAccNum/>
  <SpName/>
  <BillPayOpt/>
  <TargetName>EJENI MAYKO MNJEJA</TargetName>
  <WakalaMSISDN>255711404306</WakalaMSISDN>
  <COFee>0.0</COFee>
  <VAT/>
  <DestMSISDN>255711404306</DestMSISDN>
  <Levy>0.0</Levy>
  <Fees>0.0</Fees>
  <TotalFee>500.0</TotalFee>
</CalculateFeeResponse>`;
  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
}

// --- Bill Query (p=2022) ---
function handleBillQuery(req, res) {
  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<MTPGBillQueryResponse>
  <ResultCode>0</ResultCode>
  <Message>Ndugu Mteja JABIRI IRUNGA, Weka Namba ya siri kulipa TSh 1,000 Ada: TSh 0. Mrejaa Tsh 28. kwenda LUKU GePG</Message>
  <Fee>0.0</Fee>
  <BillDueAmount/>
  <BillerBankAccName/>
  <BillerBankAccNum/>
  <TotalAmount>1000.0</TotalAmount>
  <TotalCharge/>
  <SourceLevyTax>0.0</SourceLevyTax>
  <SourceOnLevyTax>0.0</SourceOnLevyTax>
  <ServiceCharge>0.0</ServiceCharge>
  <ControlNumber>24213028962</ControlNumber>
  <PaymentOption/>
  <BrandID>3574</BrandID>
  <BillPayer>JABIRI IRUNGA</BillPayer>
  <BillPayee/>
</MTPGBillQueryResponse>`;
  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
}

// ─────────────────────────────────────────────
// Super App Transaction Inquiry to Tigo TQS (XML)
// ─────────────────────────────────────────────
router.post('/SuperAppTransInquiry2TigoTQS', (req, res) => {
  console.log('Super App Transaction Inquiry Request:', req.body);

  const requestBody = typeof req.body === 'string' ? req.body : '';
  const getTagValue = (tagName) => {
    const match = requestBody.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
    return match ? match[1].trim() : '';
  };

  const type          = getTagValue('TYPE')          || 'MTPGGetSODetails';
  const referenceId   = getTagValue('REFERENCEID')   || 'SUBQ0000000233';
  const requestMsisdn = getTagValue('MSISDN')        || '25565888222';
  const externalRefId = getTagValue('EXTERNALREFID') || referenceId;
  const txDate        = new Date().toISOString();

  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<COMMAND>
  <TYPE>${type}</TYPE>
  <RESULTCODE>0</RESULTCODE>
  <RESULTDESC>Sales order details retrieved successfully</RESULTDESC>
  <TXNID>26638644052</TXNID>
  <TXNSTATUS>Posted</TXNSTATUS>
  <EXTERNALREFID>${externalRefId}</EXTERNALREFID>
  <REVERSALREQID>${externalRefId}</REVERSALREQID>
  <BRANDID>187</BRANDID>
  <MSISDN>${requestMsisdn}</MSISDN>
  <COMPANYNAME>NMB A2W</COMPANYNAME>
  <AMOUNT>1000</AMOUNT>
  <REF>${referenceId}</REF>
  <DATETRANSACTED>${txDate}</DATETRANSACTED>
  <CONTROLNO>255654949430</CONTROLNO>
</COMMAND>`;

  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
});

// ─────────────────────────────────────────────
// Biller Payment By API Key and User-Id (JSON)
// ─────────────────────────────────────────────
router.post('/USSDrouterPushBillpaySupperApp', (req, res) => {
  console.log('USSDrouterPushBillpaySupperApp Request:', req.body);

  const customerMsisdn = String(req.body?.CustomerMSISDN || '').trim();
  const referenceId    = String(req.body?.ReferenceID    || '').trim() || `TST${Date.now()}`;

  if (!/^255\d{9}$/.test(customerMsisdn)) {
    return res.json({
      ResponseCode: 'DebitMandate-10-2040-V',
      ResponseStatus: false,
      ResponseDescription: 'Invalid Customer MSISDN',
      ReferenceID: referenceId,
    });
  }

  if (processedBillpayReferenceIds.has(referenceId)) {
    return res.json({
      ResponseCode: 'DuplicateRefID',
      ResponseStatus: false,
      ResponseDescription: 'Duplicate Reference ID',
      ReferenceID: referenceId,
    });
  }

  processedBillpayReferenceIds.add(referenceId);

  return res.json({
    ResponseCode: 'BILLER-18-0000-S',
    ResponseStatus: true,
    ResponseDescription: 'Request sent to user',
    ReferenceID: referenceId,
  });
});

// ─────────────────────────────────────────────
// Request To Pay - Biller Callback (JSON)
// Two paths: one with the original typo, one correct.
// ─────────────────────────────────────────────
function billerCallbackHandler(req, res) {
  console.log('RequestToPay Biller Callback Request:', req.body);

  const statusValue = String(req.body?.Status || '').trim().toLowerCase();
  const isSuccess   = statusValue !== 'false';
  const referenceId = String(req.body?.ReferenceID || '').trim()
    || (isSuccess ? 'TST1736321974' : 'TST1736326737');

  if (isSuccess) {
    return res.json({
      success: true,
      responseCode: 'BILLER-18-0000-S',
      transactionStatus: 'true',
      errorDescription: 'Callback successful',
      referenceID: referenceId,
    });
  }

  return res.json({
    success: false,
    responseCode: 'BILLER-18-3020-E',
    transactionStatus: 'false',
    errorDescription: 'Callback failed',
    referenceID: referenceId,
  });
}

// Kept for backward-compatibility (original typo in path)
router.post('/1.0/tz/test/merchant/api/RequestToPay/BillerCallbac',  billerCallbackHandler);
router.post('/1.0/tz/test/merchant/api/RequestToPay/BillerCallback', billerCallbackHandler);

module.exports = router;
