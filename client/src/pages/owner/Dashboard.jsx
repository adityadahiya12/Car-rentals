import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets, dummyDashboardData } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useApp } from "../../context/AppContext";

const Dashboard = () => {
  const { backendUrl, token } = useApp();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const fetchDashboard = async () => {
    if (!token) {
      setData(dummyDashboardData);
      return;
    }
    try {
      const res = await axios.get(`${backendUrl}/api/owner/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.dashboardData) {
        setData(res.data.dashboardData);
      } else {
        setData(dummyDashboardData);
      }
    } catch (err) {
      console.log("Error loading dashboard data:", err.message);
      setData(dummyDashboardData);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [token]);
  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.check_icon },
  ];

  return (
    <div className="px-4 pt-10 md:px-10 flex-1 mb-16">
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue and recent activities"
      />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor bg-white"
          >
            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <img src={card.icon} alt="" className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        {/* recent Booking */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full bg-white">
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-gray-500 text-sm">Latest Customer Bookings</p>
          {data.recentBookings.length > 0 ? (
            data.recentBookings.map((booking, index) => (
              <div key={index} className="mt-4 flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0">
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <img src={assets.listIconColored} alt="" className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800">
                      {booking.car?.brand || "Car"} {booking.car?.model || ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.createdAt ? String(booking.createdAt).split("T")[0] : "Recent"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <p className="text-sm text-gray-600">{currency}{booking.price}</p>
                  <p className={`px-2.5 py-0.5 border rounded-full text-xs capitalize ${
                    booking.status === "confirmed"
                      ? "border-green-300 text-green-600 bg-green-50"
                      : "border-yellow-300 text-yellow-600 bg-yellow-50"
                  }`}>
                    {booking.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 mt-4">No recent bookings found.</p>
          )}
        </div>
        {/* monthlyRevenue */}
        <div className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs bg-white">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500 text-sm">Revenue for Current Month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">{currency}{data.monthlyRevenue}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;