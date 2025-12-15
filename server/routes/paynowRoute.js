const express = require("express");
const mongoose = require("mongoose");
const authenticate = require("../middlewere/auth");
const CheckoutModel = require("../models/checkoutModel");
const Payment = require("../models/paymentModel");
const paynowRoute = express.Router();

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

    // 2) Mark booking paid
    booking.isPaid = true;
    booking.status = "confirmed";
    booking.paymentDate = new Date();
    if (paymentId) booking.paymentId = paymentId;
    await booking.save();

    // 3) Store payment/ticket record (so it is saved in DB on Pay Now)
    const existingPayment = await Payment.findOne({ bookingId: booking._id });
    if (!existingPayment) {
      await Payment.create({
        userId: booking.userId,
        bookingId: booking._id,
        movieTitle: booking.movieTitle,
        seats: booking.seats,
        totalAmount: booking.totalAmount,
        status: "success",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment successful",
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
