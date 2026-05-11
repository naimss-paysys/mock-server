// ─────────────────────────────────────────────
// OSB SOAP Routes
// Base URL: /osb/services  (mounted in server.js)
//
// POST /UserRegistration_5_0        → Wallet Account Registration
// POST /ChangeCustomerTigoPesaGroup_1_0 → Change Group ID
// POST /UpdateAliasCode_1_0         → Update Alias Code
// POST /PinManagement_2_0           → Change PIN
// POST /ViewMFSAccountType_1_0      → View MFS Account Type
// POST /GetBalance_3_0              → Get Balance
//
// All responses are SOAP XML (Content-Type: text/xml).
// ─────────────────────────────────────────────
const router = require('express').Router();

// --------------------------------------------
// Wallet Account Registration
// --------------------------------------------
router.post('/UserRegistration_5_0', (req, res) => {
  console.log('Wallet Account Registration Request:', req.body);

  const soapResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:cor="http://soa.mic.co.af/coredata_1" xmlns:v1="http://xmlns.tigo.com/AddressType/V1" xmlns:v2="http://xmlns.tigo.com/ParameterType/V2" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3" xmlns:v5="http://xmlns.tigo.com/MFS/UserRegistrationRequest/V5">
      <cor:SOATransactionID>7b8faff6-16c2-4d14-9d7e-4768e8abe071</cor:SOATransactionID>
    </soapenv:Header>
    <soapenv:Body>
      <v51:UserRegistrationResponse xmlns:v51="http://xmlns.tigo.com/MFS/UserRegistrationResponse/V5">
        <v31:ResponseHeader xmlns:v31="http://xmlns.tigo.com/ResponseHeader/V3">
          <v31:GeneralResponse>
            <v31:correlationID>a8178dc98bf64ea4bce248b61e52e1bf</v31:correlationID>
            <v31:status>OK</v31:status>
            <v31:code>userregistration-3009-0000-S</v31:code>
            <v31:description>MFS Account Registered Successfully.</v31:description>
          </v31:GeneralResponse>
        </v31:ResponseHeader>
        <v51:responseBody>
          <v51:accountId>105631276</v51:accountId>
          <v51:msisdn>25577066095</v51:msisdn>
          <v51:firstName>SHAKIFU</v51:firstName>
          <v51:lastName>SHOP</v51:lastName>
          <v51:fullName>SHAKIFU SHOP</v51:fullName>
          <v51:birthDate>1942-07-01</v51:birthDate>
          <v51:primaryIDType>localgovtID</v51:primaryIDType>
          <v51:primaryIDNumber>19420701633010000618</v51:primaryIDNumber>
          <v1:AddressType xmlns:v1="http://xmlns.tigo.com/AddressType/V1">
            <v1:Street> TANDAHIMBA 63301</v1:Street>
            <v1:Neighborhood> TANDAHIMBA 63301</v1:Neighborhood>
            <v1:City>TANDAHIMBA</v1:City>
            <v1:State/>
            <v1:Country>TZA</v1:Country>
            <v1:ZIPCode>63301</v1:ZIPCode>
          </v1:AddressType>
          <v51:registrationLevel>HIGH</v51:registrationLevel>
          <v51:registartionFormNumber/>
          <v51:docsOnFile>0</v51:docsOnFile>
          <v51:SMSProperty>0</v51:SMSProperty>
          <v51:agentMSISDN>255717001234</v51:agentMSISDN>
          <v51:autosweepInLowerLimit>0</v51:autosweepInLowerLimit>
          <v51:autosweepInAmount>0</v51:autosweepInAmount>
          <v51:autosweepOutUpperLimit>0</v51:autosweepOutUpperLimit>
          <v51:autosweepOutAmount>0</v51:autosweepOutAmount>
          <v51:alertThresholdWalletTrans>0</v51:alertThresholdWalletTrans>
          <v51:mobileNotification>25577066095</v51:mobileNotification>
          <v51:complianceChecked>0</v51:complianceChecked>
        </v51:responseBody>
      </v51:UserRegistrationResponse>
    </soapenv:Body>
  </soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

// --------------------------------------------
// Change Group ID
// --------------------------------------------
router.post('/ChangeCustomerTigoPesaGroup_1_0', (req, res) => {
  console.log('Change Group ID Request:', req.body);

  const soapResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header>
      <cor:SOATransactionID xmlns:cor="http://soa.mic.co.af/coredata_1">afa5a844-347b-4758-9f12-71684f5b5ec9</cor:SOATransactionID>
    </soapenv:Header>
    <soapenv:Body>
      <v11:changeCustomerTigoPesaGroupResponse xmlns:v11="http://xmlns.tigo.com/ChangeCustomerTigoPesaGroupResponse/V1">
        <v31:ResponseHeader xmlns:v31="http://xmlns.tigo.com/ResponseHeader/V3">
          <v31:GeneralResponse>
            <v31:correlationID>adsf1asd2323</v31:correlationID>
            <v31:status>OK</v31:status>
            <v31:code>changecustomertigopesagroup-0000-S</v31:code>
            <v31:description>Group ID changed successfully</v31:description>
          </v31:GeneralResponse>
        </v31:ResponseHeader>
        <v11:responseBody>
          <v11:message>Group ID updated successfully</v11:message>
        </v11:responseBody>
      </v11:changeCustomerTigoPesaGroupResponse>
    </soapenv:Body>
  </soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

// --------------------------------------------
// Update Alias Code
// --------------------------------------------
router.post('/UpdateAliasCode_1_0', (req, res) => {
  console.log('Update Alias Code Request:', req.body);

  const soapResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header>
      <cor:SOATransactionID xmlns:cor="http://soa.mic.co.af/coredata_1">7e705916-4690-4ff3-aa70-9ab8361016a3</cor:SOATransactionID>
    </soapenv:Header>
    <soapenv:Body>
      <v1:UpdateAliasCodeResponse xmlns:v1="http://xmlns.tigo.com/UpdateAliasCodeResponse/V1">
        <v3:ResponseHeader xmlns:v3="http://xmlns.tigo.com/ResponseHeader/V3">
          <v3:GeneralResponse>
            <v3:correlationID>123</v3:correlationID>
            <v3:status>OK</v3:status>
            <v3:code>updatealiascode-1174-0000-S</v3:code>
            <v3:description>The request has been processed successfully</v3:description>
          </v3:GeneralResponse>
        </v3:ResponseHeader>
        <v1:responseBody>
          <v1:message>Alias code updated successfully</v1:message>
        </v1:responseBody>
      </v1:UpdateAliasCodeResponse>
    </soapenv:Body>
  </soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

// --------------------------------------------
// Change PIN
// --------------------------------------------
router.post('/PinManagement_2_0', (req, res) => {
  console.log('Change PIN Request:', req.body);

  const soapResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <cor:SOATransactionID xmlns:cor="http://soa.mic.co.af/coredata_1">4af9f03d-7530-4dd8-ba00-08fbbdf09006</cor:SOATransactionID>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <v1:ChangePinResponse xmlns:v1="http://xmlns.tigo.com/MFS/PinManagementResponse/V1">
      <v3:ResponseHeader xmlns:v3="http://xmlns.tigo.com/ResponseHeader/V3">
        <v3:GeneralResponse>
          <v3:correlationID>693166fa2ad5d</v3:correlationID>
          <v3:status>OK</v3:status>
          <v3:code>pinmanagement-2006-0001-S</v3:code>
          <v3:description>The PIN has been changed Successfully.</v3:description>
        </v3:GeneralResponse>
      </v3:ResponseHeader>
      <v1:responseBody>
        <v1:transactionId/>
      </v1:responseBody>
    </v1:ChangePinResponse>
  </SOAP-ENV:Body>
</soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

// --------------------------------------------
// View MFS Account Type
// --------------------------------------------
router.post('/ViewMFSAccountType_1_0', (req, res) => {
  console.log('View MFS Account Type Request:', req.body);

  const soapResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <ns3:SOATransactionID xmlns:ns3="http://soa.mic.co.af/coredata_1">039ffcde-ab96-4671-ac37-fe29d9839c7e</ns3:SOATransactionID>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <v1:ViewMFSAccountTypeResponse xmlns:v1="http://xmlns.tigo.com/MFS/ViewMFSAccountTypeResponse/V1">
      <v3:ResponseHeader xmlns:v3="http://xmlns.tigo.com/ResponseHeader/V3">
        <v3:GeneralResponse>
          <v3:correlationID>693145a252ec9</v3:correlationID>
          <v3:status>OK</v3:status>
          <v3:code>viewmfsaccounttype-3063-0000-S</v3:code>
          <v3:description>The request has been processed successfully.</v3:description>
        </v3:GeneralResponse>
      </v3:ResponseHeader>
      <v1:responseBody>
        <v1:msisdn>25577255874</v1:msisdn>
        <v1:accountID>115688433</v1:accountID>
        <v1:accountName>25577255874</v1:accountName>
        <v1:accountType>SUBSCRIBER</v1:accountType>
        <v1:accountLayer>7</v1:accountLayer>
        <v1:accountGroup>817</v1:accountGroup>
        <v1:accountStatus>ACTIVE</v1:accountStatus>
        <v1:terminalUser>25577255874:null</v1:terminalUser>
      </v1:responseBody>
    </v1:ViewMFSAccountTypeResponse>
  </SOAP-ENV:Body>
</soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

// --------------------------------------------
// Get Balance
// --------------------------------------------
router.post('/GetBalance_3_0', (req, res) => {
  console.log('Get Balance Request:', req.body);

  const soapResponse = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <cor:SOATransactionID xmlns:cor="http://soa.mic.co.af/coredata_1">813849e9-dd67-4b7a-b001-6b3e41e1501b</cor:SOATransactionID>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <ns2:GetBalanceResponse xmlns:ns2="http://xmlns.tigo.com/MFS/GetBalanceResponse/V3">
      <ns1:ResponseHeader xmlns:ns1="http://xmlns.tigo.com/ResponseHeader/V3">
        <ns1:GeneralResponse>
          <ns1:correlationID>693154be54482</ns1:correlationID>
          <ns1:status>OK</ns1:status>
          <ns1:code>getbalance-2001-0000-S</ns1:code>
          <ns1:description>The balance information is retrieved successfully.</ns1:description>
        </ns1:GeneralResponse>
      </ns1:ResponseHeader>
      <ns2:responseBody>
        <ns2:walletCollection>
          <ns2:wallet>
            <ns2:walletName>MFS Balance.</ns2:walletName>
            <ns2:walletBalance>492102.00</ns2:walletBalance>
          </ns2:wallet>
        </ns2:walletCollection>
      </ns2:responseBody>
    </ns2:GetBalanceResponse>
  </SOAP-ENV:Body>
</soapenv:Envelope>`;

  res.set('Content-Type', 'text/xml');
  res.send(soapResponse);
});

module.exports = router;
