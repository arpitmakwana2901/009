import React, { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../App";

const AdminSidebar = () => {
  const [sidebarData, setSidebarData] = useState(null);

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const res = await axios.get(`${API_URL}/adminSidebar`);
        setSidebarData(res.data);
      } catch (err) {
        console.error("🚨 Error loading sidebar:", err);
      }
    };
    fetchSidebar();
  }, []);

  if (!sidebarData)
    return (
      <p className="text-center text-gray-400 mt-10 animate-pulse">
        Loading Sidebar...
      </p>
    );

  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm bg-black">
      {/* 👤 Profile Image */}
      <img
        className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
        src={sidebarData.user.imageUrl}
        alt="sidebar"
      />

      {/* 🧑 Name */}
      <p className="mt-2 text-base max-md:hidden text-white">
        {sidebarData.user.firstName} {sidebarData.user.lastName}
      </p>

      {/* 🧭 Navigation Links */}
      <div className="w-full">
        {sidebarData.navlinks.map((link, index) => {
          const Icon = Icons[link.icon] || Icons.LayoutDashboardIcon;
          return (
            <NavLink
              key={index}
              to={link.path}
              end
              className={({ isActive }) =>
                `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 md:pl-10 first:mt-6
                ${
                  isActive
                    ? "bg-[#2A0A0A] text-[#FF5F5F]"
                    : "text-gray-400 hover:bg-[#1A0505] hover:text-[#FF5F5F]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />
                  <p className="max-md:hidden">{link.name}</p>
                  {isActive && (
                    <span className="w-1.5 h-10 rounded-l right-0 absolute bg-[#FF5F5F]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSidebar;
