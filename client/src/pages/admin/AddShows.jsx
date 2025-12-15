import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import axios from "axios";
import { useAuth } from "../../components/context/AuthContext";
import toast from "react-hot-toast";
import { API_URL } from "../../App";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const { token } = useAuth();

  const fetchMovies = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/shows/getShows`
      );
      setMovies(res.data.data || []);
    } catch (error) {
      console.error("Movies fetch karne me error:", error);
      toast.error("Failed to fetch movies. Please try again.");
    }
  };

  const handleAddShow = async () => {
    if (
      !selectedMovie ||
      !showPrice ||
      Object.keys(dateTimeSelection).length === 0
    ) {
      toast.error("Please select a movie, price, and at least one showtime.");
      return;
    }

    const movie = movies.find((m) => m._id === selectedMovie);

    try {
      const res = await axios.post(
        `${API_URL}/shows/addShow`,
        {
          title: movie.title,
          overview: movie.overview,
          backdrop_path: movie.backdrop_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          genres: movie.genres,
          runtime: movie.runtime,
          language: movie.language,
          watchTrailer: movie.watchTrailer,
          cast: movie.cast,
          showDates: dateTimeSelection,
          price: showPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "Show added successfully!");
      setSelectedMovie(null);
      setShowPrice("");
      setDateTimeSelection({});
      setDateTimeInput("");
    } catch (error) {
      console.error("❌ Show add karne me error:", error);
      toast.error("Failed to add show. Please try again.");
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) {
      toast.error("Please select a valid date and time.");
      return;
    }
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        toast.success("Showtime added successfully.");
        return { ...prev, [date]: [...times, time] };
      } else {
        toast.error("This showtime is already added.");
      }
      return prev;
    });
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        toast.success("Date removed successfully.");
        return rest;
      }
      toast.success("Showtime removed successfully.");
      return { ...prev, [date]: filteredTimes };
    });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return movies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>

      {/* ✅ Movie List */}
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300 ${
                selectedMovie === movie._id ? "border-2 border-primary" : ""
              }`}
              onClick={() => setSelectedMovie(movie._id)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={movie.backdrop_path}
                  alt={movie.title}
                  className="w-full object-cover brightness-90"
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average?.toFixed(1) || "N/A"}
                  </p>
                  <p className="text-gray-300">
                    {kConverter(movie.vote_average || 0)} Votes
                  </p>
                </div>
              </div>
              {selectedMovie === movie._id && (
                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                  <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}
              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Show Price */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter show price"
            className="outline-none bg-transparent"
          />
        </div>
      </div>

      {/* ✅ Date-Time Input */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Select Date and Time
        </label>
        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none rounded-md bg-transparent"
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Add Time
          </button>
        </div>
      </div>

      {/* ✅ Selected Times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2">Selected Date-Time</h2>
          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className="font-medium">{date}</div>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {times.map((time) => (
                    <div
                      key={time}
                      className="border border-primary px-2 py-1 flex items-center rounded"
                    >
                      <span>{time}</span>
                      <DeleteIcon
                        onClick={() => handleRemoveTime(date, time)}
                        width={15}
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Add Show Button */}
      <button
        onClick={handleAddShow}
        className="bg-red-600 text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer"
      >
        Add Show
      </button>
    </>
  ) : (
    <div className="text-center py-10">Loading movies...</div>
  );
};

export default AddShows;
