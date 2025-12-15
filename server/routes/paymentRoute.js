const express = require("express");
const Payment = require("../models/paymentModel");
const paymentRouter = express.Router();

// POST /api/payments - Save payment to DB
paymentRouter.post("/", async (req, res) => {
  try {
    const { userId, bookingId, movieTitle, seats, totalAmount } = req.body;

    // Validate required fields
    if (!userId || !bookingId || !movieTitle || !seats || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new payment
    const newPayment = new Payment({
      userId,
      bookingId,
      movieTitle,
      seats,
      totalAmount,
    });

    await newPayment.save();

    res
      .status(201)
      .json({ message: "Payment saved successfully", payment: newPayment });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = paymentRouter;
