import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import axios from "axios";
import { API_URL } from "../App";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const res = await axios.get(`${API_URL}/featuredSection`);
        console.log("🎬 Featured Movies:", res.data);
        setMovies(res.data);
      } catch (err) {
        console.error("🚨 Error loading movies:", err);
      }
    };

    fetchFeaturedMovies();
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-80px" />
        <p className="text-gray-300 font-medium text-lg">Now Showing</p>

        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
        >
          View All
          <ArrowRightIcon className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
        </button>
      </div>

      <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">
        {movies.slice(0, 8).map((movie) => (
          <MovieCard key={movie._id} movie={movie} showBuyButton={false} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-6 py-3 bg-[#f34c65] hover:bg-[#e13b54] text-white font-semibold rounded-lg shadow-md transition"
        >
          Show more
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
