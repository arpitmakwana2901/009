import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_URL } from "../../App";
import { useAuth } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchAllShows = async () => {
    try {
      // Admin endpoint provides computed totals
      const res = await axios.get(`${API_URL}/admin/shows-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setShows(res.data.data || []);
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

  const handleToggleStatus = async (show) => {
    try {
      const nextStatus = show.status === "active" ? "inactive" : "active";
      await axios.patch(
        `${API_URL}/shows/${show._id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchAllShows();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteShow = async (show) => {
    const ok = window.confirm(`Delete show: ${show.title}?`);
    if (!ok) return;

    try {
      await axios.delete(`${API_URL}/shows/${show._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Show deleted");
      setShows((prev) => prev.filter((s) => s._id !== show._id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete show");
    }
  };

  return (
    <>
      <Title text1="List" text2="Shows" />

      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-[#3b0d0d] text-left text-white">
              <th className="p-3 font-medium pl-5">Movie Name</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Total Bookings</th>
              <th className="p-3 font-medium">Earnings</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {loading && (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Loading shows...
                </td>
              </tr>
            )}

            {!loading && shows.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  No shows found
                </td>
              </tr>
            )}

            {shows.map((show, index) => {
              const totalBookings = show?.totalBookings || 0;
              const earnings = show?.earnings || 0;

              return (
                <tr
                  key={index}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
                >
                  <td className="p-2 min-w-45 pl-5">{show.title}</td>

                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        show.status === "inactive"
                          ? "bg-gray-700 text-gray-200"
                          : "bg-green-700 text-white"
                      }`}
                    >
                      {show.status || "active"}
                    </span>
                  </td>

                  {/* Total bookings */}
                  <td className="p-2">{totalBookings}</td>

                  {/* Total earnings */}
                  <td className="p-2">
                    {currency} {earnings}
                  </td>

                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit-show/${show._id}`)}
                        className="px-3 py-1 rounded bg-[#2a0f0f] hover:bg-[#3a1a1a] text-white text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(show)}
                        className="px-3 py-1 rounded bg-[#2a0f0f] hover:bg-[#3a1a1a] text-white text-xs"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => handleDeleteShow(show)}
                        className="px-3 py-1 rounded bg-red-700 hover:bg-red-800 text-white text-xs"
                      >
                        Delete
                      </button>
                    </div>
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
