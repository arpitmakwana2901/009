const express = require("express");
const CheckoutModel = require("../models/checkoutModel");

const adminListBookingsRoute = express.Router();
adminListBookingsRoute.get("/all-bookings", async (req, res) => {
  try {
    const bookings = await CheckoutModel.find()
      .populate("userId", "userName email") // user details
      .sort({ createdAt: -1 });
    console.log(bookings, "----");
    res.status(200).json({
      success: true,
      data: bookings,
      message: "All bookings fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = adminListBookingsRoute;
