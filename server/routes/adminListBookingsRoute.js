const express = require("express");
const CheckoutModel = require("../models/checkoutModel");
const ShowModel = require("../models/addShowModel");

const authorizeAdmin = require("../middlewere/authorizeAdmin");

const adminListBookingsRoute = express.Router();

// GET /admin/all-bookings
adminListBookingsRoute.get("/all-bookings", authorizeAdmin, async (req, res) => {
  try {
    const bookings = await CheckoutModel.find()
      .populate("userId", "userName email")
      .sort({ createdAt: -1 });

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

// GET /admin/shows-stats
// Returns Show list with computed { totalBookings, earnings } from ALL checkouts.
adminListBookingsRoute.get("/shows-stats", authorizeAdmin, async (req, res) => {
  try {
    const shows = await ShowModel.find().sort({ createdAt: -1 });

    const stats = await CheckoutModel.aggregate([
      {
        $group: {
          _id: "$movieId",
          totalBookings: { $sum: 1 },
          earnings: { $sum: "$totalAmount" },
        },
      },
    ]);

    const statsByMovieId = new Map(
      stats.map((s) => [
        String(s._id),
        { totalBookings: s.totalBookings, earnings: s.earnings },
      ])
    );

    const data = shows.map((show) => {
      const s = statsByMovieId.get(String(show._id)) || {
        totalBookings: 0,
        earnings: 0,
      };

      return {
        ...show.toObject(),
        totalBookings: s.totalBookings,
        earnings: s.earnings,
      };
    });

    res.status(200).json({
      success: true,
      data,
      message: "Shows stats fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = adminListBookingsRoute;
