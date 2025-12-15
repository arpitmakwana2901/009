const express = require("express");
const Payment = require("../models/paymentModel");
const paymentRouter = express.Router();

// POST /payments/api
paymentRouter.post("/api", async (req, res) => {
  try {
    const { userId, bookingId, movieTitle, seats, totalAmount } = req.body;

    if (!userId || !bookingId || !movieTitle || !seats || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newPayment = new Payment({
      userId,
      bookingId,
      movieTitle,
      seats,
      totalAmount,
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      message: "Payment saved successfully",
      payment: newPayment,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = paymentRouter;
