const express = require("express");
const mongoose = require("mongoose");
const authenticate = require("../middlewere/auth");
const CheckoutModel = require("../models/checkoutModel");
const paynowRoute = express.Router();

// This endpoint represents the "start payment" step (kept for current UI flow).
// It stores a paymentId on the booking but DOES NOT confirm payment.
paynowRoute.post("/pay-now/:id", authenticate, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { paymentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id",
      });
    }

    // 1) Find booking
    const booking = await CheckoutModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // If already paid, return success (idempotent)
    if (booking.isPaid) {
      return res.status(200).json({
        success: true,
        message: "Payment already completed",
        data: booking,
      });
    }

    // Store a paymentId (optional), but keep booking pending until /payments/api confirms.
    if (paymentId && !booking.paymentId) {
      booking.paymentId = paymentId;
      await booking.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment initiated",
      data: booking,
    });
  } catch (error) {
    console.error("PAY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Payment failed",
      error: error.message,
    });
  }
});

module.exports = paynowRoute;
