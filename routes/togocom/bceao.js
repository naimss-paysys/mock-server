// ─────────────────────────────────────────────
//  Togocom — BCEAO / PI (Interoperability) + Misc/Auth
//
//  POST /bceao-api/v1/alias/initiate-search        → PI Initiate Search
//  POST /bceao-api/v1/alias/initiate-delete        → PI Alias Delete
//  POST /bceao-api/v1/alias/initiate-update        → PI Alias Update
//  POST /bceao-api/v1/alias/initiate-creation      → PI Alias Creation
//  POST /bceao-api/v1/alias/validate-creationinitiated → PI Confirm Alias Creation
//  POST /bceao-api/v1/features/qr-generate         → QR Code Generate
//  POST /bceao-api/v1/features/qr-decode           → QR Code Decode
//  POST /bceao-api/v1/payment-request/request      → PI Payment Request
//  POST /otp/v1                                    → Get OTP
//  POST /reis-apis/v1/reis-aml                     → AML Check
//  GET  /self-reset-pin/v1/get-data                → Forget PIN – Get Data
//  POST /self-reset-pin/v1/process                 → Forget PIN – Process Reset
// ─────────────────────────────────────────────
const router = require('express').Router();

// ── PI Initiate Search ─────────────────────────────────────────
router.post('/bceao-api/v1/alias/initiate-search', (req, res) => {
  console.log('PI Initiate Search Request:', req.body);
  res.json({
    status: { code: 200, message: 'SUCCESS', description: 'This request has succeeded.' },
    data: { message: 'Alias research is on going.' },
  });
});

// ── PI Alias Delete ────────────────────────────────────────────
// Async callback to caller: notificationCode=ALIAS-DELETE
router.post('/bceao-api/v1/alias/initiate-delete', (req, res) => {
  console.log('PI Alias Delete Request:', req.body);
  res.json({
    status: { code: 200, message: 'SUCCESS', description: 'This request has succeeded.' },
    data: { message: 'Alias delete is on going.' },
  });
});

// ── PI Alias Update ────────────────────────────────────────────
router.post('/bceao-api/v1/alias/initiate-update', (req, res) => {
  console.log('PI Alias Update Request:', req.body);
  res.json({
    status: { code: 200, message: 'SUCCESS', description: 'This request has succeeded.' },
    data: { message: 'Alias update is on going.' },
  });
});

// ── PI Alias Creation ──────────────────────────────────────────
router.post('/bceao-api/v1/alias/initiate-creation', (req, res) => {
  console.log('PI Alias Creation Request:', req.body);
  const otp = Math.floor(100000 + Math.random() * 900000);
  res.json({
    status: { code: 200, message: 'SUCCESS', description: 'This request has succeeded.' },
    data: {
      message: 'Alias creation initiated!',
      data: {
        otp: {
          status: { code: 200, message: 'success', description: 'Data saved successfully.' },
          data: otp,
        },
        numPhone: req.body.id || req.body.compte || '90008869',
        typeAlias: req.body.type || 'MBNO',
        requestId: req.body.requestId || '',
      },
    },
  });
});

// ── PI Confirm Alias Creation ──────────────────────────────────
router.post('/bceao-api/v1/alias/validate-creationinitiated', (req, res) => {
  console.log('PI Confirm Alias Creation Request:', req.body);
  res.json({
    status: { code: 200, message: 'SUCCESS', description: 'This request has succeeded.' },
    data: {
      message: 'Alias creation is on going.',
      data: {
        status: true,
        http: 202,
        data: { message: "Demande de création d'alias en cours de traitement" },
        reason: '',
      },
    },
  });
});

// ── QR Code Generate ──────────────────────────────────────────
// Real path: POST /bceaoapi/v1/features/qrstring
router.post('/bceao-api/v1/features/qrstring', (req, res) => {
  console.log('QR Generate Request:', req.body);

  const alias    = req.body?.alias             || '59a42d4c-704e-43fb-9927-978b43c0ea22';
  const txId     = String(req.body?.txId       || 'AAAA256488888').slice(0, 13).padEnd(13, '0');
  const amount   = req.body?.transactionAmount || 100;

  // Build EMVCo-compatible BCEAO QR string
  // Tag 36 — merchant account info (always 56 chars for a UUID alias)
  const merchantInfo    = `0012int.bceao.pi0136${alias}`;
  const merchantInfoLen = String(merchantInfo.length).padStart(2, '0');

  // Tag 54 — transaction amount
  const amountStr = String(amount);
  const amountLen = String(amountStr.length).padStart(2, '0');
  const amountTag = `54${amountLen}${amountStr}`;

  // Tag 62 — additional data: sub-tag 05 = txId (13 chars), sub-tag 11 = canal (3 chars)
  const txIdLen        = String(txId.length).padStart(2, '0');
  const additionalData = `05${txIdLen}${txId}1103731`;
  const additionalLen  = String(additionalData.length).padStart(2, '0');

  const qrstring = [
    '000201',
    `36${merchantInfoLen}${merchantInfo}`,
    '52040000',
    '5303952',
    amountTag,
    '5802TG',
    '5901X',
    '6001X',
    `62${additionalLen}${additionalData}`,
    '63044E2A',  // CRC placeholder (real servers compute CRC-16/CCITT)
  ].join('');

  res.json({
    status: { code: 202, message: 'SUCCESS', description: 'This request has succeeded.' },
    data: {
      message: 'Your request has been executed with success',
      qrstring,
    },
  });
});

// ── QR Code Decode ─────────────────────────────────────────────
// Real path: POST /bceaoapi/v1/features/qrstring-decode
router.post('/bceao-api/v1/features/qrstring-decode', (req, res) => {
  console.log('QR Decode Request:', req.body);

  const qrstring = req.body?.qrstring || '';

  // Parse alias (tag 36 sub-tag 01 — 36-char UUID after "int.bceao.pi0136")
  const aliasMatch = qrstring.match(/int\.bceao\.pi0136([0-9a-f-]{36})/i);
  const alias      = aliasMatch ? aliasMatch[1] : '59a42d4c-704e-43fb-9927-978b43c0ea22';

  // Parse amount (tag 54 — digits immediately after "54NN")
  const amountMatch = qrstring.match(/54\d{2}(\d+)/);
  const amount      = amountMatch ? amountMatch[1] : '100';

  // Parse txId (sub-tag 05 inside tag 62 — 13 chars after "0513")
  const txIdMatch = qrstring.match(/0513([A-Z0-9]{13})/);
  const txId      = txIdMatch ? txIdMatch[1] : 'AAAA256488888';

  // Parse canal (sub-tag 11 inside tag 62 — 3 chars after "1103")
  const canalMatch = qrstring.match(/1103(\d{3})/);
  const canal      = canalMatch ? canalMatch[1] : '731';

  res.json({
    status: { code: 202, message: 'SUCCESS', description: 'This request has succeeded.' },
    data: {
      message: 'Your request has been executed with success',
      item: { alias, amount, txId, canal },
    },
  });
});

// ── PI Payment Request ─────────────────────────────────────────
router.post('/bceao-api/v1/payment-request/request', (req, res) => {
  console.log('PI Payment Request:', req.body);
  res.json({
    status: { code: 202, message: 'SUCCESS', description: 'This request has succeeded.' },
    data: { message: 'Your request has been executed with success' },
  });
});

// ── Get OTP ────────────────────────────────────────────────────
router.post('/otp/v1', (req, res) => {
  console.log('Get OTP Request:', req.body);
  res.json({
    status: 'success',
    referenceId: '$2a$12$8jK4MvqWLQoqK8xIjxvMlO',
  });
});

// ── AML Check (legacy path) ────────────────────────────────────
router.post('/reis-apis/v1/reis-aml', (req, res) => {
  console.log('AML Request:', req.body);
  res.json({
    status: { code: 200, message: 'Success', description: 'Client onboard succeffuly' },
    data: null,
  });
});

// ── AML Check — REIS-AML (POST /reis-aml) ─────────────────────
// Mirrors: https://reis-aml-prp.yas.tg/reis-aml
//
// Request body:
//   { "data": [{ "accountData": [ { "op": "replace", "path": "/fieldName", "value": "..." }, ... ] }], "msisdn": "92790014" }
//
// Mandatory accountData paths:
//   /status, /name, /last_name, /nationality, /placeOfBirth,
//   /address_country, /activity_domain, /id_number, /id_type,
//   /id_del_date, /id_exp_date, /organization, /gender,
//   /limit_kyc, /date_of_birth
//
// Success  → { status: { code: 200, message: "Success", description: "Client onboard successfuly" }, data: null }
// Failure  → { status: { code: 4002, message: "Bad request", description: "Missing mandatory parameters: <field>" }, data: null }
router.post('/reis-aml', (req, res) => {
  console.log('REIS-AML Request:', JSON.stringify(req.body, null, 2));

  const { msisdn, data } = req.body || {};

  // ── top-level msisdn ──────────────────────────────────────────
  if (!msisdn) {
    return res.status(200).json({
      status: { code: 4002, message: 'Bad request', description: 'Missing mandatory parameters: msisdn' },
      data: null,
    });
  }

  // ── extract accountData from first element ────────────────────
  const accountData = Array.isArray(data) && data[0] && Array.isArray(data[0].accountData)
    ? data[0].accountData
    : [];

  // Build a map of path → value for quick lookup
  const fields = {};
  for (const entry of accountData) {
    if (entry && entry.path) {
      fields[entry.path] = entry.value;
    }
  }

  // ── mandatory field check ─────────────────────────────────────
  const mandatory = [
    '/status', '/name', '/last_name', '/nationality', '/placeOfBirth',
    '/address_country', '/activity_domain', '/id_number', '/id_type',
    '/id_del_date', '/id_exp_date', '/organization', '/gender',
    '/limit_kyc', '/date_of_birth',
  ];

  for (const path of mandatory) {
    if (fields[path] === undefined || fields[path] === null || fields[path] === '') {
      const fieldName = path.replace('/', '');
      return res.status(200).json({
        status: { code: 4002, message: 'Bad request', description: `Missing mandatory parameters: ${fieldName}` },
        data: null,
      });
    }
  }

  // ── success ───────────────────────────────────────────────────
  res.json({
    status: { code: 200, message: 'Success', description: 'Client onboard successfuly' },
    data: null,
  });
});

// ── Forget PIN — Get Data ──────────────────────────────────────
router.get('/self-reset-pin/v1/get-data', (req, res) => {
  console.log('Forget PIN Get Data Request:', req.query);
  res.json({
    status: { code: 200, message: 'SUCCESS', description: 'Request executed successfully' },
    data: {
      showIdCard: false,
      dataShow: {
        firstNames: [
          { value: 'ABOTSI TCHAA',   isCorrect: false },
          { value: 'ADJO CHRISTINE', isCorrect: false },
          { value: 'AGBEWONOU',      isCorrect: false },
          { value: 'DINE',           isCorrect: false },
          { value: 'TEST',           isCorrect: true  },
        ],
        lastNames: [
          { value: 'ABBEY',        isCorrect: false },
          { value: 'ONYEMA IJIOMA', isCorrect: false },
          { value: 'FAROUK',       isCorrect: false },
          { value: 'ABALO',        isCorrect: false },
          { value: 'TEST',         isCorrect: true  },
        ],
        birthDates: [
          { value: '1983-01-02', isCorrect: false },
          { value: '1981-12-31', isCorrect: false },
          { value: '1987-02-22', isCorrect: false },
          { value: '1996-05-20', isCorrect: false },
          { value: '2026-04-07', isCorrect: true  },
        ],
        identities: [
          { value: '0433-383-4043', isCorrect: false },
          { value: '0413-781-4062', isCorrect: false },
          { value: '0018-519-4063', isCorrect: false },
          { value: '0594-418-1060', isCorrect: false },
        ],
      },
    },
  });
});

// ── Forget PIN — Process Reset ─────────────────────────────────
router.post('/self-reset-pin/v1/process', (req, res) => {
  console.log('Forget PIN Process Request:', req.body);
  res.json({
    status: { code: 401, message: 'FAILURE', description: 'Incorrect reset data' },
    data: {
      msisdn: req.body.msisdn || '90009082',
      remainingAttempts: 1,
    },
  });
});

module.exports = router;
