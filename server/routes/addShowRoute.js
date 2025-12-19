const express = require("express");
const ShowModel = require("../models/addShowModel");
const SeatLayoutModel = require("../models/seatLayoutModel");
const authorizeAdmin = require("../middlewere/authorizeAdmin");
const addShowRoute = express.Router();

// ➤ Add Show

addShowRoute.post("/addShow", authorizeAdmin, async (req, res) => {
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
      // Normalize + de-duplicate times per date.
      // IMPORTANT: we overwrite showDates with the admin selection so old schedules don't accumulate.
      const normalizedShowDates = {};
      for (const [date, times] of Object.entries(showDates || {})) {
        const arr = Array.isArray(times) ? times : [];
        const uniq = Array.from(new Set(arr.map((t) => String(t).trim()).filter(Boolean)));
        normalizedShowDates[date] = uniq;
      }

      existingShow.showDates = normalizedShowDates;
      existingShow.price = price;
      await existingShow.save();

      return res.json({
        success: true,
        message: "✅ Existing show updated successfully!",
        data: existingShow,
      });
    }

    // Normalize + de-duplicate times per date.
    const normalizedShowDates = {};
    for (const [date, times] of Object.entries(showDates || {})) {
      const arr = Array.isArray(times) ? times : [];
      const uniq = Array.from(new Set(arr.map((t) => String(t).trim()).filter(Boolean)));
      normalizedShowDates[date] = uniq;
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
      showDates: normalizedShowDates,
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
    const { status } = req.query;

    const filter = {};
    if (status === "active") {
      // Backward compatible: old docs may not have `status` field.
      filter.$or = [{ status: "active" }, { status: { $exists: false } }];
    } else if (status === "inactive") {
      filter.status = "inactive";
    }

    const shows = await ShowModel.find(filter).sort({ createdAt: -1 });
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

// ➤ Update show (Admin)
addShowRoute.put("/:id", authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "title",
      "overview",
      "backdrop_path",
      "release_date",
      "vote_average",
      "genres",
      "runtime",
      "language",
      "watchTrailer",
      "cast",
      "showDates",
      "price",
      "status",
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (updates.showDates) {
      const normalizedShowDates = {};
      for (const [date, times] of Object.entries(updates.showDates || {})) {
        const arr = Array.isArray(times) ? times : [];
        const uniq = Array.from(
          new Set(arr.map((t) => String(t).trim()).filter(Boolean))
        );
        normalizedShowDates[date] = uniq;
      }
      updates.showDates = normalizedShowDates;
    }

    const updated = await ShowModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ success: false, message: "Show not found" });

    return res.status(200).json({
      success: true,
      message: "Show updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ➤ Toggle status (Admin)
addShowRoute.patch("/:id/status", authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== "active" && status !== "inactive") {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = await ShowModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Show not found" });

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ➤ Delete show (Admin)
addShowRoute.delete("/:id", authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ShowModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Show not found" });

    // Cleanup seat layout if present
    await SeatLayoutModel.findOneAndDelete({ movieId: id });

    return res.status(200).json({
      success: true,
      message: "Show deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = addShowRoute;
