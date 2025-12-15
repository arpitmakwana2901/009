const express = require("express");
const ShowModel = require("../models/addShowModel");
const addShowRoute = express.Router();

// ➤ Add Show

addShowRoute.post("/addShow", async (req, res) => {
  try {
    const {
      title,
      overview,
      backdrop_path,
      release_date,
      vote_average,
      genres,
      runtime,
      language,
      watchTrailer,
      cast,
      showDates,
      price,
    } = req.body;

    // 🔍 Check karo movie pehle se hai kya
    let existingShow = await ShowModel.findOne({ title });

    if (existingShow) {
      // 🧠 Purane showDates me naye dates merge karne ka logic
      const updatedDates = { ...Object.fromEntries(existingShow.showDates) };

      for (const [date, times] of Object.entries(showDates)) {
        if (!updatedDates[date]) {
          updatedDates[date] = times;
        } else {
          for (const time of times) {
            if (!updatedDates[date].includes(time)) {
              updatedDates[date].push(time);
            }
          }
        }
      }

      // 🔁 Update kar do final data
      existingShow.showDates = updatedDates;
      existingShow.price = price;
      await existingShow.save();

      return res.json({
        success: true,
        message: "✅ Existing show updated successfully!",
        data: existingShow,
      });
    }

    // 🆕 Agar new movie hai to create karo
    const newShow = await ShowModel.create({
      title,
      overview,
      backdrop_path,
      release_date,
      vote_average,
      genres,
      runtime,
      language,
      watchTrailer,
      cast,
      showDates,
      price,
    });

    res.status(201).json({
      success: true,
      message: "🎬 New show added successfully!",
      data: newShow,
    });
  } catch (error) {
    console.error("❌ Error adding/updating show:", error);
    res.status(500).json({
      success: false,
      message: "Error adding/updating show",
      error: error.message,
    });
  }
});

// ➤ Get all shows
addShowRoute.get("/getShows", async (req, res) => {
  try {
    const shows = await ShowModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Shows fetched successfully",
      data: shows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching shows", error: error.message });
  } 
});

// ➤ Get single show
addShowRoute.get("/getShows/:id", async (req, res) => {
  try {
    const show = await ShowModel.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    res.status(200).json({
      message: "Show fetched successfully",
      data: show,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching show", error: error.message });
  }
});

module.exports = addShowRoute;
