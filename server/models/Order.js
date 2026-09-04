const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'mock_card', 'free_enroll', 'sslcommerz'],
      default: 'stripe',
    },
    paymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed', 'refunded'],
      default: 'completed',
    },
    transactionId: {
      type: String,
      default: () => 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
