const express = require("express");
const favoriteModel = require("../models/FavoriteModel");

const favoriteRouter = express.Router();

/* -------------------------------
   ADD MOVIE TO FAVORITES
--------------------------------*/
favoriteRouter.post("/add", async (req, res) => {
  try {
    const { movieId, movie } = req.body;

    // Check if movie already exists
    const exists = await favoriteModel.findOne({ movieId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Movie already added to favorites",
      });
    }

    const newFav = await favoriteModel.create({
      movieId,
      title: movie.title,
      poster_path: movie.poster_path || movie.backdrop_path,
      vote_average: movie.vote_average,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      release_date: movie.release_date,
    });

    res.status(201).json({
      success: true,
      message: "Movie added to favorites",
      data: newFav,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* -------------------------------
   GET ALL FAVORITE MOVIES
--------------------------------*/
favoriteRouter.get("/all", async (req, res) => {
  try {
    const favorites = await favoriteModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* -------------------------------
   REMOVE FAVORITE BY ID
--------------------------------*/
favoriteRouter.delete("/remove/:id", async (req, res) => {
  try {
    const deleted = await favoriteModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Favorite movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie removed from favorites",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = favoriteRouter;
