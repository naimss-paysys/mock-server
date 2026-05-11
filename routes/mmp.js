// ─────────────────────────────────────────────
// MMP / MTP Routes
// Base URL: / (mounted at root in server.js)
//
// All endpoints listed below are MMP/Telepin
// proxy-style calls. SOAP endpoints return
// text/xml; XML endpoints return application/xml.
//
// To add a new MMP endpoint:
//   1. Add a router.post('/YourEndpointName', ...)
//   2. Set the correct Content-Type on the response
//   3. Export is automatic via module.exports below
// ─────────────────────────────────────────────
const router = require('express').Router();

// --------------------------------------------
// MMP View MFS Account Type (SOAP)
// --------------------------------------------
router.post('/MMPViewMFSAccountType', (req, res) => {
  console.log('MMP View MFS Account Type Request:', req.body);

  const soapResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <ns3:SOATransactionID xmlns:ns3="http://soa.mic.co.af/coredata_1">36418c15-a1a3-4396-a405-6db99c115ad2</ns3:SOATransactionID>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <v1:ViewMFSAccountTypeResponse xmlns:v1="http://xmlns.tigo.com/MFS/ViewMFSAccountTypeResponse/V1">
      <v3:ResponseHeader xmlns:v3="http://xmlns.tigo.com/ResponseHeader/V3">
        <v3:GeneralResponse>
          <v3:correlationID>abc123</v3:correlationID>
          <v3:status>OK</v3:status>
          <v3:code>viewmfsaccounttype-3063-0000-S</v3:code>
          <v3:description>The request has been processed successfully.</v3:description>
        </v3:GeneralResponse>
      </v3:ResponseHeader>
      <v1:responseBody>
        <v1:msisdn>25571123131</v1:msisdn>
        <v1:accountID>12236916</v1:accountID>
        <v1:accountName>25571123131</v1:accountName>
        <v1:accountType>SUBSCRIBER</v1:accountType>
        <v1:accountLayer>7</v1:accountLayer>
        <v1:accountGroup>110</v1:accountGroup>
        <v1:accountStatus>ACTIVE</v1:accountStatus>
        <v1:terminalUser>19872474_654949430:null</v1:terminalUser>
      </v1:responseBody>
    </v1:ViewMFSAccountTypeResponse>
  </SOAP-ENV:Body>
</soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

// --------------------------------------------
// MMP Create Handler (SOAP)
// --------------------------------------------
router.post('/MMPCreateHandler', (req, res) => {
  console.log('MMP Create Handler Request:', req.body);

  const soapResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <ns3:SOATransactionID xmlns:ns3="http://soa.mic.co.af/coredata_1">da9d085b-b522-4460-901c-a54ecd79ba14</ns3:SOATransactionID>
  </SOAP-ENV:Header>
  <soapenv:Body>
    <v1:CreateMFSAccountUsernameResponse xmlns:v1="http://xmlns.tigo.com/MFS/CreateMFSAccountUsernameResponse/V1">
      <v3:ResponseHeader xmlns:v3="http://xmlns.tigo.com/ResponseHeader/V3">
        <v3:GeneralResponse>
          <v3:correlationID>693145772a37720b</v3:correlationID>
          <v3:status>OK</v3:status>
          <v3:code>createmfsaccountusername-1173-0000-S</v3:code>
          <v3:description>The request has been processed successfully.</v3:description>
        </v3:GeneralResponse>
      </v3:ResponseHeader>
      <v1:responseBody>
        <v1:message>Account Username created successfully</v1:message>
      </v1:responseBody>
    </v1:CreateMFSAccountUsernameResponse>
  </soapenv:Body>
</soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

// --------------------------------------------
// MMP PIN Validation (SOAP)
// --------------------------------------------
router.post('/MMPPinValidation', (req, res) => {
  console.log('MMP PIN Validation Request:', req.body);

  const soapResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header>
    <cor:SOATransactionID xmlns:cor="http://soa.mic.co.af/coredata_1">166a7356-e44a-4648-bffc-9a872bf42bca</cor:SOATransactionID>
  </soapenv:Header>
  <soapenv:Body>
    <v1:authenticateresponse xmlns:v1="http://xmlns.tigo.com/MFS/AuthenticationResponse/V1">
      <v31:ResponseHeader xmlns:v31="http://xmlns.tigo.com/ResponseHeader/V3">
        <v31:GeneralResponse>
          <v31:correlationID>abc123</v31:correlationID>
          <v31:status>OK</v31:status>
          <v31:code>authenticate-2007-0000-S</v31:code>
          <v31:description>The request has been processed successfully</v31:description>
        </v31:GeneralResponse>
      </v31:ResponseHeader>
      <v1:responseBody>
        <v1:successMessage>User is Successfully Authenticated</v1:successMessage>
      </v1:responseBody>
    </v1:authenticateresponse>
  </soapenv:Body>
</soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

// --------------------------------------------
// MMP Get MFS Balance Proxy (XML)
// --------------------------------------------
router.post('/MMPGetMFSBalanceProxy', (req, res) => {
  console.log('MMP Get MFS Balance Proxy Request:', req.body);

  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<MTPGGetBalanceResponse>
  <ResultCode>0</ResultCode>
  <Message/>
  <TigoPesa>142475.00000</TigoPesa>
  <SavingPesa>0.00000</SavingPesa>
  <Wallet3>0.00000</Wallet3>
  <Wallet4>0.00000</Wallet4>
</MTPGGetBalanceResponse>`;

  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
});

// --------------------------------------------
// MMP Get MFS User Status (SOAP)
// --------------------------------------------
router.post('/MMPGetMFSUserStatus', (req, res) => {
  console.log('MMP Get MFS User Status Request:', req.body);

  const soapResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <ns3:SOATransactionID xmlns:ns3="http://soa.mic.co.af/coredata_1">27932a49-b28e-47b8-865f-94b4af05782f</ns3:SOATransactionID>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <v1:GetMFSUserStatusResponse xmlns:v1="http://xmlns.tigo.com/MFS/GetMFSUserStatusResponse/V1">
      <v3:ResponseHeader xmlns:v3="http://xmlns.tigo.com/ResponseHeader/V3">
        <v3:GeneralResponse>
          <v3:correlationID>63dbc560cf52c</v3:correlationID>
          <v3:status>OK</v3:status>
          <v3:code>getmfsuserstatus-3064-0000-S</v3:code>
          <v3:description>The request has been processed successfully.</v3:description>
        </v3:GeneralResponse>
      </v3:ResponseHeader>
      <v1:responseBody>
        <v1:userWallet>
          <v1:msisdn>25571123131</v1:msisdn>
        </v1:userWallet>
        <v1:userID>12239094</v1:userID>
        <v1:userStatus>ACTIVE</v1:userStatus>
        <v1:statusRemark>Blocked due to wrong pin</v1:statusRemark>
        <v1:statusChangeReason>Customers request</v1:statusChangeReason>
      </v1:responseBody>
    </v1:GetMFSUserStatusResponse>
  </SOAP-ENV:Body>
</soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

// --------------------------------------------
// MMP Change PIN (SOAP)
// --------------------------------------------
router.post('/MMPChangePIN', (req, res) => {
  console.log('MMP Change PIN Request:', req.body);

  const soapResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header>
    <cor:SOATransactionID xmlns:cor="http://soa.mic.co.af/coredata_1">ed6c41ff-8a20-4654-9e38-ffb836b2201d</cor:SOATransactionID>
  </soapenv:Header>
  <soapenv:Body>
    <v1:IsChangePinRequestResponse xmlns:v1="http://xmlns.tigo.com/MFS/PinManagementResponse/V1">
      <v31:ResponseHeader xmlns:v31="http://xmlns.tigo.com/ResponseHeader/V3">
        <v31:GeneralResponse>
          <v31:correlationID>abc123</v31:correlationID>
          <v31:status>OK</v31:status>
          <v31:code>pinmanagement-2006-0003-S</v31:code>
          <v31:description>Pin Change Not Required.</v31:description>
        </v31:GeneralResponse>
      </v31:ResponseHeader>
      <v1:responseBody>
        <v1:statusCode>pinmanagement-2006-0003-S</v1:statusCode>
        <v1:statusMessage>Pin Change Not Required.</v1:statusMessage>
      </v1:responseBody>
    </v1:IsChangePinRequestResponse>
  </soapenv:Body>
</soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

// --------------------------------------------
// MMP Disable Terminal User (XML)
// --------------------------------------------
router.post('/MMPDisableTerminalUser', (req, res) => {
  console.log('MMP Disable Terminal User Request:', req.body);

  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<ChangeUserStatusResponse>
  <ResultCode>0</ResultCode>
  <Message/>
</ChangeUserStatusResponse>`;

  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
});

// --------------------------------------------
// MMP Bill Query (XML)
// --------------------------------------------
router.post('/MMPBillQuery', (req, res) => {
  console.log('MMP Bill Query Request:', req.body);

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
});

// --------------------------------------------
// MMP Bill Payment (XML)
// --------------------------------------------
router.post('/MMPBillPayment', (req, res) => {
  console.log('MMP Bill Payment Request:', req.body);

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
});

// --------------------------------------------
// MMP Cash Out Payment (XML)
// --------------------------------------------
router.post('/MMPCashOutPayment', (req, res) => {
  console.log('MMP Cash Out Payment Request:', req.body);

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
});

// --------------------------------------------
// MMP Send Money Payment (XML)
// --------------------------------------------
router.post('/MMPSendMoneyPayment', (req, res) => {
  console.log('MMP Send Money Payment Request:', req.body);

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
});

// --------------------------------------------
// MMP Proxy Transfer (XML)
// --------------------------------------------
router.post('/MMPProxyTransfer', (req, res) => {
  console.log('MMP Proxy Transfer Request:', req.body);

  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<MTPGPaymentResponse>
  <ResultCode>0</ResultCode>
  <Message>You have paid TSh 1,600 to 255652264417 - SUBIRA HASSANI. Charges TSh 20. VAT TSh 3. TxnID: 26897512256. New balance is TSh 142,475. Thank you for using Tigo Pesa.TPESALIPA</Message>
  <OrigAmount/>
  <TransID>26897512256</TransID>
  <NewBalance>142475.00</NewBalance>
  <TotalDebit>1620.00000</TotalDebit>
  <TotalCharge>20.00000</TotalCharge>
  <LevyTax>0.00000</LevyTax>
  <ServiceCharge>0.00000</ServiceCharge>
  <ReceiverMSISDN>255652264417</ReceiverMSISDN>
  <TargetRefNumber>075977345500493</TargetRefNumber>
  <TargetRefName/>
  <ExtReferenceId/>
  <Token/>
  <BillerAccNumber>255652264417</BillerAccNumber>
  <BillerAccName>7955643</BillerAccName>
  <BillerBankID/>
  <BillPayer/>
  <BillPayee/>
  <PaymentType/>
  <BrandID>2113</BrandID>
  <BrandName>Merchant.Individual</BrandName>
  <VAT>3</VAT>
  <DCommission2>0</DCommission2>
  <DCommission3>0</DCommission3>
</MTPGPaymentResponse>`;

  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
});

// --------------------------------------------
// Payment (QR & Till code) - MMP Telepin (XML)
// --------------------------------------------
router.post('/PaymentQRAndTillCodeMmpTelepin', (req, res) => {
  console.log('Payment (QR & Till code)-MMP-Telepin Request:', req.body);

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
});

// --------------------------------------------
// Request to Pay - Payment MMP Telepin Copy (XML)
// --------------------------------------------
router.post('/RequestToPayPaymentMmpTelepinCopy', (req, res) => {
  console.log('Request to Pay-(Payment) MMP Telepin Copy Request:', req.body);

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
});

// --------------------------------------------
// MPP Cash Out Fee (XML)
// --------------------------------------------
router.post('/MPPCashOutFee', (req, res) => {
  console.log('MPP Cash Out Fee Request:', req.body);

  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<CalculateFeeResponse>
  <ResultCode>0</ResultCode>
  <Message>Ingiza namba ya siri kutuma TSh 1,000 kwenda kwa mpokeaji wa Halo Pesa ANETH MELKSEDECK GORDIAN - 255615201891. Jumla ya Makato TSh 45. (Ada TSh 45. Tozo TSh 0).</Message>
  <Fee>45.0</Fee>
  <BillCtrNum>255615201891</BillCtrNum>
  <EnteredAmnt>1000.0</EnteredAmnt>
  <GepgWalletAccNum/>
  <SpName>Halo Pesa</SpName>
  <BillPayOpt/>
  <TargetName>ANETH MELKSEDECK GORDIAN</TargetName>
  <WakalaMSISDN>255615201891</WakalaMSISDN>
  <COFee>0.0</COFee>
  <VAT>0</VAT>
  <DestMSISDN>255615201891</DestMSISDN>
  <Levy>0.0</Levy>
  <Fees>0.0</Fees>
  <TotalFee>45.0</TotalFee>
</CalculateFeeResponse>`;

  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
});

// --------------------------------------------
// MMP Calculate Fee Namecheck (XML)
// --------------------------------------------
router.post('/MMPCalculateFeeNamecheck', (req, res) => {
  console.log('MMP Calculate Fee Namecheck Request:', req.body);

  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<CalculateFeeResponse>
  <ResultCode>0</ResultCode>
  <Message>Ingiza namba ya siri kutuma TSh 1,000 kwenda kwa mpokeaji wa Halo Pesa ANETH MELKSEDECK GORDIAN - 255615201891. Jumla ya Makato TSh 45. (Ada TSh 45. Tozo TSh 0).</Message>
  <Fee>45.0</Fee>
  <BillCtrNum>255615201891</BillCtrNum>
  <EnteredAmnt>1000.0</EnteredAmnt>
  <GepgWalletAccNum/>
  <SpName>Halo Pesa</SpName>
  <BillPayOpt/>
  <TargetName>ANETH MELKSEDECK GORDIAN</TargetName>
  <WakalaMSISDN>255615201891</WakalaMSISDN>
  <COFee>0.0</COFee>
  <VAT>0</VAT>
  <DestMSISDN>255615201891</DestMSISDN>
  <Levy>0.0</Levy>
  <Fees>0.0</Fees>
  <TotalFee>45.0</TotalFee>
</CalculateFeeResponse>`;

  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
});

// --------------------------------------------
// MMP Send Money M2M (XML)
// --------------------------------------------
router.post('/MMPSendMoneyM2M', (req, res) => {
  console.log('MMP Send Money M2M Request:', req.body);

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
});

// --------------------------------------------
// Request to Pay - Check Fee (XML)
// --------------------------------------------
router.post('/Request-topay-checkfee', (req, res) => {
  console.log('Request-topay-checkfee Request:', req.body);

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
});

module.exports = router;
