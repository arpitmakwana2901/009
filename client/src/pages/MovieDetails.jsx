import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import toast from "react-hot-toast";
import { API_URL } from "../App";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/shows/getShows/${id}`
        );
        setMovie(res.data.data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleAddToFavorites = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please login to add to favorites");
      navigate("/auth");
      return;
    }

    try {
      // ✅ Pehle test karein ki endpoint available hai ya nahi
      console.log("Testing favorite endpoints...");
      
      // Different possible endpoints try karein
      const endpoints = [
        `${API_URL}/favorite/add`,
        `${API_URL}/favorites/add`,
        `${API_URL}/api/favorite/add`,
        `${API_URL}/api/favorites/add`,
        `${API_URL}/user/favorite/add`,
      ];

      let success = false;
      let lastError = null;

      for (let endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await axios.post(
            endpoint,
            {
              movieId: movie._id,
              movie: movie
            },
            {
              headers: { 
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          console.log("✅ Success with endpoint:", endpoint);
          console.log("Favorite response:", response.data);
          toast.success("✅ Added to favorites!");
          success = true;
          break;
          
        } catch (err) {
          lastError = err;
          console.log(`❌ Failed with ${endpoint}:`, err.response?.status);
          continue;
        }
      }

      if (!success) {
        throw lastError;
      }
      
    } catch (err) {
      console.error("Favorite error:", err);
      
      if (err.response?.status === 401) {
        toast.error("Please login to add favorites");
        navigate("/auth");
      } else if (err.response?.status === 404) {
        toast.error("Favorite feature not available yet");
        console.log("Available endpoints check karein backend mein");
      } else if (err.response?.status === 400) {
        toast.error("Movie already in favorites");
      } else {
        toast.error("Favorite feature temporarily unavailable");
      }
    }
  };

  // Temporary function - Agar favorite backend setup nahi hai toh
  const handleAddToFavoritesLocal = () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please login to add to favorites");
      navigate("/auth");
      return;
    }

    // Local storage mein save karein temporarily
    try {
      const userFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
      
      // Check if already in favorites
      const alreadyExists = userFavorites.some(fav => fav._id === movie._id);
      
      if (alreadyExists) {
        toast.error("Movie already in favorites");
        return;
      }

      // Add to favorites
      userFavorites.push(movie);
      localStorage.setItem('userFavorites', JSON.stringify(userFavorites));
      
      toast.success("✅ Added to favorites!");
    } catch (err) {
      toast.error("Error adding to favorites");
    }
  };

  if (loading) return <div className="text-white text-center pt-40">Loading...</div>;
  if (!movie) return <div className="text-white text-center pt-40">Movie not found</div>;

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-40">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Movie Poster */}
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        {/* Movie Info */}
        <div className="relative flex flex-col gap-3">
          <p className="text-primary">{movie.language || "N/A"}</p>
          <h1 className="text-4xl font-semibold text-white">{movie.title}</h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {movie.vote_average?.toFixed(1)} User Rating
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-tight">
            {movie.overview}
          </p>

          <p className="text-gray-300">
            {timeFormat(movie.runtime)} •{" "}
            {Array.isArray(movie.genres) ? movie.genres.join(", ") : "N/A"} •{" "}
            {new Date(movie.release_date).getFullYear()}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button
              onClick={() => {
                if (movie.watchTrailer) {
                  window.open(movie.watchTrailer, "_blank");
                } else {
                  toast.error("Trailer not available!");
                }
              }}
              className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95 text-white"
            >
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>

            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95 text-white"
            >
              Buy Tickets
            </a>
            
            {/* Favorite Button - Temporary local storage solution use karein */}
            <button
              onClick={handleAddToFavoritesLocal} // ✅ Change to local storage function
              className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95 hover:bg-red-500 hover:text-white text-white"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Cast Section */}
          <p className="text-lg font-medium mt-20 text-white">Your Favorite Cast</p>
          <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
            <div className="flex items-center gap-4 w-max px-4">
              {movie.cast?.slice(0, 12).map((cast, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <img
                    src={cast.profile_path}
                    alt={cast.name}
                    className="rounded-full h-20 md:h-20 aspect-square object-cover"
                  />
                  <p className="font-medium text-xs mt-3 text-white">{cast.name}</p>
                </div>
              )) || <p className="text-gray-400 text-sm">No cast available</p>}
            </div>
          </div>

          {/* Date Selection Section */}
          <DateSelect dateTime={movie.showDates || {}} movieId={id} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;