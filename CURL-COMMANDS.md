# cURL Test Commands

Copy and paste these commands to test each endpoint:

---

## 1. Health Check
```bash
curl -X GET http://localhost:3000/health
```

---

## 2. Get Merchant KYC (JSON)
```bash
curl -X POST http://localhost:3000/api/merchant/kyc \
  -H "Content-Type: application/json" \
  -d "{\"customerMsisdn\":\"658283033\",\"isSimSwapRequest\":false}"
```

**Windows PowerShell:**
```powershell
curl -X POST http://localhost:3000/api/merchant/kyc `
  -H "Content-Type: application/json" `
  -d '{\"customerMsisdn\":\"658283033\",\"isSimSwapRequest\":false}'
```

**Alternative (JSON file):**
```bash
curl -X POST http://localhost:3000/api/merchant/kyc \
  -H "Content-Type: application/json" \
  -d @merchant-kyc-request.json
```

---

## 3. Wallet Account Registration (SOAP)
```bash
curl -X POST http://localhost:3000/osb/services/UserRegistration_5_0 \
  -H "Content-Type: text/xml" \
  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v5="http://xmlns.tigo.com/MFS/UserRegistrationRequest/V5" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3" xmlns:v1="http://xmlns.tigo.com/AddressType/V1">
  <soapenv:Header>
    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
      <wsse:UsernameToken>
        <wsse:Username>testuser</wsse:Username>
        <wsse:Password>testpass</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </soapenv:Header>
  <soapenv:Body>
    <v5:UserRegistrationRequest>
      <v3:RequestHeader>
        <v3:GeneralConsumerInformation>
          <v3:consumerID>TEST001</v3:consumerID>
          <v3:country>TZA</v3:country>
          <v3:correlationID>18005911954d40538d72660901c06010</v3:correlationID>
        </v3:GeneralConsumerInformation>
      </v3:RequestHeader>
      <v5:requestBody>
        <v5:userWallet>
          <v5:msisdn>25577064958</v5:msisdn>
        </v5:userWallet>
        <v5:KYCLevel>HIGH</v5:KYCLevel>
        <v5:shortCode>59019</v5:shortCode>
        <v5:primaryIDType>localgovtID</v5:primaryIDType>
        <v5:primaryIDNumber>19920123232210000124</v5:primaryIDNumber>
        <v5:firstName>FINEST</v5:firstName>
        <v5:lastName>KIND DAIRY</v5:lastName>
        <v1:AddressType>
          <v1:Street>MATEVES 23221</v1:Street>
          <v1:City>MATEVES</v1:City>
          <v1:Country>TANZANIAN</v1:Country>
          <v1:ZIPCode>23221</v1:ZIPCode>
        </v1:AddressType>
        <v5:birthDate>1992-01-23</v5:birthDate>
      </v5:requestBody>
    </v5:UserRegistrationRequest>
  </soapenv:Body>
</soapenv:Envelope>'
```

---

## 4. Change Group ID (SOAP)
```bash
curl -X POST http://localhost:3000/osb/services/ChangeCustomerTigoPesaGroup_1_0 \
  -H "Content-Type: text/xml" \
  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://xmlns.tigo.com/ChangeCustomerTigoPesaGroupRequest/V1" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3">
  <soapenv:Header>
    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
      <wsse:UsernameToken>
        <wsse:Username>testuser</wsse:Username>
        <wsse:Password>testpass</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </soapenv:Header>
  <soapenv:Body>
    <v1:changeCustomerTigoPesaGroupRequest>
      <v3:RequestHeader>
        <v3:GeneralConsumerInformation>
          <v3:consumerID>TEST001</v3:consumerID>
          <v3:transactionID>458561212132</v3:transactionID>
          <v3:country>TZA</v3:country>
          <v3:correlationID>adsf1asd2323</v3:correlationID>
        </v3:GeneralConsumerInformation>
      </v3:RequestHeader>
      <v1:requestBody>
        <v1:channelUsername>testuser</v1:channelUsername>
        <v1:terminalType>API</v1:terminalType>
        <v1:password>testpass</v1:password>
        <v1:userWallet>
          <v1:msisdn>255675909212</v1:msisdn>
        </v1:userWallet>
        <v1:changeGroupID>902</v1:changeGroupID>
      </v1:requestBody>
    </v1:changeCustomerTigoPesaGroupRequest>
  </soapenv:Body>
</soapenv:Envelope>'
```

---

## 5. Update Alias Code (SOAP)
```bash
curl -X POST http://localhost:3000/osb/services/UpdateAliasCode_1_0 \
  -H "Content-Type: text/xml" \
  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cor="http://soa.mic.co.af/coredata_1" xmlns:v1="http://xmlns.tigo.com/UpdateAliasCodeRequest/V1" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3">
  <soapenv:Header xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
    <cor:debugFlag>true</cor:debugFlag>
    <wsse:Security>
      <wsse:UsernameToken>
        <wsse:Username>testuser</wsse:Username>
        <wsse:Password>testpass</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </soapenv:Header>
  <soapenv:Body>
    <v1:UpdateAliasCodeRequest>
      <v3:RequestHeader>
        <v3:GeneralConsumerInformation>
          <v3:consumerID>TEST001</v3:consumerID>
          <v3:country>TZA</v3:country>
          <v3:correlationID>123</v3:correlationID>
        </v3:GeneralConsumerInformation>
      </v3:RequestHeader>
      <v1:requestBody>
        <v1:channelUsername>testuser</v1:channelUsername>
        <v1:password>testpass</v1:password>
        <v1:terminalType>API</v1:terminalType>
        <v1:accountId>105594683</v1:accountId>
        <v1:aliasCode>43234604</v1:aliasCode>
      </v1:requestBody>
    </v1:UpdateAliasCodeRequest>
  </soapenv:Body>
</soapenv:Envelope>'
```

---

## 6. CVM Trigger (XML)
```bash
curl -X POST http://localhost:3000/sim-card-registration \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<request>
  <transactionId>18005911954d40538d72660901c06010</transactionId>
  <timestamp>17-10-2024 11:26:21</timestamp>
  <keyword>Merchant_Onboarding</keyword>
  <EntityInfo>
    <entityAccountNumber>0250143234604</entityAccountNumber>
    <entityMsisdn>77064958</entityMsisdn>
    <entityName>FINEST KIND DAIRY</entityName>
    <ContactDetails>
      <ContactDetail>
        <EntityContactMobileNo>675909212</EntityContactMobileNo>
        <EntityContactType>Main Notification</EntityContactType>
        <EntityContactLanguage>Swahili</EntityContactLanguage>
      </ContactDetail>
    </ContactDetails>
  </EntityInfo>
</request>'
```

---

## PowerShell Commands (Windows)

For **PowerShell**, use backtick `` ` `` for line continuation and escape quotes properly:

### Example: Get Merchant KYC
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/kyc" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"customerMsisdn":"658283033","isSimSwapRequest":false}'
```

### Example: CVM Trigger
```powershell
$body = @"
<?xml version="1.0" encoding="UTF-8"?>
<request>
  <transactionId>18005911954d40538d72660901c06010</transactionId>
  <timestamp>17-10-2024 11:26:21</timestamp>
  <keyword>Merchant_Onboarding</keyword>
</request>
"@

Invoke-RestMethod -Uri "http://localhost:3000/sim-card-registration" `
  -Method POST `
  -ContentType "application/xml" `
  -Body $body
```

---

## Quick Test - Run All at Once

**Linux/Mac:**
```bash
bash curl-tests.sh
```

**Windows:**
```powershell
# Run commands one by one from CURL-COMMANDS.md
```

---

## Tips

1. **Pretty Print JSON Response:** Add `| jq` at the end
   ```bash
   curl http://localhost:3000/health | jq
   ```

2. **Save Response to File:**
   ```bash
   curl http://localhost:3000/health > response.json
   ```

3. **View Response Headers:**
   ```bash
   curl -i http://localhost:3000/health
   ```

4. **Verbose Output (Debug):**
   ```bash
   curl -v http://localhost:3000/health
   ```
