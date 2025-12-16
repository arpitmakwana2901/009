import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../components/context/AuthContext";
import axios from "axios";
import { API_URL } from "../App";

const DonePayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  console.log(token, "token");
  const booking = state?.booking;

  if (!booking) {
    toast.error("Invalid booking data");
    navigate("/");
    return null;
  }

  const handlePayment = async () => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/auth");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/payments/api`,
        {
          bookingId: booking._id,

          movieTitle: booking.movieTitle,
          seats: booking.seats,
          totalAmount: booking.totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PAYMENT RESPONSE:", res.data);
      console.log(booking, "bookingId");

      if (res.data.success) {
        // toast.success("🎉 Payment Successful!");

        navigate("/my-bookings", {
          state: {
            latestBooking: {
              ...booking,
              isPaid: true,
            },
            message: "Booking confirmed successfully!",
          },
          replace: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Payment failed");
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
            {booking.seats.join(", ")}
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
