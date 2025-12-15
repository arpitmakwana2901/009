// models/BuyTicket.js
const mongoose = require("mongoose");

const buyTicketSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
    title: String,
    image: String,
    releaseYear: Number,
    genres: [String],
    runtime: Number,
    rating: Number,
    seats: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const BuyTicketModel = mongoose.model("BuyTicket", buyTicketSchema);
module.exports = BuyTicketModel;
