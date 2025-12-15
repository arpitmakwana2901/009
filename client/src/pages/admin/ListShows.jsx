import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_URL } from "../../App";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllShows = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/shows/getShows`
      );

      if (res.data.data) {
        setShows(res.data.data);
      } else {
        setShows([]);
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
      toast.error("Failed to load shows");
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllShows();
  }, []);

  return (
    <>
      <Title text1="List" text2="Shows" />

      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-[#3b0d0d] text-left text-white">
              <th className="p-3 font-medium pl-5">Movie Name</th>
              <th className="p-3 font-medium">Show Time Count</th>
              <th className="p-3 font-medium">Total Bookings</th>
              <th className="p-3 font-medium">Earnings</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {loading && (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Loading shows...
                </td>
              </tr>
            )}

            {!loading && shows.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No shows found
                </td>
              </tr>
            )}

            {shows.map((show, index) => {
              // Calculate total seats booked
              const totalBookings = show?.occupiedSeats
                ? Object.keys(show.occupiedSeats).length
                : 0;

              return (
                <tr
                  key={index}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
                >
                  <td className="p-2 min-w-45 pl-5">{show.title}</td>

                  {/* Total shows created */}
                  <td className="p-2">
                    {Object.values(show.showDates || {}).flat().length}
                  </td>

                  {/* Total seats */}
                  <td className="p-2">{totalBookings}</td>

                  {/* Total earnings */}
                  <td className="p-2">
                    {currency} {totalBookings * (show.price || 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListShows;
