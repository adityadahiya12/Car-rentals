import React, { useState, useEffect } from "react";
import axios from "axios";
import { dummyMyBookingsData, assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useApp } from "../../context/AppContext";

const ManageBooking = () => {
  const { backendUrl, token } = useApp();
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOwnerBookings = async () => {
    if (!token) {
      setBookings(dummyMyBookingsData);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/owner/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success && data.bookings && data.bookings.length > 0) {
        setBookings(data.bookings);
      } else {
        setBookings(data.bookings?.length === 0 ? [] : dummyMyBookingsData);
      }
    } catch (err) {
      console.log("Error loading bookings:", err.message);
      setBookings(dummyMyBookingsData);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    if (!token) {
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/owner/change-status`,
        { bookingId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.log("Failed to update status:", err.message);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, [token]);

  return (
    <div className="px-4 pt-10 md:px-10 w-full mb-16">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking status."
      />

      <table className="w-full border-collapse text-left text-sm text-gray-600 mt-6">
        <thead className="text-gray-500 bg-gray-50 border-b border-borderColor">
          <tr>
            <th className="p-3 font-medium">Car</th>
            <th className="p-3 font-medium max-md:hidden">Customer</th>
            <th className="p-3 font-medium max-md:hidden">Date Range</th>
            <th className="p-3 font-medium">Total</th>
            <th className="p-3 font-medium">Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking._id || index} className="border-t border-borderColor hover:bg-gray-50/50">
              <td className="p-3 flex items-center gap-3">
                <img
                  src={booking.car?.image || assets.main_car}
                  alt=""
                  className="h-12 w-12 aspect-square rounded-md object-cover"
                />
                <p className="font-medium">
                  {booking.car?.brand || "Car"} {booking.car?.model || ""}
                </p>
              </td>

              <td className="p-3 max-md:hidden">
                <p className="font-medium text-gray-800">{booking.user?.name || "Customer"}</p>
                <p className="text-xs text-gray-400">{booking.user?.email || ""}</p>
              </td>

              <td className="p-3 max-md:hidden">
                {booking.pickupDate ? String(booking.pickupDate).split("T")[0] : "N/A"} to{" "}
                {booking.returnDate ? String(booking.returnDate).split("T")[0] : "N/A"}
              </td>

              <td className="p-3 font-medium text-primary">
                {currency}{booking.price}
              </td>

              <td className="p-3">
                <select
                  value={booking.status || "pending"}
                  onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border outline-none cursor-pointer ${
                    booking.status === "confirmed"
                      ? "bg-green-50 text-green-600 border-green-200"
                      : booking.status === "cancelled"
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-yellow-50 text-yellow-600 border-yellow-200"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {bookings.length === 0 && (
        <p className="text-center py-10 text-gray-400">No bookings found yet.</p>
      )}
    </div>
  );
};

export default ManageBooking;
