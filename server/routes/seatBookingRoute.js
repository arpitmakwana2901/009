const express = require("express");
const SeatLayoutModel = require("../models/seatLayoutModel");
const authenticate = require("../middlewere/auth");
const SeatBookingModel = require("../models/seatBookingModel");
const seatBookingRoute = express.Router();

// POST → Book seats
seatBookingRoute.post("/book-seats", authenticate, async (req, res) => {
  try {
    const { movieId, time, seats, movieData, totalAmount, showDate } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    if (!movieId || !time || !seats || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // 1. Seat layout update karo
    const layout = await SeatLayoutModel.findOne({ movieId });
    if (!layout) {
      return res.status(404).json({
        success: false,
        message: "Layout not found",
      });
    }

    const timeSlot = layout.timeSlots.find((t) => t.time === time);
    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: "Time slot not found",
      });
    }

    // Check for already booked seats
    const alreadyBookedSeats = [];
    for (const seatStr of seats) {
      const [categoryName, rowName, seatNumber] = seatStr.split("-");
      const category = timeSlot.categories.find(
        (cat) => cat.categoryName === categoryName
      );
      if (!category) continue;

      const row = category.rows.find((r) => r.rowName === rowName);
      if (!row) continue;

      const seat = row.seats.find((s) => s.seatNumber === seatNumber);
      if (seat && seat.isBooked) {
        alreadyBookedSeats.push(seatStr);
      }
    }

    if (alreadyBookedSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Some seats are already booked: ${alreadyBookedSeats.join(
          ", "
        )}`,
      });
    }

    // Update seats to booked
    for (const seatStr of seats) {
      const [categoryName, rowName, seatNumber] = seatStr.split("-");
      const category = timeSlot.categories.find(
        (cat) => cat.categoryName === categoryName
      );
      if (!category) continue;

      const row = category.rows.find((r) => r.rowName === rowName);
      if (!row) continue;

      const seat = row.seats.find((s) => s.seatNumber === seatNumber);
      if (seat) {
        seat.isBooked = true;
      }
    }

    await layout.save();

    // 2. Booking record create karo
    const booking = await SeatBookingModel.create({
      userId,
      movieId,
      movieTitle: movieData?.title || "Movie",
      poster_path: movieData?.poster_path || "/default-poster.jpg",
      runtime: movieData?.runtime || 120,
      time,
      showDate: showDate ? new Date(showDate) : new Date(),
      seats,
      totalAmount: totalAmount || 0,
      isPaid: false,
    });

    res.status(200).json({
      success: true,
      message: "Seats booked successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Seat booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = seatBookingRoute;
