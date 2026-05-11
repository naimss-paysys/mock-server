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
router.post('/bceao-api/v1/features/qr-generate', (req, res) => {
  console.log('QR Generate Request:', req.body);
  const alias  = req.body.alias || '59a42d4c-704e-43fb-9927-978b43c0ea22';
  const txId   = req.body.txId  || 'AAAA256488888';
  const amount = req.body.transactionAmount || 100;
  const qrstring = `00020136560012int.bceao.pi0136${alias}020${String(amount).padStart(3, '0')}5204000053036470540${amount}5802TG5904TOGO6007Lomé62070703${txId}6304ABCD`;
  res.json({
    status: { code: 202, message: 'SUCCESS', description: 'This request has succeeded.' },
    data: { message: 'Your request has been executed with success', qrstring },
  });
});

// ── QR Code Decode ─────────────────────────────────────────────
router.post('/bceao-api/v1/features/qr-decode', (req, res) => {
  console.log('QR Decode Request:', req.body);
  const qrstring   = req.body.qrstring || '';
  const aliasMatch = qrstring.match(/int\.bceao\.pi0136([0-9a-f-]{36})/i);
  const alias      = aliasMatch ? aliasMatch[1] : '59a42d4c-704e-43fb-9927-978b43c0ea22';
  res.json({
    status: { code: 202, message: 'SUCCESS', description: 'This request has succeeded.' },
    data: {
      message: 'Your request has been executed with success',
      item: { alias, amount: '100', txId: 'AAAA256488888', canal: '731' },
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

// ── AML Check ─────────────────────────────────────────────────
router.post('/reis-apis/v1/reis-aml', (req, res) => {
  console.log('AML Request:', req.body);
  res.json({
    status: { code: 200, message: 'Success', description: 'Client onboard succeffuly' },
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
