// ─────────────────────────────────────────────
// Merchant Routes
// Base URL: / (mounted at root in server.js)
//
// POST /api/merchant/kyc
//   → Get Merchant KYC (JSON)
// POST /tigoagentapp_pesaliveNew/api/merchant/CheckMerchantStatus
//   → Check Merchant Status (JSON)
// ─────────────────────────────────────────────
const router = require('express').Router();

// --------------------------------------------
// Get Merchant KYC
// --------------------------------------------
router.post('/api/merchant/kyc', (req, res) => {
  console.log('Get Merchant KYC Request:', req.body);

  const response = {
    respData: [
      {
        id: 0,
        contactDetails: {
          id: 0,
          emailId: 'vaghanirahul@gmail.com',
          alternateContactNumber: '0777585888',
          address: 'MSASANI MSASANI 14111',
          city: 'DAR ES SALAAM (KINONDONI)',
          zipcode: '14111',
          district: 'KINONDONI',
          region: 'DAR ES SALAAM (KINONDONI)',
        },
        customerDetails: {
          id: 0,
          firstName: 'DENIS',
          middleName: 'RWEGASIRA',
          lastName: 'ELIAS',
          dob: 'Sep 5, 1989 12:00:00 AM',
          gender: 'M',
          bloodGroup: 'NULL',
          placeOfBirth: 'TEST_PLACE',
          image: '/2020/11/02/19890905141110000124_IMAGE.jpg',
          signature: '/2020/11/02/19890905141110000124_SIGNATURE.jpg',
          nationality: 'Tanzania',
          spokenLanguage: 'Swahili',
          spokenLanguageId: 0,
        },
        registrationDTO: {
          id: 77658881,
          retailerId: 0,
          customerId: 0,
          simId: 0,
          contactId: 0,
          proofDocTypeId: 0,
          ProofDocType: 'National ID',
          ProofDocCategory: 'CUSTOMER',
          ProofDoc: 'NULL',
          ProofNumber: '19940325615060000128',
          addProofDocType: 'National ID',
          status: 'REGISTERED',
          createUserMsisdn: '657223962',
          createDate: 'Nov 2, 2020 12:22:59 PM',
          changeDate: 'Jul 14, 2025 2:08:58 PM',
          customerMsisdn: req.body.customerMsisdn || '658283033',
          languageId: 0,
          tigoCashAccountStatus: 'ACTIVATED',
          tigoCashAccountRequired: true,
          channelType: 'TIGOAPP',
          activationDate: 'Jul 14, 2025 2:08:58 PM',
          reRegCount: 0,
          customerType: 'Prepaid',
          companyName: '',
          manageSubscriberFailure: 0,
          fullFillProductFailure: 0,
          linkNetworkFailure: 0,
          ki: '8F95D43A88FC18423DEF53D138887571',
          reserved: 0,
          verified: 0,
          verificationMode: '0',
          provision: 0,
          registrationType: 'BIOMETRIC',
          representationType: 'Individual',
          subscriberLineType: 'PRIMARY',
        },
        simDetails: {
          id: 0,
          iccid: '8925502042287595065',
          simtypeId: 0,
          imsi: '640021160759506',
          puk: '78616432',
        },
        approvedDate: '',
        finalStatus: 'REGISTERED',
        representationType: 'Individual',
        relationship: 'Self',
        resParameter: {
          SIM_SWAP_REASON: 'DAMAGED',
        },
      },
    ],
    maxUpdateCount: 2147483647,
    totalCount: 2516934,
    individualTotalCount: 0,
    corporateTotalCount: 0,
    respTime: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
    statusCode: 'SC0000',
  };

  res.json(response);
});

// --------------------------------------------
// Check Merchant Status
// --------------------------------------------
router.post('/tigoagentapp_pesaliveNew/api/merchant/CheckMerchantStatus', (req, res) => {
  console.log('Check Merchant Status Request:', req.body);

  res.json({
    Status: 'ACTIVE',
    BackendResponse: 'Verification process completed successfully',
    CreatedDate: '16-AUG-22 03.39.33.163046 PM',
  });
});

module.exports = router;
