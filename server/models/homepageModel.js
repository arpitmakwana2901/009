const mongoose = require("mongoose");

const homepageSchema = mongoose.Schema({
  title: { type: String, required: true },
  genres: { type: String, required: true },
  year: { type: Number, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  logo: { type: String, required: true },
});

const HomepageModel = mongoose.model("Home", homepageSchema);
module.exports = HomepageModel;


