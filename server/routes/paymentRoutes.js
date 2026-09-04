const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  verifyPaymentAndEnroll,
  getMyOrders,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/create-intent', createPaymentIntent);
router.post('/verify', verifyPaymentAndEnroll);
router.get('/orders', getMyOrders);

module.exports = router;
