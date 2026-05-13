// ═══════════════════════════════════════════════════════════════
//  Mock Server — Entry Point
//
//  How it works
//  ─────────────
//  • PORT and BASE_URL constants live in config.js.
//    Change them there; nothing else needs editing.
//
//  • Each logical group of endpoints lives in its own file
//    under routes/. server.js just mounts them.
//
//  • Base URL is set via app.use(BASE_URLS.X, router):
//      /osb/services  → routes/osb.js
//      /              → everything else (auth, merchant, mmp,
//                        payment, misc)
//
//  How to add a new API
//  ─────────────────────
//  1. Pick (or create) the right routes/*.js file.
//  2. Add:  router.post('/YourPath', (req, res) => { ... })
//  3. Set Content-Type ('text/xml', 'application/xml', or JSON).
//  4. Add the path to the health check endpoint list below.
//  5. Restart the server.  That's it.
// ═══════════════════════════════════════════════════════════════

const express    = require('express');
const bodyParser = require('body-parser');
const { PORT, BASE_URLS } = require('./config');

const app = express();

// ─── cURL Examples (injected into the homepage) ─────────────────
const curlExamples = {
  /* ── AUTH ──────────────────────────────────────────────────── */
  'oauth2-token':
    `curl -s -X POST http://localhost:${PORT}/oauth2/token \\\n` +
    `  -H 'Content-Type: application/x-www-form-urlencoded' \\\n` +
    `  -d 'grant_type=client_credentials'`,

  /* ── MERCHANT ─────────────────────────────────────────────── */
  'merchant-kyc':
    `curl -s -X POST http://localhost:${PORT}/api/merchant/kyc \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"customerMsisdn":"658283033","isSimSwapRequest":false}'`,

  'merchant-status':
    `curl -s -X POST http://localhost:${PORT}/tigoagentapp_pesaliveNew/api/merchant/CheckMerchantStatus \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"658283033"}'`,

  /* ── OSB / SOAP ───────────────────────────────────────────── */
  'osb-user-registration':
    `curl -s -X POST http://localhost:${PORT}/osb/services/UserRegistration_5_0 \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v5="http://xmlns.tigo.com/MFS/UserRegistrationRequest/V5" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3" xmlns:v1="http://xmlns.tigo.com/AddressType/V1"><soapenv:Header><wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"><wsse:UsernameToken><wsse:Username>testuser</wsse:Username><wsse:Password>testpass</wsse:Password></wsse:UsernameToken></wsse:Security></soapenv:Header><soapenv:Body><v5:UserRegistrationRequest><v3:RequestHeader><v3:GeneralConsumerInformation><v3:consumerID>TEST001</v3:consumerID><v3:country>TZA</v3:country><v3:correlationID>18005911954d40538d72660901c06010</v3:correlationID></v3:GeneralConsumerInformation></v3:RequestHeader><v5:requestBody><v5:userWallet><v5:msisdn>25577064958</v5:msisdn></v5:userWallet><v5:KYCLevel>HIGH</v5:KYCLevel><v5:shortCode>59019</v5:shortCode><v5:primaryIDType>localgovtID</v5:primaryIDType><v5:primaryIDNumber>19920123232210000124</v5:primaryIDNumber><v5:firstName>FINEST</v5:firstName><v5:lastName>KIND DAIRY</v5:lastName><v1:AddressType><v1:Street>MATEVES 23221</v1:Street><v1:City>MATEVES</v1:City><v1:Country>TANZANIAN</v1:Country><v1:ZIPCode>23221</v1:ZIPCode></v1:AddressType><v5:birthDate>1992-01-23</v5:birthDate></v5:requestBody></v5:UserRegistrationRequest></soapenv:Body></soapenv:Envelope>'`,

  'osb-change-group':
    `curl -s -X POST http://localhost:${PORT}/osb/services/ChangeCustomerTigoPesaGroup_1_0 \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://xmlns.tigo.com/ChangeCustomerTigoPesaGroupRequest/V1" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3"><soapenv:Header><wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"><wsse:UsernameToken><wsse:Username>testuser</wsse:Username><wsse:Password>testpass</wsse:Password></wsse:UsernameToken></wsse:Security></soapenv:Header><soapenv:Body><v1:changeCustomerTigoPesaGroupRequest><v3:RequestHeader><v3:GeneralConsumerInformation><v3:consumerID>TEST001</v3:consumerID><v3:transactionID>458561212132</v3:transactionID><v3:country>TZA</v3:country><v3:correlationID>adsf1asd2323</v3:correlationID></v3:GeneralConsumerInformation></v3:RequestHeader><v1:requestBody><v1:channelUsername>testuser</v1:channelUsername><v1:terminalType>API</v1:terminalType><v1:password>testpass</v1:password><v1:userWallet><v1:msisdn>255675909212</v1:msisdn></v1:userWallet><v1:changeGroupID>902</v1:changeGroupID></v1:requestBody></v1:changeCustomerTigoPesaGroupRequest></soapenv:Body></soapenv:Envelope>'`,

  'osb-update-alias':
    `curl -s -X POST http://localhost:${PORT}/osb/services/UpdateAliasCode_1_0 \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://xmlns.tigo.com/UpdateAliasCodeRequest/V1" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3"><soapenv:Header><wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"><wsse:UsernameToken><wsse:Username>testuser</wsse:Username><wsse:Password>testpass</wsse:Password></wsse:UsernameToken></wsse:Security></soapenv:Header><soapenv:Body><v1:UpdateAliasCodeRequest><v3:RequestHeader><v3:GeneralConsumerInformation><v3:consumerID>TEST001</v3:consumerID><v3:country>TZA</v3:country><v3:correlationID>123</v3:correlationID></v3:GeneralConsumerInformation></v3:RequestHeader><v1:requestBody><v1:channelUsername>testuser</v1:channelUsername><v1:password>testpass</v1:password><v1:terminalType>API</v1:terminalType><v1:accountId>105594683</v1:accountId><v1:aliasCode>43234604</v1:aliasCode></v1:requestBody></v1:UpdateAliasCodeRequest></soapenv:Body></soapenv:Envelope>'`,

  'osb-change-pin':
    `curl -s -X POST http://localhost:${PORT}/osb/services/PinManagement_2_0 \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v2="http://xmlns.tigo.com/PINManagement/V2" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3"><soapenv:Header><wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"><wsse:UsernameToken><wsse:Username>testuser</wsse:Username><wsse:Password>testpass</wsse:Password></wsse:UsernameToken></wsse:Security></soapenv:Header><soapenv:Body><v2:PinManagementRequest><v3:RequestHeader><v3:GeneralConsumerInformation><v3:consumerID>TEST001</v3:consumerID><v3:country>TZA</v3:country><v3:correlationID>abc123</v3:correlationID></v3:GeneralConsumerInformation></v3:RequestHeader><v2:requestBody><v2:msisdn>255671234567</v2:msisdn><v2:oldPIN>1234</v2:oldPIN><v2:newPIN>5678</v2:newPIN></v2:requestBody></v2:PinManagementRequest></soapenv:Body></soapenv:Envelope>'`,

  'osb-view-mfs-account-type':
    `curl -s -X POST http://localhost:${PORT}/osb/services/ViewMFSAccountType_1_0 \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://xmlns.tigo.com/MFS/ViewMFSAccountTypeRequest/V1" xmlns:v3="http://xmlns.tigo.com/RequestHeader/V3"><soapenv:Header><wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"><wsse:UsernameToken><wsse:Username>testuser</wsse:Username><wsse:Password>testpass</wsse:Password></wsse:UsernameToken></wsse:Security></soapenv:Header><soapenv:Body><v1:ViewMFSAccountTypeRequest><v3:RequestHeader><v3:GeneralConsumerInformation><v3:consumerID>TEST001</v3:consumerID><v3:country>TZA</v3:country><v3:correlationID>abc123</v3:correlationID></v3:GeneralConsumerInformation></v3:RequestHeader><v1:requestBody><v1:msisdn>25571123131</v1:msisdn></v1:requestBody></v1:ViewMFSAccountTypeRequest></soapenv:Body></soapenv:Envelope>'`,

  'osb-get-balance':
    `curl -s -X POST http://localhost:${PORT}/osb/services/GetBalance_3_0 \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v3="http://xmlns.tigo.com/GetBalance/V3" xmlns:rh="http://xmlns.tigo.com/RequestHeader/V3"><soapenv:Header><wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"><wsse:UsernameToken><wsse:Username>testuser</wsse:Username><wsse:Password>testpass</wsse:Password></wsse:UsernameToken></wsse:Security></soapenv:Header><soapenv:Body><v3:GetBalanceRequest><rh:RequestHeader><rh:GeneralConsumerInformation><rh:consumerID>TEST001</rh:consumerID><rh:country>TZA</rh:country><rh:correlationID>abc123</rh:correlationID></rh:GeneralConsumerInformation></rh:RequestHeader><v3:requestBody><v3:msisdn>25571123131</v3:msisdn></v3:requestBody></v3:GetBalanceRequest></soapenv:Body></soapenv:Envelope>'`,

  /* ── MMP / SOAP ───────────────────────────────────────────── */
  'mmp-view-mfs-account-type':
    `curl -s -X POST http://localhost:${PORT}/MMPViewMFSAccountType \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><ViewMFSAccountTypeRequest><msisdn>25571123131</msisdn><channelUsername>testuser</channelUsername><password>testpass</password></ViewMFSAccountTypeRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-create-handler':
    `curl -s -X POST http://localhost:${PORT}/MMPCreateHandler \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><CreateHandlerRequest><msisdn>25571123131</msisdn><channelUsername>testuser</channelUsername><password>testpass</password><handlerType>SUBSCRIBER</handlerType></CreateHandlerRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-pin-validation':
    `curl -s -X POST http://localhost:${PORT}/MMPPinValidation \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><PinValidationRequest><msisdn>25571123131</msisdn><pin>1234</pin><channelUsername>testuser</channelUsername><password>testpass</password></PinValidationRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-get-balance-proxy':
    `curl -s -X POST http://localhost:${PORT}/MMPGetMFSBalanceProxy \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><GetMFSBalanceProxyRequest><msisdn>25571123131</msisdn><channelUsername>testuser</channelUsername><password>testpass</password></GetMFSBalanceProxyRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-get-user-status':
    `curl -s -X POST http://localhost:${PORT}/MMPGetMFSUserStatus \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><GetMFSUserStatusRequest><msisdn>25571123131</msisdn><channelUsername>testuser</channelUsername><password>testpass</password></GetMFSUserStatusRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-change-pin':
    `curl -s -X POST http://localhost:${PORT}/MMPChangePIN \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><ChangePINRequest><msisdn>25571123131</msisdn><oldPin>1234</oldPin><newPin>5678</newPin><channelUsername>testuser</channelUsername><password>testpass</password></ChangePINRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-disable-terminal-user':
    `curl -s -X POST http://localhost:${PORT}/MMPDisableTerminalUser \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><DisableTerminalUserRequest><msisdn>25571123131</msisdn><channelUsername>testuser</channelUsername><password>testpass</password></DisableTerminalUserRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-bill-query':
    `curl -s -X POST http://localhost:${PORT}/MMPBillQuery \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><BillQueryRequest><msisdn>25571123131</msisdn><billNumber>123456789</billNumber><channelUsername>testuser</channelUsername><password>testpass</password></BillQueryRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-bill-payment':
    `curl -s -X POST http://localhost:${PORT}/MMPBillPayment \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><BillPaymentRequest><msisdn>25571123131</msisdn><billNumber>123456789</billNumber><amount>5000</amount><pin>1234</pin><channelUsername>testuser</channelUsername><password>testpass</password></BillPaymentRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-cash-out-payment':
    `curl -s -X POST http://localhost:${PORT}/MMPCashOutPayment \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><CashOutPaymentRequest><senderMsisdn>25571123131</senderMsisdn><receiverMsisdn>255672345678</receiverMsisdn><amount>10000</amount><pin>1234</pin><channelUsername>testuser</channelUsername><password>testpass</password></CashOutPaymentRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-send-money-payment':
    `curl -s -X POST http://localhost:${PORT}/MMPSendMoneyPayment \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><SendMoneyPaymentRequest><senderMsisdn>25571123131</senderMsisdn><receiverMsisdn>255672345678</receiverMsisdn><amount>5000</amount><pin>1234</pin><channelUsername>testuser</channelUsername><password>testpass</password></SendMoneyPaymentRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-proxy-transfer':
    `curl -s -X POST http://localhost:${PORT}/MMPProxyTransfer \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><ProxyTransferRequest><senderMsisdn>25571123131</senderMsisdn><receiverMsisdn>255672345678</receiverMsisdn><amount>5000</amount><pin>1234</pin><channelUsername>testuser</channelUsername><password>testpass</password></ProxyTransferRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-calculate-fee-namecheck':
    `curl -s -X POST http://localhost:${PORT}/MMPCalculateFeeNamecheck \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><CalculateFeeNamecheckRequest><senderMsisdn>25571123131</senderMsisdn><receiverMsisdn>255672345678</receiverMsisdn><amount>5000</amount><channelUsername>testuser</channelUsername><password>testpass</password></CalculateFeeNamecheckRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-send-money-m2m':
    `curl -s -X POST http://localhost:${PORT}/MMPSendMoneyM2M \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><SendMoneyM2MRequest><senderMsisdn>25571123131</senderMsisdn><receiverMsisdn>255672345678</receiverMsisdn><amount>5000</amount><channelUsername>testuser</channelUsername><password>testpass</password></SendMoneyM2MRequest></soapenv:Body></soapenv:Envelope>'`,

  'mpp-cash-out-fee':
    `curl -s -X POST http://localhost:${PORT}/MPPCashOutFee \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><CashOutFeeRequest><msisdn>25571123131</msisdn><amount>10000</amount><channelUsername>testuser</channelUsername><password>testpass</password></CashOutFeeRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-payment-qr':
    `curl -s -X POST http://localhost:${PORT}/PaymentQRAndTillCodeMmpTelepin \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><PaymentQRRequest><msisdn>25571123131</msisdn><amount>5000</amount><channelUsername>testuser</channelUsername><password>testpass</password></PaymentQRRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-request-to-pay':
    `curl -s -X POST http://localhost:${PORT}/RequestToPayPaymentMmpTelepinCopy \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><RequestToPayRequest><msisdn>25571123131</msisdn><amount>5000</amount><tillCode>12345</tillCode><pin>1234</pin><channelUsername>testuser</channelUsername><password>testpass</password></RequestToPayRequest></soapenv:Body></soapenv:Envelope>'`,

  'mmp-checkfee':
    `curl -s -X POST http://localhost:${PORT}/Request-topay-checkfee \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><CheckFeeRequest><msisdn>25571123131</msisdn><amount>5000</amount><channelUsername>testuser</channelUsername><password>testpass</password></CheckFeeRequest></soapenv:Body></soapenv:Envelope>'`,

  /* ── PAYMENT GATEWAY ──────────────────────────────────────── */
  'gw-betpawa':
    `curl -s -X POST 'http://localhost:${PORT}/TigoPaymentGateway_1_2?p=7005' \\\n` +
    `  -H 'Content-Type: application/xml' \\\n` +
    `  -d '<COMMAND><TYPE>BETPAWA_PAY</TYPE><MSISDN>255671234567</MSISDN><AMOUNT>5000</AMOUNT><PIN>1234</PIN><REFNO>REF123456</REFNO></COMMAND>'`,

  'gw-calculate-fee':
    `curl -s -X POST 'http://localhost:${PORT}/TigoPaymentGateway_1_2?p=2136' \\\n` +
    `  -H 'Content-Type: application/xml' \\\n` +
    `  -d '<COMMAND><TYPE>CALC_FEE</TYPE><MSISDN>255671234567</MSISDN><AMOUNT>5000</AMOUNT></COMMAND>'`,

  'gw-send-money-gepg':
    `curl -s -X POST 'http://localhost:${PORT}/TigoPaymentGateway_1_2?p=1945' \\\n` +
    `  -H 'Content-Type: application/xml' \\\n` +
    `  -d '<COMMAND><TYPE>SENDMONEY_GEPG</TYPE><MSISDN>255671234567</MSISDN><AMOUNT>5000</AMOUNT><PIN>1234</PIN><RECEIVERMSISDN>255672345678</RECEIVERMSISDN></COMMAND>'`,

  'gw-calculate-fee-merchant':
    `curl -s -X POST 'http://localhost:${PORT}/TigoPaymentGateway_1_2?p=1944' \\\n` +
    `  -H 'Content-Type: application/xml' \\\n` +
    `  -d '<COMMAND><TYPE>CALC_FEE_MERCHANT</TYPE><MSISDN>255671234567</MSISDN><AMOUNT>5000</AMOUNT></COMMAND>'`,

  'gw-bill-query':
    `curl -s -X POST 'http://localhost:${PORT}/TigoPaymentGateway_1_2?p=2022' \\\n` +
    `  -H 'Content-Type: application/xml' \\\n` +
    `  -d '<COMMAND><TYPE>BILL_QUERY</TYPE><MSISDN>255671234567</MSISDN><BILL_NUMBER>123456789</BILL_NUMBER></COMMAND>'`,

  'superapp-trans-inquiry':
    `curl -s -X POST http://localhost:${PORT}/SuperAppTransInquiry2TigoTQS \\\n` +
    `  -H 'Content-Type: application/xml' \\\n` +
    `  -d '<INQUIRY><REFNO>REF123456</REFNO><MSISDN>255671234567</MSISDN></INQUIRY>'`,

  'biller-payment':
    `curl -s -X POST http://localhost:${PORT}/USSDrouterPushBillpaySupperApp \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -H 'X-API-KEY: test-api-key' \\\n` +
    `  -d '{"msisdn":"255671234567","billNumber":"123456789","amount":5000,"referenceId":"REF-001"}'`,

  'biller-callback':
    `curl -s -X POST http://localhost:${PORT}/1.0/tz/test/merchant/api/RequestToPay/BillerCallback \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"transactionId":"TX123456","status":"SUCCESS","amount":5000,"msisdn":"255671234567"}'`,

  /* ── MISC ─────────────────────────────────────────────────── */
  'misc-cvm':
    `curl -s -X POST http://localhost:${PORT}/sim-card-registration \\\n` +
    `  -H 'Content-Type: application/xml' \\\n` +
    `  -d '<?xml version="1.0" encoding="UTF-8"?><request><transactionId>18005911954d40538d72660901c06010</transactionId><timestamp>17-10-2024 11:26:21</timestamp><keyword>Merchant_Onboarding</keyword><EntityInfo><entityAccountNumber>0250143234604</entityAccountNumber><entityMsisdn>77064958</entityMsisdn><entityName>FINEST KIND DAIRY</entityName></EntityInfo></request>'`,

  'misc-sms':
    `curl -s -X POST http://localhost:${PORT}/SendSMSHandler \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"255671234567","message":"Test SMS","RequestId":"SMS-001"}'`,

  'misc-notification':
    `curl -s -X POST http://localhost:${PORT}/live/sendnotificationapigee \\\n` +
    `  -H 'Content-Type: text/xml' \\\n` +
    `  -d '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><SendNotificationRequest><msisdn>255671234567</msisdn><message>Test notification</message></SendNotificationRequest></soapenv:Body></soapenv:Envelope>'`,

  /* ── TOGOCOM — ACCOUNTS ───────────────────────────────────── */
  'togo-check-merchant-account':
    `curl -s -X GET http://localhost:${PORT}/accounts/v2/msisdn/22890898190/status-v5 \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json'`,

  'togo-merchant-login':
    `curl -s -X POST http://localhost:${PORT}/accounts/v2/msisdn/22890898190/identity \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"pin":"1234","channelId":"mobile"}'`,

  'togo-balance':
    `curl -s -X GET http://localhost:${PORT}/accounts/v2/msisdn/22890898190/balance \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json'`,

  'togo-tx-history':
    `curl -s -X GET http://localhost:${PORT}/accounts/v2/msisdn/22890898190/statemententries \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json'`,

  'togo-change-pin':
    `curl -s -X PATCH http://localhost:${PORT}/accounts/v2/pin \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","oldPin":"1234","newPin":"5678"}'`,

  'togo-kyc-upgrade':
    `curl -s -X POST http://localhost:${PORT}/accounts/v2/upgrade-kyc/22890898190 \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"kycLevel":"KYC2","idType":"national_id","idNumber":"1234567890"}'`,

  /* ── TOGOCOM — BILL PAYMENTS ──────────────────────────────── */
  'togo-bill-info-v2':
    `curl -s -X POST http://localhost:${PORT}/bill-payments/v2/payment-info-v2 \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","billerId":"TOGOCOM"}'`,

  'togo-bill-info-ref':
    `curl -s -X POST http://localhost:${PORT}/bill-payments/v2/payment-info \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","type":"REF","billRef":"12345678"}'`,

  'togo-bill-info-amt-ref':
    `curl -s -X POST http://localhost:${PORT}/bill-payments/v2/payment-info \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","type":"AMT_REF","billRef":"12345678","amount":"5000"}'`,

  'togo-bill-payment':
    `curl -s -X POST http://localhost:${PORT}/bill-payments/v2/payment \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","pin":"1234","amount":"5000","billRef":"12345678","billerId":"TOGOCOM"}'`,

  /* ── TOGOCOM — TRANSACTIONS ───────────────────────────────── */
  'togo-tx-sendmoney':
    `curl -s -X POST http://localhost:${PORT}/transactions/v2 \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"subType":"sendmoney","amount":"1000","currency":"XOF","pin":"1234","debitParty":[{"key":"accountid","value":"29506967"}],"creditParty":[{"key":"accountid","value":"90008938"}]}'`,

  'togo-tx-sell':
    `curl -s -X POST http://localhost:${PORT}/transactions/v2 \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"subType":"sell","amount":"1000","currency":"XOF","pin":"1234","debitParty":[{"key":"accountid","value":"29506967"}],"creditParty":[{"key":"accountid","value":"90008938"}]}'`,

  'togo-tx-cashout':
    `curl -s -X POST http://localhost:${PORT}/transactions/v2 \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"subType":"cashout","amount":"1000","currency":"XOF","pin":"1234","debitParty":[{"key":"accountid","value":"29506967"}],"creditParty":[{"key":"accountid","value":"90008938"}]}'`,

  'togo-tx-self-create-mmo':
    `curl -s -X POST http://localhost:${PORT}/transactions/v2 \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"subType":"self_create_mmo","amount":"1000","currency":"XOF","pin":"1234","debitParty":[{"key":"accountid","value":"29506967"}]}'`,

  /* ── TOGOCOM — PURCHASES ──────────────────────────────────── */
  'togo-bundles':
    `curl -s -X GET http://localhost:${PORT}/purchase/v3/bundles/22890898190 \\\n` +
    `  -H 'Authorization: Bearer test-token'`,

  'togo-airtime-options':
    `curl -s -X GET http://localhost:${PORT}/purchase/v3/airtime/22890898190 \\\n` +
    `  -H 'Authorization: Bearer test-token'`,

  'togo-buy-airtime-self':
    `curl -s -X POST http://localhost:${PORT}/purchase/v3/airtime/self \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","amount":"500","pin":"1234","currency":"XOF"}'`,

  'togo-buy-airtime-other':
    `curl -s -X POST http://localhost:${PORT}/purchase/v3/airtime \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","receiverMsisdn":"22891234567","amount":"500","pin":"1234","currency":"XOF"}'`,

  'togo-buy-data-self':
    `curl -s -X POST http://localhost:${PORT}/purchase/v3/data/self \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","bundleId":"DATA_1GB","pin":"1234"}'`,

  'togo-buy-data-other':
    `curl -s -X POST http://localhost:${PORT}/purchase/v3/data \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","receiverMsisdn":"22891234567","bundleId":"DATA_1GB","pin":"1234"}'`,

  'togo-buy-bundle-self':
    `curl -s -X POST http://localhost:${PORT}/purchase/v3/bundles/self \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","bundleId":"BUNDLE_VIP","pin":"1234"}'`,

  'togo-buy-bundle-other':
    `curl -s -X POST http://localhost:${PORT}/purchase/v3/bundles \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","receiverMsisdn":"22891234567","bundleId":"BUNDLE_VIP","pin":"1234"}'`,

  /* ── TOGOCOM — CONTACTS & FINANCE ─────────────────────────── */
  'togo-contacts-list':
    `curl -s -X POST http://localhost:${PORT}/contacts/v2/list \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190"}'`,

  'togo-add-favorite':
    `curl -s -X POST http://localhost:${PORT}/contacts/v2/ \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"subType":"addalias","msisdn":"22890898190","alias":"22891234567","aliasName":"Friend"}'`,

  'togo-delete-favorite':
    `curl -s -X POST http://localhost:${PORT}/contacts/v2/ \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"subType":"deletealias","msisdn":"22890898190","alias":"22891234567"}'`,

  'togo-quotation':
    `curl -s -X POST http://localhost:${PORT}/quotations/v3 \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","amount":"5000","currency":"XOF","type":"sendmoney"}'`,

  'togo-w2b':
    `curl -s -X POST http://localhost:${PORT}/bank-transactions/v2/transfer/w2b \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","amount":"10000","currency":"XOF","pin":"1234","bankAccountNumber":"TG53TG0090604310346500400070"}'`,

  'togo-b2w':
    `curl -s -X POST http://localhost:${PORT}/bank-transactions/v2/transfer/b2w \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","amount":"10000","currency":"XOF","bankAccountNumber":"TG53TG0090604310346500400070"}'`,

  /* ── TOGOCOM — BCEAO / PI ─────────────────────────────────── */
  'togo-pi-search':
    `curl -s -X POST http://localhost:${PORT}/bceao-api/v1/alias/initiate-search \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"alias":"22890898190","aliasType":"MSISDN"}'`,

  'togo-pi-alias-delete':
    `curl -s -X POST http://localhost:${PORT}/bceao-api/v1/alias/initiate-delete \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"alias":"22890898190","aliasType":"MSISDN"}'`,

  'togo-pi-alias-update':
    `curl -s -X POST http://localhost:${PORT}/bceao-api/v1/alias/initiate-update \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"alias":"22890898190","aliasType":"MSISDN","newAlias":"22891234567"}'`,

  'togo-pi-alias-creation':
    `curl -s -X POST http://localhost:${PORT}/bceao-api/v1/alias/initiate-creation \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"alias":"22890898190","aliasType":"MSISDN","accountId":"12345678"}'`,

  'togo-pi-confirm-creation':
    `curl -s -X POST http://localhost:${PORT}/bceao-api/v1/alias/validate-creationinitiated \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"alias":"22890898190","otp":"123456","requestId":"REQ-001"}'`,

  'togo-qr-generate':
    `curl -s -X POST http://localhost:${PORT}/bceao-api/v1/features/qrstring \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"requestId":"TEST1","requestCaller":"APPMOBILE","alias":"59a42d4c-704e-43fb-9927-978b43c0ea22","txId":"AAAA256488888","transactionAmount":100,"categoryClient":"P","type":"D"}'`,

  'togo-qr-decode':
    `curl -s -X POST http://localhost:${PORT}/bceao-api/v1/features/qrstring-decode \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"requestId":"TEST1","requestCaller":"APPMOBILE","qrstring":"000201365600 12int.bceao.pi013659a42d4c-704e-43fb-9927-978b43c0ea2252040000530395240310058 02TG5901X6001X62240513AAAA256488888110373163044E2A"}'`,

  'togo-pi-payment-request':
    `curl -s -X POST http://localhost:${PORT}/bceao-api/v1/payment-request/request \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"amount":"5000","currency":"XOF","creditorAlias":"22890898190","debitorAlias":"22891234567","description":"Payment test"}'`,

  /* ── TOGOCOM — AUTH & MISC ────────────────────────────────── */
  'togo-get-otp':
    `curl -s -X POST http://localhost:${PORT}/otp/v1 \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","type":"sms"}'`,

  'togo-aml':
    `curl -s -X POST http://localhost:${PORT}/reis-apis/v1/reis-aml \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","amount":"50000","transactionType":"sendmoney"}'`,

  'reis-aml':
    `curl -s -X POST http://localhost:${PORT}/reis-aml \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"data":[{"accountData":[{"op":"replace","path":"/status","value":"3"},{"op":"replace","path":"/name","value":"YOVO"},{"op":"replace","path":"/last_name","value":"JULBEC"},{"op":"replace","path":"/nationality","value":"TOGO"},{"op":"replace","path":"/placeOfBirth","value":"Lome"},{"op":"replace","path":"/address_country","value":"TOGO"},{"op":"replace","path":"/activity_domain","value":"COMMERCE"},{"op":"replace","path":"/id_number","value":"0294-580-8060"},{"op":"replace","path":"/id_type","value":"national_id"},{"op":"replace","path":"/id_del_date","value":"2025-10-10"},{"op":"replace","path":"/id_exp_date","value":"2029-10-10"},{"op":"replace","path":"/organization","value":"ETS LA GRACE"},{"op":"replace","path":"/gender","value":"M"},{"op":"replace","path":"/limit_kyc","value":"KYC 2 (full registration / certification)"},{"op":"replace","path":"/date_of_birth","value":"1962-12-31"}]}],"msisdn":"92790014"}'`,

  'togo-forget-pin-get':
    `curl -s -X GET 'http://localhost:${PORT}/self-reset-pin/v1/get-data?msisdn=22890898190' \\\n` +
    `  -H 'Authorization: Bearer test-token'`,

  'togo-forget-pin-process':
    `curl -s -X POST http://localhost:${PORT}/self-reset-pin/v1/process \\\n` +
    `  -H 'Authorization: Bearer test-token' \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -d '{"msisdn":"22890898190","newPin":"5678","otp":"123456"}'`,
};

// ─── Middleware ─────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/xml' }));
app.use(bodyParser.text({ type: 'application/xml' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log('\n==============================================');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('==============================================\n');
  next();
});

// ─── Route Mounts ───────────────────────────────────────────────
// OSB SOAP services live under /osb/services (see config.js).
// All other route groups mount at the root.
app.use(BASE_URLS.OSB, require('./routes/osb'));
app.use(require('./routes/auth'));
app.use(require('./routes/merchant'));
app.use(require('./routes/mmp'));
app.use(require('./routes/payment'));
app.use(require('./routes/misc'));
app.use(require('./routes/togocom')); // Togocom/Prep-API (MMP_request&responses.xlsx)

// ============================================
// Health Check Endpoint
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    categories: {
      'AUTH': {
        'WSO2 Token': 'POST /oauth2/token',
      },
      'MERCHANT (JSON)': {
        'Get Merchant KYC': 'POST /api/merchant/kyc',
        'Check Merchant Status': 'POST /tigoagentapp_pesaliveNew/api/merchant/CheckMerchantStatus',
      },
      'OSB / SOAP': {
        'Wallet Account Registration': 'POST /osb/services/UserRegistration_5_0',
        'Change Group ID': 'POST /osb/services/ChangeCustomerTigoPesaGroup_1_0',
        'Update Alias Code': 'POST /osb/services/UpdateAliasCode_1_0',
        'Change PIN': 'POST /osb/services/PinManagement_2_0',
        'View MFS Account Type': 'POST /osb/services/ViewMFSAccountType_1_0',
        'Get Balance': 'POST /osb/services/GetBalance_3_0',
      },
      'MMP (XML/SOAP)': {
        'MMP View MFS Account Type': 'POST /MMPViewMFSAccountType',
        'MMP Create Handler': 'POST /MMPCreateHandler',
        'MMP PIN Validation': 'POST /MMPPinValidation',
        'MMP Get MFS Balance Proxy': 'POST /MMPGetMFSBalanceProxy',
        'MMP Get MFS User Status': 'POST /MMPGetMFSUserStatus',
        'MMP Change PIN': 'POST /MMPChangePIN',
        'MMP Disable Terminal User': 'POST /MMPDisableTerminalUser',
        'MMP Bill Query': 'POST /MMPBillQuery',
        'MMP Bill Payment': 'POST /MMPBillPayment',
        'MMP Cash Out Payment': 'POST /MMPCashOutPayment',
        'MMP Send Money Payment': 'POST /MMPSendMoneyPayment',
        'MMP Proxy Transfer': 'POST /MMPProxyTransfer',
        'MMP Calculate Fee Namecheck': 'POST /MMPCalculateFeeNamecheck',
        'MMP Send Money M2M': 'POST /MMPSendMoneyM2M',
        'MPP Cash Out Fee': 'POST /MPPCashOutFee',
        'Payment QR & Till Code (MMP-Telepin)': 'POST /PaymentQRAndTillCodeMmpTelepin',
        'Request to Pay Payment (MMP-Telepin)': 'POST /RequestToPayPaymentMmpTelepinCopy',
        'Request-topay-checkfee': 'POST /Request-topay-checkfee',
      },
      'PAYMENT GATEWAY (XML)': {
        'Tigo Gateway — BetPawa Payment': 'POST /TigoPaymentGateway_1_2?p=7005',
        'Tigo Gateway — Calculate Fee': 'POST /TigoPaymentGateway_1_2?p=2136',
        'Tigo Gateway — Send Money GePG': 'POST /TigoPaymentGateway_1_2?p=1945',
        'Tigo Gateway — Calculate Fee Merchant': 'POST /TigoPaymentGateway_1_2?p=1944',
        'Tigo Gateway — Bill Query': 'POST /TigoPaymentGateway_1_2?p=2022',
        'Super App Transaction Inquiry': 'POST /SuperAppTransInquiry2TigoTQS',
        'Biller Payment (API Key)': 'POST /USSDrouterPushBillpaySupperApp',
        'Biller Callback (typo compat)': 'POST /1.0/tz/test/merchant/api/RequestToPay/BillerCallbac',
        'Biller Callback': 'POST /1.0/tz/test/merchant/api/RequestToPay/BillerCallback',
      },
      'MISC': {
        'CVM Trigger': 'POST /sim-card-registration',
        'Send SMS': 'POST /SendSMSHandler',
        'Send Notification Apigee': 'POST /live/sendnotificationapigee',
      },
      'TOGOCOM — Accounts': {
        'Check Merchant Account': 'GET /accounts/v2/msisdn/:msisdn/status-v5',
        'Merchant Login / PIN Verify': 'POST /accounts/v2/msisdn/:msisdn/identity',
        'Merchant Balance': 'GET /accounts/v2/msisdn/:msisdn/balance',
        'Merchant Transaction History': 'GET /accounts/v2/msisdn/:msisdn/statemententries',
        'Change PIN': 'PATCH /accounts/v2/pin',
        'KYC Upgrade / Change Status': 'POST /accounts/v2/upgrade-kyc/:msisdn',
      },
      'TOGOCOM — Bill Payments': {
        'Preauth Pay Bill (Ref List)': 'POST /bill-payments/v2/payment-info-v2',
        'Preauth Pay Bill (REF — postpaid)': 'POST /bill-payments/v2/payment-info  [body: type=REF]',
        'Preauth Pay Bill (AMT-REF — prepaid)': 'POST /bill-payments/v2/payment-info  [body: type=AMT_REF]',
        'Pay Bill Transaction': 'POST /bill-payments/v2/payment',
      },
      'TOGOCOM — Transactions': {
        'Send Money M2M / M2C / P2P (sendmoney)': 'POST /transactions/v2  [subType: sendmoney]',
        'Merchant Payment (sell)': 'POST /transactions/v2  [subType: sell]',
        'Merchant Cashout (cashout)': 'POST /transactions/v2  [subType: cashout]',
        'Money Order — Self Create MMO': 'POST /transactions/v2  [subType: self_create_mmo]',
      },
      'TOGOCOM — Purchases': {
        'Get Available Bundles': 'GET /purchase/v3/bundles/:msisdn',
        'Fetch Airtime Options': 'GET /purchase/v3/airtime/:msisdn',
        'Buy Airtime (Self)': 'POST /purchase/v3/airtime/self',
        'Buy Airtime (Other)': 'POST /purchase/v3/airtime',
        'Buy Data (Self)': 'POST /purchase/v3/data/self',
        'Buy Data (Other)': 'POST /purchase/v3/data',
        'Buy Bundle (Self)': 'POST /purchase/v3/bundles/self',
        'Buy Bundle (Other)': 'POST /purchase/v3/bundles',
      },
      'TOGOCOM — Contacts & Finance': {
        'Get Favorite List': 'POST /contacts/v2/list',
        'Add Favorite': 'POST /contacts/v2/  [subType: addalias]',
        'Delete Favorite': 'POST /contacts/v2/  [subType: deletealias]',
        'Get Quotation': 'POST /quotations/v3',
        'Wallet to Bank (w2b)': 'POST /bank-transactions/v2/transfer/w2b',
        'Bank to Wallet (b2w)': 'POST /bank-transactions/v2/transfer/b2w',
      },
      'TOGOCOM — BCEAO / PI (Interoperability)': {
        'PI Initiate Search': 'POST /bceao-api/v1/alias/initiate-search',
        'PI Alias Delete': 'POST /bceao-api/v1/alias/initiate-delete',
        'PI Alias Update': 'POST /bceao-api/v1/alias/initiate-update',
        'PI Alias Creation': 'POST /bceao-api/v1/alias/initiate-creation',
        'PI Confirm Alias Creation': 'POST /bceao-api/v1/alias/validate-creationinitiated',
        'QR Code Generate': 'POST /bceao-api/v1/features/qrstring',
        'QR Code Decode': 'POST /bceao-api/v1/features/qrstring-decode',
        'PI Payment Request': 'POST /bceao-api/v1/payment-request/request',
      },
      'TOGOCOM — Auth & Misc': {
        'Get OTP': 'POST /otp/v1',
        'AML Check (legacy)': 'POST /reis-apis/v1/reis-aml',
        'REIS-AML Onboarding': 'POST /reis-aml',
        'Forget PIN — Get Data': 'GET /self-reset-pin/v1/get-data',
        'Forget PIN — Process Reset': 'POST /self-reset-pin/v1/process',
      },
    },
  });
});

// ============================================
// Root endpoint
// ============================================
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Mock Server</title>
  <style>
    body { font-family: sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; color: #333; }
    h1   { color: #1a1a2e; border-bottom: 2px solid #0066cc; padding-bottom: 8px; }
    h2   { color: #0066cc; margin-top: 28px; margin-bottom: 6px; font-size: 1em; text-transform: uppercase; letter-spacing: 1px; }
    ul   { margin: 0 0 8px 0; padding-left: 20px; }
    li   { padding: 3px 0; font-size: 0.9em; }
    code { background: #f0f4ff; padding: 1px 5px; border-radius: 3px; font-size: 0.88em; }
    .method { display: inline-block; min-width: 50px; font-weight: bold; }
    .get    { color: #28a745; }
    .post   { color: #0066cc; }
    .patch  { color: #fd7e14; }
    footer  { margin-top: 30px; color: #888; font-size: 0.8em; border-top: 1px solid #eee; padding-top: 10px; }

    /* ── Clickable API rows ── */
    li[data-key] { cursor: pointer; border-radius: 4px; padding: 4px 6px; margin: 1px -6px; transition: background 0.15s; }
    li[data-key]:hover { background: #e8f0fe; }
    li[data-key]:hover::after { content: ' ▶ curl'; color: #0066cc; font-size: 0.78em; font-style: italic; margin-left: 6px; }

    /* ── Modal overlay ── */
    #curl-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.55); z-index: 1000;
      align-items: center; justify-content: center;
    }
    #curl-overlay.open { display: flex; }
    #curl-modal {
      background: #fff; border-radius: 8px; width: min(820px, 94vw);
      max-height: 85vh; display: flex; flex-direction: column;
      box-shadow: 0 8px 40px rgba(0,0,0,0.3); overflow: hidden;
    }
    #curl-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; background: #1a1a2e; color: #fff;
    }
    #curl-modal-title { font-size: 0.95em; font-weight: bold; letter-spacing: 0.5px; }
    #curl-close {
      background: none; border: none; color: #fff; font-size: 1.2em;
      cursor: pointer; padding: 0 4px; line-height: 1;
    }
    #curl-close:hover { color: #ff6b6b; }
    #curl-pre {
      margin: 0; padding: 16px; overflow: auto; flex: 1;
      background: #0d1117; color: #e6edf3; font-size: 0.82em;
      line-height: 1.6; white-space: pre-wrap; word-break: break-all;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    }
    #curl-modal-footer {
      padding: 10px 16px; display: flex; gap: 8px;
      background: #f6f8fa; border-top: 1px solid #e1e4e8;
    }
    #curl-copy {
      background: #0066cc; color: #fff; border: none; border-radius: 5px;
      padding: 7px 18px; cursor: pointer; font-size: 0.88em; font-weight: 600;
    }
    #curl-copy:hover { background: #0052a3; }
    #curl-copy.copied { background: #28a745; }
    #curl-hint { font-size: 0.78em; color: #888; align-self: center; margin-left: auto; }
  </style>
</head>
<body>
  <h1>Mock Server is Running</h1>

  <h2>Auth</h2>
  <ul>
    <li data-key="oauth2-token" data-label="POST /oauth2/token — WSO2 Token"><span class="method post">POST</span> <code>/oauth2/token</code> — WSO2 Token</li>
  </ul>

  <h2>Merchant</h2>
  <ul>
    <li data-key="merchant-kyc" data-label="POST /api/merchant/kyc — Get Merchant KYC"><span class="method post">POST</span> <code>/api/merchant/kyc</code> — Get Merchant KYC</li>
    <li data-key="merchant-status" data-label="POST /tigoagentapp_pesaliveNew/api/merchant/CheckMerchantStatus — Check Merchant Status"><span class="method post">POST</span> <code>/tigoagentapp_pesaliveNew/api/merchant/CheckMerchantStatus</code> — Check Merchant Status</li>
  </ul>

  <h2>OSB / SOAP</h2>
  <ul>
    <li data-key="osb-user-registration" data-label="POST /osb/services/UserRegistration_5_0 — Wallet Account Registration"><span class="method post">POST</span> <code>/osb/services/UserRegistration_5_0</code> — Wallet Account Registration</li>
    <li data-key="osb-change-group" data-label="POST /osb/services/ChangeCustomerTigoPesaGroup_1_0 — Change Group ID"><span class="method post">POST</span> <code>/osb/services/ChangeCustomerTigoPesaGroup_1_0</code> — Change Group ID</li>
    <li data-key="osb-update-alias" data-label="POST /osb/services/UpdateAliasCode_1_0 — Update Alias Code"><span class="method post">POST</span> <code>/osb/services/UpdateAliasCode_1_0</code> — Update Alias Code</li>
    <li data-key="osb-change-pin" data-label="POST /osb/services/PinManagement_2_0 — Change PIN"><span class="method post">POST</span> <code>/osb/services/PinManagement_2_0</code> — Change PIN</li>
    <li data-key="osb-view-mfs-account-type" data-label="POST /osb/services/ViewMFSAccountType_1_0 — View MFS Account Type"><span class="method post">POST</span> <code>/osb/services/ViewMFSAccountType_1_0</code> — View MFS Account Type</li>
    <li data-key="osb-get-balance" data-label="POST /osb/services/GetBalance_3_0 — Get Balance"><span class="method post">POST</span> <code>/osb/services/GetBalance_3_0</code> — Get Balance</li>
  </ul>

  <h2>MMP (XML/SOAP)</h2>
  <ul>
    <li data-key="mmp-view-mfs-account-type" data-label="POST /MMPViewMFSAccountType"><span class="method post">POST</span> <code>/MMPViewMFSAccountType</code></li>
    <li data-key="mmp-create-handler" data-label="POST /MMPCreateHandler"><span class="method post">POST</span> <code>/MMPCreateHandler</code></li>
    <li data-key="mmp-pin-validation" data-label="POST /MMPPinValidation"><span class="method post">POST</span> <code>/MMPPinValidation</code></li>
    <li data-key="mmp-get-balance-proxy" data-label="POST /MMPGetMFSBalanceProxy"><span class="method post">POST</span> <code>/MMPGetMFSBalanceProxy</code></li>
    <li data-key="mmp-get-user-status" data-label="POST /MMPGetMFSUserStatus"><span class="method post">POST</span> <code>/MMPGetMFSUserStatus</code></li>
    <li data-key="mmp-change-pin" data-label="POST /MMPChangePIN"><span class="method post">POST</span> <code>/MMPChangePIN</code></li>
    <li data-key="mmp-disable-terminal-user" data-label="POST /MMPDisableTerminalUser"><span class="method post">POST</span> <code>/MMPDisableTerminalUser</code></li>
    <li data-key="mmp-bill-query" data-label="POST /MMPBillQuery"><span class="method post">POST</span> <code>/MMPBillQuery</code></li>
    <li data-key="mmp-bill-payment" data-label="POST /MMPBillPayment"><span class="method post">POST</span> <code>/MMPBillPayment</code></li>
    <li data-key="mmp-cash-out-payment" data-label="POST /MMPCashOutPayment"><span class="method post">POST</span> <code>/MMPCashOutPayment</code></li>
    <li data-key="mmp-send-money-payment" data-label="POST /MMPSendMoneyPayment"><span class="method post">POST</span> <code>/MMPSendMoneyPayment</code></li>
    <li data-key="mmp-proxy-transfer" data-label="POST /MMPProxyTransfer"><span class="method post">POST</span> <code>/MMPProxyTransfer</code></li>
    <li data-key="mmp-calculate-fee-namecheck" data-label="POST /MMPCalculateFeeNamecheck"><span class="method post">POST</span> <code>/MMPCalculateFeeNamecheck</code></li>
    <li data-key="mmp-send-money-m2m" data-label="POST /MMPSendMoneyM2M"><span class="method post">POST</span> <code>/MMPSendMoneyM2M</code></li>
    <li data-key="mpp-cash-out-fee" data-label="POST /MPPCashOutFee"><span class="method post">POST</span> <code>/MPPCashOutFee</code></li>
    <li data-key="mmp-payment-qr" data-label="POST /PaymentQRAndTillCodeMmpTelepin"><span class="method post">POST</span> <code>/PaymentQRAndTillCodeMmpTelepin</code></li>
    <li data-key="mmp-request-to-pay" data-label="POST /RequestToPayPaymentMmpTelepinCopy"><span class="method post">POST</span> <code>/RequestToPayPaymentMmpTelepinCopy</code></li>
    <li data-key="mmp-checkfee" data-label="POST /Request-topay-checkfee"><span class="method post">POST</span> <code>/Request-topay-checkfee</code></li>
  </ul>

  <h2>Payment Gateway (XML)</h2>
  <ul>
    <li data-key="gw-betpawa" data-label="POST /TigoPaymentGateway_1_2?p=7005 — BetPawa Payment"><span class="method post">POST</span> <code>/TigoPaymentGateway_1_2?p=7005</code> — BetPawa Payment</li>
    <li data-key="gw-calculate-fee" data-label="POST /TigoPaymentGateway_1_2?p=2136 — Calculate Fee"><span class="method post">POST</span> <code>/TigoPaymentGateway_1_2?p=2136</code> — Calculate Fee</li>
    <li data-key="gw-send-money-gepg" data-label="POST /TigoPaymentGateway_1_2?p=1945 — Send Money GePG"><span class="method post">POST</span> <code>/TigoPaymentGateway_1_2?p=1945</code> — Send Money GePG</li>
    <li data-key="gw-calculate-fee-merchant" data-label="POST /TigoPaymentGateway_1_2?p=1944 — Calculate Fee Merchant"><span class="method post">POST</span> <code>/TigoPaymentGateway_1_2?p=1944</code> — Calculate Fee Merchant</li>
    <li data-key="gw-bill-query" data-label="POST /TigoPaymentGateway_1_2?p=2022 — Bill Query"><span class="method post">POST</span> <code>/TigoPaymentGateway_1_2?p=2022</code> — Bill Query</li>
    <li data-key="superapp-trans-inquiry" data-label="POST /SuperAppTransInquiry2TigoTQS"><span class="method post">POST</span> <code>/SuperAppTransInquiry2TigoTQS</code></li>
    <li data-key="biller-payment" data-label="POST /USSDrouterPushBillpaySupperApp — Biller Payment"><span class="method post">POST</span> <code>/USSDrouterPushBillpaySupperApp</code> — Biller Payment</li>
    <li data-key="biller-callback" data-label="POST /1.0/tz/.../BillerCallback — Biller Callback"><span class="method post">POST</span> <code>/1.0/tz/test/merchant/api/RequestToPay/BillerCallback</code> — Biller Callback</li>
  </ul>

  <h2>Misc</h2>
  <ul>
    <li data-key="misc-cvm" data-label="POST /sim-card-registration — CVM Trigger"><span class="method post">POST</span> <code>/sim-card-registration</code> — CVM Trigger</li>
    <li data-key="misc-sms" data-label="POST /SendSMSHandler"><span class="method post">POST</span> <code>/SendSMSHandler</code></li>
    <li data-key="misc-notification" data-label="POST /live/sendnotificationapigee"><span class="method post">POST</span> <code>/live/sendnotificationapigee</code></li>
  </ul>

  <h2>Togocom — Accounts</h2>
  <ul>
    <li data-key="togo-check-merchant-account" data-label="GET /accounts/v2/msisdn/:msisdn/status-v5 — Check Merchant Account"><span class="method get">GET</span>   <code>/accounts/v2/msisdn/:msisdn/status-v5</code> — Check Merchant Account</li>
    <li data-key="togo-merchant-login" data-label="POST /accounts/v2/msisdn/:msisdn/identity — Merchant Login / PIN Verify"><span class="method post">POST</span> <code>/accounts/v2/msisdn/:msisdn/identity</code> — Merchant Login / PIN Verify</li>
    <li data-key="togo-balance" data-label="GET /accounts/v2/msisdn/:msisdn/balance — Merchant Balance"><span class="method get">GET</span>   <code>/accounts/v2/msisdn/:msisdn/balance</code> — Merchant Balance</li>
    <li data-key="togo-tx-history" data-label="GET /accounts/v2/msisdn/:msisdn/statemententries — Transaction History"><span class="method get">GET</span>   <code>/accounts/v2/msisdn/:msisdn/statemententries</code> — Transaction History</li>
    <li data-key="togo-change-pin" data-label="PATCH /accounts/v2/pin — Change PIN"><span class="method patch">PATCH</span> <code>/accounts/v2/pin</code> — Change PIN</li>
    <li data-key="togo-kyc-upgrade" data-label="POST /accounts/v2/upgrade-kyc/:msisdn — KYC Upgrade"><span class="method post">POST</span> <code>/accounts/v2/upgrade-kyc/:msisdn</code> — KYC Upgrade</li>
  </ul>

  <h2>Togocom — Bill Payments</h2>
  <ul>
    <li data-key="togo-bill-info-v2" data-label="POST /bill-payments/v2/payment-info-v2 — Preauth Pay Bill (Ref List)"><span class="method post">POST</span> <code>/bill-payments/v2/payment-info-v2</code> — Preauth Pay Bill (Ref List)</li>
    <li data-key="togo-bill-info-ref" data-label="POST /bill-payments/v2/payment-info — REF (postpaid)"><span class="method post">POST</span> <code>/bill-payments/v2/payment-info</code> — Preauth Pay Bill — REF (postpaid) <em>[body: type=REF]</em></li>
    <li data-key="togo-bill-info-amt-ref" data-label="POST /bill-payments/v2/payment-info — AMT-REF (prepaid)"><span class="method post">POST</span> <code>/bill-payments/v2/payment-info</code> — Preauth Pay Bill — AMT-REF (prepaid) <em>[body: type=AMT_REF]</em></li>
    <li data-key="togo-bill-payment" data-label="POST /bill-payments/v2/payment — Pay Bill Transaction"><span class="method post">POST</span> <code>/bill-payments/v2/payment</code> — Pay Bill Transaction</li>
  </ul>

  <h2>Togocom — Transactions</h2>
  <ul>
    <li data-key="togo-tx-sendmoney" data-label="POST /transactions/v2 — Send Money [subType: sendmoney]"><span class="method post">POST</span> <code>/transactions/v2</code> — Send Money M2M / M2C / P2P <em>[subType: sendmoney]</em></li>
    <li data-key="togo-tx-sell" data-label="POST /transactions/v2 — Merchant Payment [subType: sell]"><span class="method post">POST</span> <code>/transactions/v2</code> — Merchant Payment <em>[subType: sell]</em></li>
    <li data-key="togo-tx-cashout" data-label="POST /transactions/v2 — Merchant Cashout [subType: cashout]"><span class="method post">POST</span> <code>/transactions/v2</code> — Merchant Cashout <em>[subType: cashout]</em></li>
    <li data-key="togo-tx-self-create-mmo" data-label="POST /transactions/v2 — Money Order [subType: self_create_mmo]"><span class="method post">POST</span> <code>/transactions/v2</code> — Money Order / Self Create MMO <em>[subType: self_create_mmo]</em></li>
  </ul>

  <h2>Togocom — Purchases</h2>
  <ul>
    <li data-key="togo-bundles" data-label="GET /purchase/v3/bundles/:msisdn — Available Bundles"><span class="method get">GET</span>   <code>/purchase/v3/bundles/:msisdn</code> — Available Bundles</li>
    <li data-key="togo-airtime-options" data-label="GET /purchase/v3/airtime/:msisdn — Airtime Options"><span class="method get">GET</span>   <code>/purchase/v3/airtime/:msisdn</code> — Airtime Options</li>
    <li data-key="togo-buy-airtime-self" data-label="POST /purchase/v3/airtime/self — Buy Airtime (Self)"><span class="method post">POST</span> <code>/purchase/v3/airtime/self</code> — Buy Airtime (Self)</li>
    <li data-key="togo-buy-airtime-other" data-label="POST /purchase/v3/airtime — Buy Airtime (Other)"><span class="method post">POST</span> <code>/purchase/v3/airtime</code> — Buy Airtime (Other)</li>
    <li data-key="togo-buy-data-self" data-label="POST /purchase/v3/data/self — Buy Data (Self)"><span class="method post">POST</span> <code>/purchase/v3/data/self</code> — Buy Data (Self)</li>
    <li data-key="togo-buy-data-other" data-label="POST /purchase/v3/data — Buy Data (Other)"><span class="method post">POST</span> <code>/purchase/v3/data</code> — Buy Data (Other)</li>
    <li data-key="togo-buy-bundle-self" data-label="POST /purchase/v3/bundles/self — Buy Bundle (Self)"><span class="method post">POST</span> <code>/purchase/v3/bundles/self</code> — Buy Bundle (Self)</li>
    <li data-key="togo-buy-bundle-other" data-label="POST /purchase/v3/bundles — Buy Bundle (Other)"><span class="method post">POST</span> <code>/purchase/v3/bundles</code> — Buy Bundle (Other)</li>
  </ul>

  <h2>Togocom — Contacts &amp; Finance</h2>
  <ul>
    <li data-key="togo-contacts-list" data-label="POST /contacts/v2/list — Get Favorite List"><span class="method post">POST</span> <code>/contacts/v2/list</code> — Get Favorite List</li>
    <li data-key="togo-add-favorite" data-label="POST /contacts/v2/ — Add Favorite [subType: addalias]"><span class="method post">POST</span> <code>/contacts/v2/</code> — Add Favorite <em>[subType: addalias]</em></li>
    <li data-key="togo-delete-favorite" data-label="POST /contacts/v2/ — Delete Favorite [subType: deletealias]"><span class="method post">POST</span> <code>/contacts/v2/</code> — Delete Favorite <em>[subType: deletealias]</em></li>
    <li data-key="togo-quotation" data-label="POST /quotations/v3 — Get Quotation"><span class="method post">POST</span> <code>/quotations/v3</code> — Get Quotation</li>
    <li data-key="togo-w2b" data-label="POST /bank-transactions/v2/transfer/w2b — Wallet to Bank"><span class="method post">POST</span> <code>/bank-transactions/v2/transfer/w2b</code> — Wallet to Bank</li>
    <li data-key="togo-b2w" data-label="POST /bank-transactions/v2/transfer/b2w — Bank to Wallet"><span class="method post">POST</span> <code>/bank-transactions/v2/transfer/b2w</code> — Bank to Wallet</li>
  </ul>

  <h2>Togocom — BCEAO / PI (Interoperability)</h2>
  <ul>
    <li data-key="togo-pi-search" data-label="POST /bceao-api/v1/alias/initiate-search — PI Initiate Search"><span class="method post">POST</span> <code>/bceao-api/v1/alias/initiate-search</code> — PI Initiate Search</li>
    <li data-key="togo-pi-alias-delete" data-label="POST /bceao-api/v1/alias/initiate-delete — PI Alias Delete"><span class="method post">POST</span> <code>/bceao-api/v1/alias/initiate-delete</code> — PI Alias Delete</li>
    <li data-key="togo-pi-alias-update" data-label="POST /bceao-api/v1/alias/initiate-update — PI Alias Update"><span class="method post">POST</span> <code>/bceao-api/v1/alias/initiate-update</code> — PI Alias Update</li>
    <li data-key="togo-pi-alias-creation" data-label="POST /bceao-api/v1/alias/initiate-creation — PI Alias Creation"><span class="method post">POST</span> <code>/bceao-api/v1/alias/initiate-creation</code> — PI Alias Creation</li>
    <li data-key="togo-pi-confirm-creation" data-label="POST /bceao-api/v1/alias/validate-creationinitiated — PI Confirm Alias Creation"><span class="method post">POST</span> <code>/bceao-api/v1/alias/validate-creationinitiated</code> — PI Confirm Alias Creation</li>
    <li data-key="togo-qr-generate" data-label="POST /bceao-api/v1/features/qrstring — QR Code Generate"><span class="method post">POST</span> <code>/bceao-api/v1/features/qrstring</code> — QR Code Generate</li>
    <li data-key="togo-qr-decode" data-label="POST /bceao-api/v1/features/qrstring-decode — QR Code Decode"><span class="method post">POST</span> <code>/bceao-api/v1/features/qrstring-decode</code> — QR Code Decode</li>
    <li data-key="togo-pi-payment-request" data-label="POST /bceao-api/v1/payment-request/request — PI Payment Request"><span class="method post">POST</span> <code>/bceao-api/v1/payment-request/request</code> — PI Payment Request</li>
  </ul>

  <h2>Togocom — Auth &amp; Misc</h2>
  <ul>
    <li data-key="togo-get-otp" data-label="POST /otp/v1 — Get OTP"><span class="method post">POST</span> <code>/otp/v1</code> — Get OTP</li>
    <li data-key="togo-aml" data-label="POST /reis-apis/v1/reis-aml — AML Check (legacy)"><span class="method post">POST</span> <code>/reis-apis/v1/reis-aml</code> — AML Check (legacy)</li>
    <li data-key="reis-aml" data-label="POST /reis-aml — REIS-AML Onboarding"><span class="method post">POST</span> <code>/reis-aml</code> — REIS-AML Onboarding</li>
    <li data-key="togo-forget-pin-get" data-label="GET /self-reset-pin/v1/get-data — Forget PIN Get Data"><span class="method get">GET</span>   <code>/self-reset-pin/v1/get-data</code> — Forget PIN Get Data</li>
    <li data-key="togo-forget-pin-process" data-label="POST /self-reset-pin/v1/process — Forget PIN Process"><span class="method post">POST</span> <code>/self-reset-pin/v1/process</code> — Forget PIN Process</li>
  </ul>

  <footer>Server Time: ${new Date().toISOString()} &nbsp;|&nbsp; <a href="/health">/health (JSON)</a>
    &nbsp;|&nbsp; <em>Click any API row to get a working cURL command</em>
  </footer>

  <!-- ── cURL modal ───────────────────────────────────────────── -->
  <div id="curl-overlay">
    <div id="curl-modal" role="dialog" aria-modal="true" aria-labelledby="curl-modal-title">
      <div id="curl-modal-header">
        <span id="curl-modal-title">cURL Command</span>
        <button id="curl-close" title="Close">✕</button>
      </div>
      <pre id="curl-pre"></pre>
      <div id="curl-modal-footer">
        <button id="curl-copy">Copy</button>
        <span id="curl-hint">Paste directly into your terminal</span>
      </div>
    </div>
  </div>

  <script>
    const CURLS = ${JSON.stringify(curlExamples)};

    const overlay = document.getElementById('curl-overlay');
    const pre     = document.getElementById('curl-pre');
    const copyBtn = document.getElementById('curl-copy');
    const title   = document.getElementById('curl-modal-title');
    const closeBtn = document.getElementById('curl-close');

    function openModal(key, label) {
      const cmd = CURLS[key];
      if (!cmd) return;
      // Replace \\n with actual newlines for display
      pre.textContent = cmd.replace(/\\\\n/g, '\\n');
      title.textContent = label || key;
      overlay.classList.add('open');
      copyBtn.textContent = 'Copy';
      copyBtn.classList.remove('copied');
    }

    function closeModal() { overlay.classList.remove('open'); }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    copyBtn.addEventListener('click', () => {
      const text = pre.textContent;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = 'Copied ✓';
        copyBtn.classList.add('copied');
        setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2000);
      });
    });

    // Attach click listeners to all [data-key] items
    document.querySelectorAll('li[data-key]').forEach(li => {
      li.addEventListener('click', () => openModal(li.dataset.key, li.dataset.label));
    });
  </script>
</body>
</html>`);
});

// Start server
app.listen(PORT, () => {
  console.log('==============================================');
  console.log(`🚀 Mock Server running on http://localhost:${PORT}`);
  console.log('==============================================');
  console.log('  [AUTH]     POST /oauth2/token');
  console.log('  [MERCHANT] POST /api/merchant/kyc');
  console.log('  [MERCHANT] POST /tigoagentapp_pesaliveNew/api/merchant/CheckMerchantStatus');
  console.log('  [OSB SOAP] POST /osb/services/UserRegistration_5_0');
  console.log('  [OSB SOAP] POST /osb/services/ChangeCustomerTigoPesaGroup_1_0');
  console.log('  [OSB SOAP] POST /osb/services/UpdateAliasCode_1_0');
  console.log('  [OSB SOAP] POST /osb/services/PinManagement_2_0');
  console.log('  [OSB SOAP] POST /osb/services/ViewMFSAccountType_1_0');
  console.log('  [OSB SOAP] POST /osb/services/GetBalance_3_0');
  console.log('  [MMP XML]  POST /MMPViewMFSAccountType');
  console.log('  [MMP XML]  POST /MMPCreateHandler | /MMPPinValidation | /MMPGetMFSBalanceProxy');
  console.log('  [MMP XML]  POST /MMPGetMFSUserStatus | /MMPChangePIN | /MMPDisableTerminalUser');
  console.log('  [MMP XML]  POST /MMPBillQuery | /MMPBillPayment | /MMPCashOutPayment');
  console.log('  [MMP XML]  POST /MMPSendMoneyPayment | /MMPProxyTransfer | /MMPCalculateFeeNamecheck');
  console.log('  [MMP XML]  POST /MMPSendMoneyM2M | /MPPCashOutFee | /Request-topay-checkfee');
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=7005|2136|1945|1944|2022');
  console.log('  [PAYMENT]  POST /SuperAppTransInquiry2TigoTQS');
  console.log('  [PAYMENT]  POST /USSDrouterPushBillpaySupperApp');
  console.log('  [PAYMENT]  POST /1.0/tz/test/merchant/api/RequestToPay/BillerCallback');
  console.log('  [MISC]     POST /sim-card-registration | /SendSMSHandler | /live/sendnotificationapigee');
  console.log('  --- Togocom / Prep-API ---');
  console.log('  [ACCOUNTS] GET  /accounts/v2/msisdn/:msisdn/status-v5 | balance | statemententries');
  console.log('  [ACCOUNTS] POST /accounts/v2/msisdn/:msisdn/identity');
  console.log('  [ACCOUNTS] PATCH /accounts/v2/pin | POST /accounts/v2/upgrade-kyc/:msisdn');
  console.log('  [BILLPAY]  POST /bill-payments/v2/payment-info-v2 | payment-info | payment');
  console.log('  [TXNS]     POST /transactions/v2  (subType: sendmoney|sell|cashout|self_create_mmo)');
  console.log('  [PURCHASE] GET  /purchase/v3/bundles/:msisdn | airtime/:msisdn');
  console.log('  [PURCHASE] POST /purchase/v3/airtime/self | airtime | data/self | data | bundles/self | bundles');
  console.log('  [CONTACTS] POST /contacts/v2/list | /contacts/v2/');
  console.log('  [FINANCE]  POST /quotations/v3 | /bank-transactions/v2/transfer/w2b | b2w');
  console.log('  [BCEAO]    POST /bceao-api/v1/alias/initiate-search');
  console.log('  [BCEAO]    POST /bceao-api/v1/alias/initiate-delete');
  console.log('  [BCEAO]    POST /bceao-api/v1/alias/initiate-update');
  console.log('  [BCEAO]    POST /bceao-api/v1/alias/initiate-creation');
  console.log('  [BCEAO]    POST /bceao-api/v1/alias/validate-creationinitiated');
  console.log('  [BCEAO]    POST /bceao-api/v1/features/qr-generate');
  console.log('  [BCEAO]    POST /bceao-api/v1/features/qr-decode');
  console.log('  [BCEAO]    POST /bceao-api/v1/payment-request/request');
  console.log('  [AUTH]     POST /otp/v1 | /reis-apis/v1/reis-aml');
  console.log('  [AUTH]     GET  /self-reset-pin/v1/get-data | POST /self-reset-pin/v1/process');
  console.log('==============================================');
  console.log(`  Open http://localhost:${PORT}/ for HTML docs`);
  console.log(`  Open http://localhost:${PORT}/health for JSON status`);
  console.log('==============================================\n');
});
  // ── OSB (SOAP) ──
  console.log('  [OSB SOAP] POST /osb/services/UserRegistration_5_0');
  console.log('  [OSB SOAP] POST /osb/services/ChangeCustomerTigoPesaGroup_1_0');
  console.log('  [OSB SOAP] POST /osb/services/UpdateAliasCode_1_0');
  console.log('  [OSB SOAP] POST /osb/services/PinManagement_2_0');
  console.log('  [OSB SOAP] POST /osb/services/ViewMFSAccountType_1_0');
  console.log('  [OSB SOAP] POST /osb/services/GetBalance_3_0');
  // ── MMP (XML/SOAP) ──
  console.log('  [MMP XML]  POST /MMPViewMFSAccountType');
  console.log('  [MMP XML]  POST /MMPCreateHandler');
  console.log('  [MMP XML]  POST /MMPPinValidation');
  console.log('  [MMP XML]  POST /MMPGetMFSBalanceProxy');
  console.log('  [MMP XML]  POST /MMPGetMFSUserStatus');
  console.log('  [MMP XML]  POST /MMPChangePIN');
  console.log('  [MMP XML]  POST /MMPDisableTerminalUser');
  console.log('  [MMP XML]  POST /MMPBillQuery');
  console.log('  [MMP XML]  POST /MMPBillPayment');
  console.log('  [MMP XML]  POST /MMPCashOutPayment');
  console.log('  [MMP XML]  POST /MMPSendMoneyPayment');
  console.log('  [MMP XML]  POST /MMPProxyTransfer');
  console.log('  [MMP XML]  POST /PaymentQRAndTillCodeMmpTelepin');
  console.log('  [MMP XML]  POST /RequestToPayPaymentMmpTelepinCopy');
  console.log('  [MMP XML]  POST /MPPCashOutFee');
  console.log('  [MMP XML]  POST /MMPCalculateFeeNamecheck');
  console.log('  [MMP XML]  POST /MMPSendMoneyM2M');
  console.log('  [MMP XML]  POST /Request-topay-checkfee');
  // ── Payment Gateway ──
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=2022  (Bill Query)');
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=7005  (BetPawa Payment)');
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=2136  (Calculate Fee)');
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=1945  (Send Money GePG)');
  console.log('  [PAYMENT]  POST /TigoPaymentGateway_1_2?p=1944  (Calculate Fee Merchant)');
  console.log('  [PAYMENT]  POST /SuperAppTransInquiry2TigoTQS');
  console.log('  [PAYMENT]  POST /USSDrouterPushBillpaySupperApp');

