const mongoose = require("mongoose");

const seatBookingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    movieTitle: { type: String, default: "Unknown Movie" },
    poster_path: { type: String, default: "/default-poster.jpg" },
    runtime: { type: Number, default: 120 },
    time: { type: String, required: true },
    showDate: { type: Date, default: Date.now },
    seats: [{ type: String, required: true }],
    totalAmount: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SeatBookingModel = mongoose.model("seat-booking", seatBookingSchema);
module.exports = SeatBookingModel;
