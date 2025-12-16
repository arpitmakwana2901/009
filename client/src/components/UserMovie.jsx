import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import { API_URL } from "../App";

const UserMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_URL}/shows/getShows`);
        setMovies(res.data?.data || []);
      } catch (err) {
        console.error("UserMovies fetch error:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p className="text-white text-center">LOADING...</p>;

  return (
    <div className="px-6 md:px-16 lg:px-40 xl:px-44 my-20">
      <h1 className="text-lg font-semibold mb-4 text-white">🎬 Your Movies</h1>
      {movies.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-gray-300">No movies found.</p>
      )}
    </div>
  );
};

export default UserMovies;
