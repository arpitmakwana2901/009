import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../components/context/AuthContext";
import axios from "axios"; // Add this import
import { API_URL } from "../App";

const DonePayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const booking = state?.booking;

  if (!booking) {
    toast.error("Invalid booking data");
    navigate("/");
    return null;
  }

  const handlePayment = async () => {
    if (!userData) {
      toast.error("Please login to continue");
      navigate("/auth");
      return;
    }

    try {
      // API call to backend to save payment
      const response = await axios.post(`${API_URL}/payments`, {
        userId: userData._id, // Assume userData me _id hai from auth
        bookingId: booking._id,
        movieTitle: booking.movieTitle,
        seats: booking.seats,
        totalAmount: booking.totalAmount,
      });

      if (response.status === 201) {
        toast.success("🎉 Payment Successful and saved to database!");

        navigate("/my-bookings", {
          state: {
            success: true,
            bookingId: booking._id,
            message: "Booking confirmed successfully!",
          },
          replace: true,
        });
      }
    } catch (error) {
      toast.error("Payment failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Confirm Booking</h2>

        <div className="space-y-2 mb-6">
          <p>
            <span className="text-gray-400">Movie:</span> {booking.movieTitle}
          </p>

          <p>
            <span className="text-gray-400">Seats:</span>{" "}
            {Array.isArray(booking.seats)
              ? booking.seats.join(", ")
              : booking.seats}
          </p>

          <p>
            <span className="text-gray-400">Amount:</span> ₹
            {booking.totalAmount}
          </p>
        </div>

        <button
          onClick={handlePayment}
          className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
        >
          Confirm Payment
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DonePayment;
