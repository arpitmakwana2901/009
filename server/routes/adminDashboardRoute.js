const express = require("express");
const CheckoutModel = require("../models/checkoutModel");
const ShowModel = require("../models/addShowModel");
const UserModel = require("../models/userModel");
const SeatBookingModel = require("../models/seatBookingModel");

const dashboardRoute = express.Router();

dashboardRoute.get("/", async (req, res) => {
  try {
    // 🧮 Total Bookings
    const totalBookings = await SeatBookingModel.find().countDocuments();

    // 💰 Total Revenue
    const totalRevenueAgg = await CheckoutModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // 🎬 Latest Shows
    const activeShows = await ShowModel.find({})
      .sort({ createdAt: -1 })
      // .limit(5)
      .select("title backdrop_path vote_average release_date runtime");

    // 👥 Total Users (direct from user collection)
    const totalUser = await UserModel.countDocuments();
    console.log(totalUser, "totaluser");
    // 🎟️ Booking Stats per Movie
    const bookingsPerMovie = await CheckoutModel.aggregate([
      {
        $group: {
          _id: "$movieTitle",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          poster_path: { $first: "$poster_path" },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        totalRevenue,
        totalUser,
        activeShows,
        bookingsPerMovie,
      },
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({
      success: false,
      message: "Dashboard data load karte waqt error aaya",
    });
  }
});

module.exports = dashboardRoute;
