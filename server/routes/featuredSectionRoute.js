const express = require("express");
const FeaturedSection = require("../models/featuredSectionModel"); // change this to featuredSectionModel
const authenticate = require("../middlewere/auth");

const FeaturedSectionRoute = express.Router();

FeaturedSectionRoute.post("/add", authenticate, async (req, res) => {
  console.log("hello", req.body);
  try {
    const data = await FeaturedSection.create(req.body);
    console.log(data, "data");
    return res.status(201).json({
      message: "Add Featured Section",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      message: "BAD REQUEST",
      error: error.message,
    });
  }
});

FeaturedSectionRoute.get("/", async (req, res) => {
  try {
    const movies = await FeaturedSection.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = FeaturedSectionRoute;
