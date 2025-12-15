import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "./../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { API_URL } from "../App";
import { useAuth } from "../components/context/AuthContext";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moviesData, setMoviesData] = useState([]);
  const location = useLocation();
  const { token: authToken } = useAuth();
  const navigate = useNavigate();

  const fetchMoviesData = async () => {
    try {
      const res = await axios.get(`${API_URL}/shows/getShows`);
      setMoviesData(res.data.data || []);
    } catch (error) {
      console.error(error);
      setMoviesData([]);
    }
  };

  const mergeWithMovieData = (booking) => {
    const movie = moviesData.find(
      (m) => m._id === booking.movieId || m.title === booking.movieTitle
    );

    return {
      ...booking,
      movieTitle: movie?.title || booking.movieTitle,
      poster_path:
        movie?.backdrop_path || movie?.poster_path || booking.poster_path,
      runtime: movie?.runtime || booking.runtime,
    };
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
        setBookings([mergeWithMovieData(location.state.latestBooking)]);
        toast.success(location.state.message);
        setIsLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/checkout`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setBookings(res.data.data.map(mergeWithMovieData));
      } else {
        toast.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyBookings();
  }, [location.state]);

  const handlePayNow = async (booking) => {
    try {
      const token = localStorage.getItem("token") || authToken;
      if (!token) {
        toast.error("Please login to pay");
        return;
      }

      const bookingId = booking?._id;
      if (!bookingId) {
        toast.error("Invalid booking id");
        return;
      }

      const res = await axios.post(
        `${API_URL}/stored/pay-now/${bookingId}`,
        {
          paymentId: "PAY_" + Date.now(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Payment Successful 🎉");

        navigate("/done-payment", {
          state: {
            booking: res.data.data,
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    }
  };

  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <Toaster position="top-center" />
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">My Bookings</h1>
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
              src={item.poster_path || assets.poster_placeholder}
              alt={item.movieTitle}
              className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
            />

            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">{item.movieTitle}</p>
              <p className="text-gray-400 text-sm">
                {timeFormat(item.runtime)}
              </p>
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
                <button
                  onClick={() => handlePayNow(item)}
                  className="flex items-center gap-2 px-8 py-3 bg-[#e64949] hover:bg-[#d13c3c] transition rounded-full font-semibold text-white text-sm shadow-md active:scale-95"
                >
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
