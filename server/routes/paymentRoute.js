const express = require("express");
const Payment = require("../models/paymentModel");
const CheckoutModel = require("../models/checkoutModel");
const authenticate = require("../middlewere/auth");
const paymentRouter = express.Router();

// POST /payments/api
// This is the "confirm payment" step in current UI.
paymentRouter.post("/api", authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookingId, movieTitle, seats, totalAmount } = req.body;

    if (
      !bookingId ||
      !movieTitle ||
      !Array.isArray(seats) ||
      seats.length === 0 ||
      totalAmount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid required fields",
      });
    }

    const booking = await CheckoutModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (String(booking.userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Mark booking paid (idempotent)
    if (!booking.isPaid) {
      booking.isPaid = true;
      booking.status = "confirmed";
      booking.paymentDate = new Date();
      booking.paymentId = booking.paymentId || `PAY_${Date.now()}`;
      await booking.save();
    }

    // Upsert payment record (one per bookingId)
    const payment = await Payment.findOneAndUpdate(
      { bookingId: booking._id },
      {
        userId,
        bookingId: booking._id,
        movieTitle,
        seats,
        totalAmount,
        status: "success",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Payment confirmed successfully",
      payment,
    });
  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = paymentRouter;
