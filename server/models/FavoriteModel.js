const mongoose = require("mongoose");
const favoriteSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
      required: true,
      unique: true, // same movie duplicate add nahi hogi
    },
    title: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      required: true,
    },
    vote_average: {
      type: Number,
      default: 0,
    },
    backdrop_path: String,
    overview: String,
    release_date: String,
  },
  { timestamps: true }
);

const favoriteModel = mongoose.model("favorite", favoriteSchema);
module.exports = favoriteModel;
