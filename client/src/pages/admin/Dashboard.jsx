import {
  ChartLineIcon,
  CircleDollarSign,
  PlayCircleIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import { dateFormat } from "../../lib/dateFormat";
import { API_URL } from "../../App";

const Dashboard = () => {
  const currency = "₹";

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ Dashboard card data
  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || "0",
      Icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: currency + (dashboardData.totalRevenue || "0"),
      Icon: CircleDollarSign,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows?.length || "0",
      Icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      Icon: UsersIcon,
    },
  ];

  // ✅ Fetch data from backend
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/adminDashboard`
      );

      if (res.data.success) {
        setDashboardData(res.data.data);
        console.log("✅ Dashboard data:", res.data.data);
      } else {
        console.error("❌ Dashboard fetch failed:", res.data.message);
      }
    } catch (err) {
      console.error("⚠️ Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Loading state
  if (loading) {
    return <div className="text-center text-gray-400 mt-10">Loading...</div>;
  }

  return (
    <>
      {/* Title Section */}
      <Title text1="Admin" text2="Dashboard" />

      {/* Top Summary Cards */}
      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0" />
        <div className="flex flex-wrap gap-4 w-full">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md w-full sm:w-[200px] text-white"
            >
              <div>
                <h1 className="text-sm">{card.title}</h1>
                <p className="text-xl font-medium mt-1">{card.value}</p>
              </div>
              <card.Icon className="w-6 h-6" />
            </div>
          ))}
        </div>
      </div>

      {/* Active Shows Section */}
      <p className="mt-10 text-lg font-medium">Active Shows</p>
      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
        <BlurCircle top="100px" left="-10%" />
        {dashboardData.activeShows && dashboardData.activeShows.length > 0 ? (
          dashboardData.activeShows.map((show) => (
            <div
              key={show._id}
              className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300"
            >
              <img
                src={show.backdrop_path || "/default-poster.jpg"}
                alt={show.title}
                className="h-60 w-full object-cover"
              />
              <p className="font-medium p-2 truncate">{show.title}</p>
              <div className="flex items-center justify-between px-2">
                <p className="text-lg font-medium">
                  {currency} {show.runtime ? show.runtime * 10 : 100}
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {show.vote_average?.toFixed(1) || "0.0"}
                </p>
              </div>
              <p className="px-2 pt-2 text-sm text-gray-500">
                {dateFormat(show.release_date)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No active shows available.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
