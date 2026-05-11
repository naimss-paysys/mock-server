# Mock Server

A mock server for testing API endpoints with both REST/JSON and SOAP/XML support.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## Available Endpoints

### 1. Get Merchant KYC (REST/JSON)
- **Endpoint:** `POST /api/merchant/kyc`
- **Content-Type:** `application/json`
- **Request:**
```json
{
  "customerMsisdn": "658283033",
  "isSimSwapRequest": false
}
```

### 2. Wallet Account Registration (SOAP)
- **Endpoint:** `POST /osb/services/UserRegistration_5_0`
- **Content-Type:** `text/xml` or `application/xml`
- **Request:** SOAP XML (See request-responses.txt for sample)

### 3. Change Group ID (SOAP)
- **Endpoint:** `POST /osb/services/ChangeCustomerTigoPesaGroup_1_0`
- **Content-Type:** `text/xml` or `application/xml`
- **Request:** SOAP XML (See request-responses.txt for sample)

### 4. Update Alias Code (SOAP)
- **Endpoint:** `POST /osb/services/UpdateAliasCode_1_0`
- **Content-Type:** `text/xml` or `application/xml`
- **Request:** SOAP XML (See request-responses.txt for sample)

### 5. CVM Trigger (XML)
- **Endpoint:** `POST /sim-card-registration`
- **Content-Type:** `application/xml`
- **Request:** XML (See request-responses.txt for sample)

### 6. Health Check
- **Endpoint:** `GET /health`
- **Response:** JSON with server status and available endpoints

## Testing with cURL

### Test Merchant KYC:
```bash
curl -X POST http://localhost:3000/api/merchant/kyc \
  -H "Content-Type: application/json" \
  -d "{\"customerMsisdn\":\"658283033\",\"isSimSwapRequest\":false}"
```

### Test CVM Trigger:
```bash
curl -X POST http://localhost:3000/sim-card-registration \
  -H "Content-Type: application/xml" \
  -d "<?xml version=\"1.0\" encoding=\"UTF-8\"?><request><transactionId>123</transactionId></request>"
```

### Test Health Check:
```bash
curl http://localhost:3000/health
```

## Testing with Postman

1. Import the provided test collection or create new requests
2. Set the appropriate Content-Type headers
3. Use the sample requests from `request-responses.txt`

## Features

- ✅ Supports both REST/JSON and SOAP/XML requests
- ✅ Request/Response logging
- ✅ Health check endpoint
- ✅ Detailed console output for debugging
- ✅ Easy to extend with new endpoints

## Logs

All requests are logged to the console with:
- Timestamp
- HTTP Method and URL
- Headers
- Request Body

This makes it easy to debug and verify the requests being sent to the server.
