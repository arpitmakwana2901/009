const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // User ka ID (agar auth hai)
    ref: 'User', // Assume User model hai, agar nahi to remove ref
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'checkout',
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  seats: {
    type: [String], // Array of seats like ["A1", "A2"]
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success',
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;