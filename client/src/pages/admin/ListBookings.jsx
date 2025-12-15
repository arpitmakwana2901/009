import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import axios from "axios";
import { dateFormat } from "./../../lib/dateFormat";
import { toast } from "react-hot-toast";
import { API_URL } from "../../App";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/all-bookings`
      );

      if (res.data.success) {
        setBookings(res.data.data);
      } else {
        toast.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Backend error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-[#2b0b0b] text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {bookings.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/20 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-45 pl-5">
                  {item.userId?.userName || "Unknown User"}
                </td>

                <td className="p-2">{item.movieTitle}</td>

                <td className="p-2">
                  {dateFormat(item.selectedDate)} - {item.time}
                </td>

                <td className="p-2">
                  {item.seats?.length ? item.seats.join(", ") : "N/A"}
                </td>

                <td className="p-2">
                  {currency} {item.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default ListBookings;
