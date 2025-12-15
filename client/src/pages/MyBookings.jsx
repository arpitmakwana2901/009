import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "./../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { API_URL } from "../App";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moviesData, setMoviesData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchMoviesData = async () => {
    try {
      const res = await axios.get(`${API_URL}/shows/getShows`);
      setMoviesData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setMoviesData([]);
    }
  };

  const getMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view bookings");
        return;
      }

      await fetchMoviesData();

      if (location.state?.latestBooking) {
        const mergedBooking = mergeWithMovieData(location.state.latestBooking);
        setBookings([mergedBooking]);
        setIsLoading(false);

        if (location.state.success) {
          toast.success(
            location.state.message || "Booking confirmed successfully!"
          );
        }
        return;
      }

      const res = await axios.get(`${API_URL}/checkout`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const mergedBookings = res.data.data.map((booking) =>
          mergeWithMovieData(booking)
        );
        setBookings(mergedBookings);
      } else {
        toast.error(res.data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const mergeWithMovieData = (booking) => {
    const matchedMovie = moviesData.find(
      (movie) =>
        movie._id === booking.movieId || movie.title === booking.movieTitle
    );

    return {
      ...booking,
      movieTitle: matchedMovie?.title || booking.movieTitle,
      poster_path:
        matchedMovie?.backdrop_path ||
        matchedMovie?.poster_path ||
        booking.poster_path,
      backdrop_path: matchedMovie?.backdrop_path || booking.backdrop_path,
      runtime: matchedMovie?.runtime || booking.runtime,
      genres: matchedMovie?.genres || booking.genres,
      release_date: matchedMovie?.release_date || booking.release_date,
      vote_average: matchedMovie?.vote_average || booking.vote_average,
      time: booking.time,
      seats: booking.seats,
      totalAmount: booking.totalAmount,
      showDate: booking.showDate,
      isPaid: booking.isPaid,
      _id: booking._id,
    };
  };

  useEffect(() => {
    getMyBookings();
  }, [location.state]);

  const showAllBookings = () => {
    navigate("/my-bookings", { replace: true });
    window.location.reload();
  };

  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <Toaster position="top-center" />
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">
          {location.state?.latestBooking
            ? "Your Latest Booking"
            : "My Bookings"}
        </h1>
      </div>

      {isLoading && (
        <div className="text-center text-gray-400 mt-10">
          <p>Loading your bookings...</p>
        </div>
      )}

      {!isLoading && bookings.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          <p>No bookings found</p>
          <p className="text-sm">Book your first ticket to see it here!</p>
        </div>
      )}

      {bookings.map((item, index) => (
        <div
          key={item._id || index}
          className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
        >
          <div className="flex flex-col md:flex-row">
            <img
              src={
                item.poster_path ||
                item.moviePoster ||
                assets.poster_placeholder
              }
              alt={item.movieTitle}
              className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
            />
            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">{item.movieTitle}</p>
              <p className="text-gray-400 text-sm">
                {timeFormat(item.runtime)}
              </p>
              <p className="text-gray-400 text-sm">Show Time: {item.time}</p>
              <p className="text-gray-400 text-sm mt-auto">
                {dateFormat(item.showDate)}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end md:text-right justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold mb-3">
                {currency}
                {item.totalAmount}
              </p>

              {!item.isPaid && (
                <button className="flex items-center gap-2 px-8 py-3 bg-[#e64949] hover:bg-[#d13c3c] transition rounded-full font-semibold text-white text-sm shadow-md active:scale-95">
                  Pay Now
                </button>
              )}
            </div>

            <div className="text-sm">
              <p>
                <span className="text-gray-400">Total Tickets:</span>{" "}
                {item.seats?.length || 0}
              </p>
              <p>
                <span className="text-gray-400">Seat Number:</span>{" "}
                {item.seats?.join(", ") || "N/A"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
