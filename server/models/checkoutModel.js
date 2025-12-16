const mongoose = require("mongoose");

const checkoutSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // ✅ ADD THESE REQUIRED FIELDS
    movieTitle: {
      type: String,
      default: "Unknown Movie", // ✅ Default value add karo
    },
    poster_path: {
      type: String,
      default: "/default-poster.jpg", // ✅ Default value
    },
    runtime: {
      type: Number,
      default: 120, // ✅ Default value
    },
    time: {
      type: String,
      default: "Not specified", // ✅ Default value
    },
    seats: [
      {
        type: String,
        default: [], // ✅ Default empty array
      },
    ],
    totalAmount: {
      type: Number,
      default: 0, // ✅ Default value
    },
    isPaid: {
      type: Boolean,
      default: false, // ✅ Default value
    },
    // ✅ Existing fields
    selectedDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    paymentDate: {
      type: Date,
    },
    // Payment id should only exist after successful payment.
    // Keep it undefined for pending bookings so unique indexes won't conflict.
    paymentId: {
      type: String,
      default: undefined,
    },
  },
  { timestamps: true }
);

// Unique only when a real string paymentId is present.
checkoutSchema.index(
  { paymentId: 1 },
  {
    unique: true,
    partialFilterExpression: { paymentId: { $type: "string" } },
  }
);

const CheckoutModel = mongoose.model("checkout", checkoutSchema);
module.exports = CheckoutModel;
