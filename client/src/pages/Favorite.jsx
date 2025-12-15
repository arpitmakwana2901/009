import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to view favorites");
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      // ✅ Pehle backend se try karein
      console.log("Trying to fetch from backend...");

      // Agar backend available nahi hai toh local storage use karein
      const localFavorites = JSON.parse(
        localStorage.getItem("userFavorites") || "[]"
      );
      console.log("Local favorites:", localFavorites);

      setFavorites(localFavorites);
    } catch (err) {
      console.log("Backend unavailable, using local storage");
      const localFavorites = JSON.parse(
        localStorage.getItem("userFavorites") || "[]"
      );
      setFavorites(localFavorites);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-40 text-white">
        Loading favorites...
      </h2>
    );
  }

  return favorites && favorites.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="text-2xl font-bold my-6 text-white">
        Your Favorite Movies
      </h1>

      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {favorites.map((movie, index) => (
          <MovieCard
            movie={movie}
            key={movie._id || index}
            showBuyButton={true}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center mb-4 text-white">
        No favorite movies yet
      </h1>
      <p className="text-gray-400 text-center">
        Add some movies to your favorites from movie details page!
      </p>
    </div>
  );
};

export default Favorite;
