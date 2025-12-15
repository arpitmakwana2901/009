const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    overview: { type: String },
    backdrop_path: { type: String },
    release_date: { type: Date, required: true },
    vote_average: { type: Number, default: 0 },
    genres: { type: [String], default: [] },
    watchTrailer: { type: String },
    runtime: { type: Number },
    language: { type: String, default: "ENGLISH" },
    cast: {
      type: [
        {
          name: { type: String, required: true },
          profile_path: { type: String, default: "" },
        },
      ],
      default: [],
    },
    showDates: {
      type: Map,
      of: [String], // date => [times]
      default: {},
    },
    price: { type: Number, required: true }, // 👈 added
  },
  { timestamps: true }
);

const ShowModel = mongoose.model("Show", showSchema);
module.exports = ShowModel;
