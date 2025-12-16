const express = require("express");
const CheckoutModel = require("../models/checkoutModel");
const authenticate = require("../middlewere/auth");
const checkoutRoute = express.Router();

checkoutRoute.post("/create-checkout", authenticate, async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;

    const {
      movieId,
      movieTitle,
      poster_path,
      runtime,
      time,
      showDate,
      seats,
      totalAmount,
    } = req.body;

    if (!movieId || !movieTitle || !seats || seats.length === 0 || !showDate) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const booking = await CheckoutModel.create({
      userId,
      movieId,
      movieTitle,
      poster_path,
      runtime,
      time,
      seats,
      totalAmount,
      selectedDate: new Date(showDate), // ✅ FIX
      isPaid: false,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      data: booking, // ✅ MONGO _id yahin se milegi
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("CREATE CHECKOUT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

checkoutRoute.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;

    const bookings = await CheckoutModel.find({ userId }).sort({
      createdAt: -1,
    }); // Latest bookings first

    res.status(200).json({
      success: true,
      data: bookings,
      message: "Bookings fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = checkoutRoute;
