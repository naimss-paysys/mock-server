// ─────────────────────────────────────────────
// Misc / Notification Routes
// Base URL: / (mounted at root in server.js)
//
// POST /sim-card-registration        → CVM Trigger (XML)
// POST /SendSMSHandler               → Send SMS (JSON)
// POST /live/sendnotificationapigee  → Send Notification Apigee (SOAP)
// ─────────────────────────────────────────────
const router = require('express').Router();

// --------------------------------------------
// CVM Trigger
// --------------------------------------------
router.post('/sim-card-registration', (req, res) => {
  console.log('CVM Trigger Request:', req.body);

  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Result>0</Result>
  <Message>Successfully submited message</Message>
  <RequestId>477d60165950494db0ffc73bd830bb9c</RequestId>
</Response>`;

  res.set('Content-Type', 'application/xml');
  res.send(xmlResponse);
});

// --------------------------------------------
// Send SMS Handler
// --------------------------------------------
router.post('/SendSMSHandler', (req, res) => {
  console.log('SendSMSHandler Request:', req.body);

  res.json({
    Result: 0,
    Message: 'Successfully submited message',
    RequestId: req.body?.RequestId || '1736755484-538536049',
  });
});

// --------------------------------------------
// Send Notification Apigee (SOAP)
// --------------------------------------------
router.post('/live/sendnotificationapigee', (req, res) => {
  console.log('Send Notification Apigee Request:', req.body);

  const soapResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <ns4:SOATransactionID xmlns:ns4="http://soa.mic.co.af/coredata_1">1b4a4dc9-f5aa-42c3-b4e1-c8342577b163</ns4:SOATransactionID>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <v1:SendNotificationResponse xmlns:v1="http://xmlns.tigo.com/SendNotificationResponse/V1">
      <v3:ResponseHeader xmlns:v3="http://xmlns.tigo.com/ResponseHeader/V3">
        <v3:GeneralResponse>
          <v3:correlationID>63c54ea4b8b22</v3:correlationID>
          <v3:status>OK</v3:status>
          <v3:code>sendnotification-1002-0000-S</v3:code>
          <v3:description>The notification request has been processed successfully.</v3:description>
        </v3:GeneralResponse>
      </v3:ResponseHeader>
      <v1:ResponseBody>
        <v1:responseCode>0</v1:responseCode>
        <v1:responseMessage>SMS delivered successfully.</v1:responseMessage>
      </v1:ResponseBody>
    </v1:SendNotificationResponse>
  </SOAP-ENV:Body>
</soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

module.exports = router;
