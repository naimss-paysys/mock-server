// ─────────────────────────────────────────────
// Auth Routes
// Base URL: / (mounted at root in server.js)
//
// POST /oauth2/token  → WSO2 client_credentials token
// ─────────────────────────────────────────────
const router = require('express').Router();

router.post('/oauth2/token', (req, res) => {
  console.log('WSO2 Token Request:', req.body);

  const grantType = String(req.body?.grant_type || '').trim();

  if (grantType !== 'client_credentials') {
    return res.status(400).json({
      error: 'unsupported_grant_type',
      error_description: 'Only client_credentials is supported in this mock',
    });
  }

  return res.json({
    access_token: 'eyJ4NXQiOiJNekl4T1RGaFpqUXpNRGcwTnpSak1XWTFOMkkzWmpreE9XTm1ZemMzTnpZMU9XVmtOVFEzTWciLCJraWQiOiJOMlZsWldOaU4yRm1NREl3TnpFd01tWmhaamMwWWpBd05EUTBOak01WW1JMVptSTRNRFJpT1RJNFpqaGxZbUUxTWpCbU5UQmpZVGd4WTJZMU4yVmpZUV9SUzI1NiIsInR5cCI6ImF0K2p3dCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxYzlhYjY5OS00Y2VmLTQyYmEtYWM1OC03N2Q2MDIwZjBjODgiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6ImYycEdPWkN4b0I3QlhHUGVxR05FdlBQZlBDY2EiLCJuYmYiOjE3Mzc5Nzc1ODMsImF6cCI6ImYycEdPWkN4b0I3QlhHUGVxR05FdlBQZlBDY2EiLCJzY29wZSI6ImRlZmF1bHQiLCJpc3MiOiJodHRwczpcL1wvdGVzdC1hcGltLmF4aWFuLWdyb3VwLmNvbVwvb2F1dGgyXC90b2tlbiIsImV4cCI6MTczNzk4MTE4MywiaWF0IjoxNzM3OTc3NTgzLCJqdGkiOiJmMjA5MzY4YS0xM2I5LTRhNDgtODc2OS03NmM5OWI4NDVmN2YiLCJjbGllbnRfaWQiOiJmMnBHT1pDeG9CN0JYR1BlcUdORXZQUGZQQ2NhIn0.elaDm4S9AGzFzlND0NuyBNiiOLJUhpECsfG_eEbT1DEX0gkB3VEyayeVAmzGg80CRHJih1YzCsbpaDDh6VTTAhrhTzdcwx3wO_gZl_7byigPsOGQesPz88eYZRBwGNk16m7IF8OblcNl2XXemaP99MH2t7bmWSxl6fj9smQjXwQxghc_dEjPgRLmqjVC9tOkI2o9SfUwaM-pxiL1uDNU9U17e0Wlvh1u4L6ixFSUSYLt49cJUpXBxPTj678IZuGadhL5VB_hTAY62EjXcGLZtU8pXad85p3rSF__NgYTz3c9CzVkh41kprNaL607OFjuS6dx3MbowUCg7EIQQag',
    scope: 'default',
    token_type: 'Bearer',
    expires_in: 3600,
  });
});

module.exports = router;
