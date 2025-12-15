const express = require("express");
const authenticate = require("../middlewere/auth");
const SeatLayoutModel = require("../models/seatLayoutModel");

const seatLayoutRoutes = express.Router();

seatLayoutRoutes.post("/add", authenticate, async (req, res) => {
  try {
    const { movieId, timeSlots } = req.body;
    console.log(movieId, "MOVIE_ID");
    console.log(timeSlots, "TIMESLOT");

    if (!movieId || !timeSlots || !Array.isArray(timeSlots)) {
      return res.status(400).json({
        success: false,
        message: "movieId aur timeSlots array required hai",
      });
    }

    const layout = await SeatLayoutModel.create({ movieId, timeSlots });
    console.log(layout, "LAYOUT--");
    res.status(201).json({
      success: true,
      message: "Seat layout added successfully",
      data: layout,
    });
  } catch (error) {
    console.error("Error adding seat layout:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================================================
// GET → Get seat layout by movieId
// ================================================
seatLayoutRoutes.get("/:movieId", async (req, res) => {
  try {
    // console.log("FETCH---");
    const movieId = req.params.movieId; // ✅ correct way

    const layout = await SeatLayoutModel.findOne({
      movieId: movieId,
    });
    console.log(movieId, "FETCH-MOVIEID");
    // console.log(layout, "FETCH_LAYOUT");
    if (!layout) {
      return res.status(404).json({
        success: false,
        message: "Seat layout not found for this movieId",
      });
    }

    res.status(200).json({ success: true, data: layout });
  } catch (error) {
    console.error("Error fetching seat layout:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================================================
// PUT → Update specific timeSlot seats (example: mark booked/unbooked)
// Body example:
// {
//   "time": "10:00 AM",
//   "categories": [...updated categories array...]
// }
// ================================================
seatLayoutRoutes.put("/update/:movieId", authenticate, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { time, categories } = req.body;

    const layout = await SeatLayoutModel.findOne({ movieId });
    console.log(movieId, "====");
    if (!layout)
      return res
        .status(404)
        .json({ success: false, message: "Layout not found" });

    // Find the specific timeSlot
    const timeSlotIndex = layout.timeSlots.findIndex(
      (slot) => slot.time === time
    );

    if (timeSlotIndex === -1)
      return res
        .status(404)
        .json({ success: false, message: "TimeSlot not found" });

    layout.timeSlots[timeSlotIndex].categories = categories;

    await layout.save();

    res.status(200).json({
      success: true,
      message: "TimeSlot updated successfully",
      data: layout.timeSlots[timeSlotIndex],
    });
  } catch (error) {
    console.error("Error updating timeSlot:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================================================
// DELETE → Delete entire seat layout for a movie
// ================================================
seatLayoutRoutes.delete("/delete/:movieId", authenticate, async (req, res) => {
  try {
    const layout = await SeatLayoutModel.findOneAndDelete({
      movieId: req.params.movieId,
    });

    if (!layout)
      return res
        .status(404)
        .json({ success: false, message: "Layout not found" });

    res.status(200).json({
      success: true,
      message: "Seat layout deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting layout:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = seatLayoutRoutes;
