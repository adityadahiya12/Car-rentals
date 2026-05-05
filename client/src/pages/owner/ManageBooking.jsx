import React, { useState, useEffect } from "react";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageBooking = () => {
  const { axios, currency } = useAppContext();

  const [bookings, setBookings] = useState([]);

  // ============================
  // ✅ FETCH BOOKINGS
  // ============================
  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/owner");

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching owner bookings:", error);
      toast.error("Failed to load bookings");
    }
  };

  // ============================
  // ✅ CHANGE STATUS (FIXED)
  // ============================
  const changeBookingStatus = async (bookingId, Status) => {
    try {
      const { data } = await axios.post(
        "/api/bookings/change-status",
        {
          bookingId,           // ✅ FIXED
          status: Status       // ✅ FIXED
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings(); // refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error(error.message);
    }
  };

  // ============================
  // ✅ LOAD DATA
  // ============================
  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking status."
      />

      <table className="w-full border-collapse text-left text-sm text-gray-600 mt-6">
        <thead className="text-gray-500">
          <tr>
            <th className="p-3 font-medium">Car</th>
            <th className="p-3 font-medium max-md:hidden">Date Range</th>
            <th className="p-3 font-medium">Total</th>
            <th className="p-3 font-medium max-md:hidden">Payment</th>
            <th className="p-3 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <tr key={index} className="border-t border-borderColor">
                
                {/* Car Info */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={booking.car.image}
                    alt=""
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <p className="font-medium max-md:hidden">
                    {booking.car.brand} {booking.car.model}
                  </p>
                </td>

                {/* Date Range */}
                <td className="p-3 max-md:hidden">
                  {booking.pickupDate.split("T")[0]} to{" "}
                  {booking.returnDate.split("T")[0]}
                </td>

                {/* Price */}
                <td className="p-3">
                  {currency} {booking.price}
                </td>

                {/* Payment */}
                <td className="p-3 max-md:hidden">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    offline
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3">
                  {booking.status === "pending" ? (
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        changeBookingStatus(booking._id, e.target.value)
                      }
                      className="px-2 py-1.5 text-gray-500 border border-borderColor rounded-md outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-5 text-gray-400">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBooking;