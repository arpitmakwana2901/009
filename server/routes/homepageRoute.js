const express = require("express");
const HomepageModel = require("../models/homepageModel");
const authenticate = require("../middlewere/auth");
const homepageRouter = express.Router();

homepageRouter.post("/add",authenticate, async (req, res) => {
  try {
    const addHomePage = await HomepageModel.create(req.body);
    console.log(addHomePage);
    return res.status(401).json({
      message: "Add Hero Section",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Bad Request",
      success: error.message,
    });
  }
});

homepageRouter.get("/", async (req, res) => {
  try {
    const heroes = await HomepageModel.find();
    res.status(200).json(heroes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = homepageRouter;
