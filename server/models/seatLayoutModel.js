const mongoose = require("mongoose");

// Seat Schema
const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false }, // ✅ Bestseller flag
});

// Row Schema
const rowSchema = new mongoose.Schema({
  rowName: { type: String, required: true },
  seats: [seatSchema],
});

// Category Schema
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    enum: ["premium", "executive", "normal"],
    required: true,
  },
  price: { type: Number, required: true },
  rows: [rowSchema],
});

// Time Slot Schema
const timeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true }, // e.g. "10:00 AM"
  categories: [categorySchema],
});

// Seat Layout Schema
const seatLayoutSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show", // ya "Movie" — depends on tera model
      required: true,
    },
    timeSlots: [timeSlotSchema],
  },
  { timestamps: true }
);

const SeatLayoutModel = mongoose.model("SeatLayout", seatLayoutSchema);
module.exports = SeatLayoutModel;
