const express = require("express");
const authenticate = require("../middlewere/auth");
const CheckoutModel = require("../models/checkoutModel");
const paynowRoute = express.Router();

// routes/checkoutRoute.js
paynowRoute.post("/pay-now/:id", authenticate, async (req, res) => {
  try {
    const checkoutId = req.params.id;
    const { paymentId } = req.body;

    const booking = await CheckoutModel.findById(checkoutId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.isPaid = true;
    booking.status = "confirmed";
    booking.paymentId = paymentId || "PAY_" + Date.now();
    booking.paymentDate = new Date();

    await booking.save();

    res.json({
      success: true,
      message: "Payment successful",
      data: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Payment failed",
    });
  }
});

module.exports = paynowRoute;
