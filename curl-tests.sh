#!/bin/bash

# Mock Server cURL Test Commands
# Make sure the server is running on http://localhost:3011

echo "=========================================="
echo "Testing Mock Server Endpoints"
echo "=========================================="
echo ""

# 1. Health Check
echo "1. Health Check"
echo "----------------------------------------"
curl -X GET http://localhost:3011/health
echo -e "\n\n"

# 2. Get Merchant KYC (JSON)
echo "2. Get Merchant KYC (JSON)"
echo "----------------------------------------"
curl -X POST http://localhost:3011/api/merchant/kyc \
  -H "Content-Type: application/json" \
  -d '{
    "customerMsisdn": "658283033",
    "isSimSwapRequest": false
  }'
echo -e "\n\n"

# 3. Wallet Account Registration (SOAP)
echo "3. Wallet Account Registration (SOAP)"
echo "----------------------------------------"
curl -X POST http://localhost:3011/osb/services/UserRegistration_5_0 \
  -H "Content-Type: text/xml" \
  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v5="http://xmlns.tigo.com/MFS/UserRegistrationRequest/V5" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3" xmlns:v1="http://xmlns.tigo.com/AddressType/V1" xmlns:v2="http://xmlns.tigo.com/ParameterType/V2" xmlns:cor="http://soa.mic.co.af/coredata_1">
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
          <v1:Neighborhood>MATEVES 23221</v1:Neighborhood>
          <v1:City>MATEVES</v1:City>
          <v1:Country>TANZANIAN</v1:Country>
          <v1:ZIPCode>23221</v1:ZIPCode>
        </v1:AddressType>
        <v5:birthDate>1992-01-23</v5:birthDate>
        <v5:agentWallet>
          <v5:msisdn>255673700027</v5:msisdn>
        </v5:agentWallet>
        <v5:notificationNumber>25577064958</v5:notificationNumber>
      </v5:requestBody>
    </v5:UserRegistrationRequest>
  </soapenv:Body>
</soapenv:Envelope>'
echo -e "\n\n"

# 4. Change Group ID (SOAP)
echo "4. Change Group ID (SOAP)"
echo "----------------------------------------"
curl -X POST http://localhost:3011/osb/services/ChangeCustomerTigoPesaGroup_1_0 \
  -H "Content-Type: text/xml" \
  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://xmlns.tigo.com/ChangeCustomerTigoPesaGroupRequest/V1" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3" xmlns:v2="http://xmlns.tigo.com/ParameterType/V2">
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
echo -e "\n\n"

# 5. Update Alias Code (SOAP)
echo "5. Update Alias Code (SOAP)"
echo "----------------------------------------"
curl -X POST http://localhost:3011/osb/services/UpdateAliasCode_1_0 \
  -H "Content-Type: text/xml" \
  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cor="http://soa.mic.co.af/coredata_1" xmlns:v1="http://xmlns.tigo.com/UpdateAliasCodeRequest/V1" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3" xmlns:v2="http://xmlns.tigo.com/ParameterType/V2">
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
echo -e "\n\n"

# 6. CVM Trigger (XML)
echo "6. CVM Trigger (XML)"
echo "----------------------------------------"
curl -X POST http://localhost:3011/sim-card-registration \
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
echo -e "\n\n"

# 7. Tigo Payment Gateway - Bill Query (XML)
echo "7. Tigo Payment Gateway - Bill Query (XML)"
echo "----------------------------------------"
curl -X POST "http://localhost:3011/TigoPaymentGateway_1_2?p=2022" \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<MTPGBillQueryRequest>
  <ConsumerID>mfs_app_new</ConsumerID>
  <ReferenceID>1692406111692225</ReferenceID>
  <SourceMSISDN>255652264090</SourceMSISDN>
  <SourcePIN></SourcePIN>
  <TerminalType>USD</TerminalType>
  <TargetRefNumber>24213028962</TargetRefNumber>
  <Amount>1000</Amount>
  <ShortCode>50111</ShortCode>
</MTPGBillQueryRequest>'
echo -e "\n\n"

# 8. Tigo Payment Gateway - Send Money GePG (XML) p=1945
echo "8. Tigo Payment Gateway - Send Money GePG (XML) p=1945"
echo "----------------------------------------"
curl -X POST "http://localhost:3011/TigoPaymentGateway_1_2?p=1945" \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<SendMoneyRequest>
  <ConsumerID>mfs_app_new</ConsumerID>
  <ReferenceID>1692406111692225</ReferenceID>
  <SourceMSISDN>255652264090</SourceMSISDN>
  <SourcePIN></SourcePIN>
  <TerminalType>USD</TerminalType>
  <TargetRefNumber>991040593832</TargetRefNumber>
  <Amount>500</Amount>
  <ShortCode>50111</ShortCode>
</SendMoneyRequest>'
echo -e "\n\n"

# 9. Tigo Payment Gateway - Calculate Fee Merchant (XML) p=1944
echo "9. Tigo Payment Gateway - Calculate Fee Merchant (XML) p=1944"
echo "----------------------------------------"
curl -X POST "http://localhost:3011/TigoPaymentGateway_1_2?p=1944" \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<CalculateFeeRequest>
  <ConsumerID>mfs_app_new</ConsumerID>
  <ReferenceID>1692406111692225</ReferenceID>
  <SourceMSISDN>255652264090</SourceMSISDN>
  <SourcePIN></SourcePIN>
  <TerminalType>USD</TerminalType>
  <TargetRefNumber>255711404306</TargetRefNumber>
  <Amount>264500</Amount>
  <ShortCode>50111</ShortCode>
</CalculateFeeRequest>'
echo -e "\n\n"

# 10. Super App Transaction Inquiry to Tigo TQS (XML)
echo "10. Super App Transaction Inquiry to Tigo TQS (XML)"
echo "----------------------------------------"
curl -k -X POST "http://localhost:3011/SuperAppTransInquiry2TigoTQS" \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<COMMAND>
  <TYPE>MTPGGetSODetails</TYPE>
  <REFERENCEID>SUBQ0000000233</REFERENCEID>
  <MSISDN>25565888222</MSISDN>
  <EXTERNALREFID>SUBQ0000000233</EXTERNALREFID>
</COMMAND>'
echo -e "\n\n"

# 11. MMP View MFS Account Type (SOAP)
echo "11. MMP View MFS Account Type (SOAP)"
echo "----------------------------------------"
curl -X POST http://localhost:3011/MMPViewMFSAccountType \
  -H "Content-Type: text/xml" \
  -d '<SOAP-ENV:Envelope
  xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns1="http://xmlns.tigo.com/RequestHeader/V3"
  xmlns:ns2="http://xmlns.tigo.com/MFS/ViewMFSAccountTypeRequest/V1"
  xmlns:ns3="http://soa.mic.co.af/coredata_1"
  xmlns:ns4="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
  <SOAP-ENV:Header>
    <cor:debugFlag
      xmlns:cor="http://soa.mic.co.af/coredata_1">true
    </cor:debugFlag>
    <wsse:Security
      xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
      <wsse:UsernameToken>
        <wsse:Username>test_mw_osb</wsse:Username>
        <wsse:Password>tigo1234</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <ns2:ViewMFSAccountTypeRequest>
      <ns1:RequestHeader>
        <ns1:GeneralConsumerInformation>
          <ns1:consumerID>TIGO</ns1:consumerID>
          <ns1:transactionID>1850565481279171</ns1:transactionID>
          <ns1:country>TZA</ns1:country>
          <ns1:correlationID>abc123</ns1:correlationID>
        </ns1:GeneralConsumerInformation>
      </ns1:RequestHeader>
      <ns2:requestBody>
        <ns2:msisdn>25571123131</ns2:msisdn>
        <ns2:channelUser>mixx.merchant</ns2:channelUser>
        <ns2:channelPassword>GoMixx@2026</ns2:channelPassword>
        <ns2:terminalType>API</ns2:terminalType>
        <ns2:userStatus>ACTIVE</ns2:userStatus>
      </ns2:requestBody>
    </ns2:ViewMFSAccountTypeRequest>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>'
echo -e "\n\n"

# 12. Send SMS Handler (JSON)
echo "12. Send SMS Handler (JSON)"
echo "----------------------------------------"
curl -X POST http://localhost:3011/SendSMSHandler \
  -H "Content-Type: application/json" \
  -d '{
    "RequestId": "1736755484-538536049",
    "Source": "INFO",
    "Destination": "25571123131",
    "Text": "Hongera! Umepokea point 20.0 kwa Kwa Kulipa kwa Simu kwenda Mitandao Mingine. Salio lako jipya la point ni 500.0. Fanya miamala zaidi ya Tigo Pesa upate Points nyingi zaidi"
  }'
echo -e "\n\n"

echo "=========================================="
echo "All tests completed!"
echo "=========================================="
