const express = require("express");
const Payment = require("../models/paymentModel");
const authenticate = require("../middlewere/auth");
const paymentRouter = express.Router();

// POST /payments/api
paymentRouter.post("/api", authenticate, async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

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

    const payment = new Payment({
      userId,
      bookingId,
      movieTitle,
      seats,
      totalAmount,
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: "Payment saved successfully",
      payment,
    });
  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = paymentRouter;
