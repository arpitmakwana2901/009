import React, { useState } from "react";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import toast from "react-hot-toast";
import { API_URL } from "../App";
const DateSelect = ({ dateTime, movieId }) => {
  const [selected, setSelected] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const onBookHandler = async () => {
    if (!selected) {
      toast.error("Please select a date first!");
      return;
    }

    if (!token) {
      toast.error("Please login first!");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/book-ticket`,
        { movieId, selectedDate: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(res.data.message);

      toast.success(res.data.message || "Date selected successfully!");

      navigate(`/movies/${movieId}/${selected}`);
    } catch (err) {
      console.error(err.message);

      toast.error(err.response?.data?.error || "Booking failed");
    }
  };

  return (
    <div
      id="dateSelect"
      className="flex justify-center w-full p-4 md:items-center"
    >
      <div className="flex flex-col items-center justify-between gap-6 md:gap-10 relative p-6 bg-primary/10 border border-primary/20 rounded-lg w-full max-w-4xl md:flex-row md:p-8">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        <div className="w-full md:w-auto text-white">
          <p className="text-lg font-semibold mb-4 md:mb-0">Choose Date</p>

          <div className="flex items-center gap-2 md:gap-6 text-sm mt-5 w-full">
            <ChevronLeftIcon
              width={28}
              className="text-gray-400 cursor-pointer hidden md:block"
            />

            <div className="flex overflow-x-auto whitespace-nowrap gap-3 py-1 px-1 -mx-1 w-full custom-scrollbar">
              {Object.keys(dateTime).map((date) => (
                <button
                  onClick={() => setSelected(date)}
                  key={date}
                  className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded shrink-0 transition cursor-pointer text-sm ${
                    selected === date
                      ? "bg-primary text-white"
                      : "border border-primary/70 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span className="text-base font-semibold">
                    {new Date(date).getDate()}
                  </span>
                  <span className="text-xs">
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                </button>
              ))}
            </div>

            <ChevronRightIcon
              width={28}
              className="text-gray-400 cursor-pointer hidden md:block"
            />
          </div>
        </div>

        <button
          onClick={onBookHandler}
          className="bg-primary text-white px-8 py-3 mt-4 md:mt-0 rounded-lg hover:bg-primary/90 transition-all cursor-pointer w-full md:w-auto font-semibold"
        >
          Book Now
        </button>
      </div>{" "}
    </div>
  );
};

export default DateSelect;
