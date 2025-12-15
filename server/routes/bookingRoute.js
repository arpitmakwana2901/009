const express = require("express");
const bookingRoute = express.Router();
const BookingModel = require("../models/bookingModel");
const authenticate = require("../middlewere/auth");
// ✅ POST: Book a movie for selected date
bookingRoute.post("/", authenticate, async (req, res) => {
  try {
    const { movieId, selectedDate } = req.body;

    if (!movieId || !selectedDate) {
      return res
        .status(400)
        .json({ error: "movieId and selectedDate are required" });
    }

    const userId = req.user._id; // from token middleware

    // Check if already booked for same date
    // const existingBooking = await BookingModel.findOne({
    //   userId,
    //   movieId,
    //   selectedDate,
    // });
    // if (existingBooking) {
    //   return res
    //     .status(400)
    //     .json({ error: "You have already booked this date!" });
    // }
    console.log(userId, "USER_ID");
    console.log(movieId, "MOVIE_ID");
    console.log(selectedDate, "selected-date");
    const booking = new BookingModel({
      userId,
      movieId,
      selectedDate,
      status: "pending",
    });
    console.log(booking, "BOOKING");
    await booking.save();

    res.status(201).json({
      message: "Booking created successfully!",
      booking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Server error while booking." });
  }
});

module.exports = bookingRoute;
