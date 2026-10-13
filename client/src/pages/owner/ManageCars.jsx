import React, { useEffect, useState } from "react";
import axios from "axios";
import { dummyCarData, assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useApp } from "../../context/AppContext";

const ManageCars = () => {
  const { backendUrl, token, fetchCars } = useApp();
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOwnerCars = async () => {
    if (!token) {
      setCars(dummyCarData);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/owner/cars`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success && data.cars && data.cars.length > 0) {
        setCars(data.cars);
      } else {
        setCars(data.cars?.length === 0 ? [] : dummyCarData);
      }
    } catch (err) {
      console.log("Error loading owner cars:", err.message);
      setCars(dummyCarData);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (carId) => {
    if (!token) {
      setCars((prev) =>
        prev.map((c) =>
          c._id === carId
            ? { ...c, availability_status: !(c.availability_status ?? c.isAvaliable), isAvaliable: !(c.availability_status ?? c.isAvaliable) }
            : c
        )
      );
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/owner/toggle-car`,
        { carId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setCars((prev) =>
          prev.map((c) =>
            c._id === carId
              ? { ...c, availability_status: data.availability_status, isAvaliable: data.availability_status }
              : c
          )
        );
        fetchCars();
      }
    } catch (err) {
      console.log("Toggle failed:", err.message);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to remove this car?")) return;
    if (!token) {
      setCars((prev) => prev.filter((c) => c._id !== carId));
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/owner/delete-car`,
        { carId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setCars((prev) => prev.filter((c) => c._id !== carId));
        fetchCars();
      }
    } catch (err) {
      console.log("Delete failed:", err.message);
    }
  };

  useEffect(() => {
    fetchOwnerCars();
  }, [token]);

  return (
    <div className="px-4 pt-10 md:px-10 w-full mb-16">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform"
      />

      <table className="w-full border-collapse text-left text-sm text-gray-600 mt-6">
        <thead className="text-gray-500 bg-gray-50 border-b border-borderColor">
          <tr>
            <th className="p-3 font-medium">Car</th>
            <th className="p-3 font-medium max-md:hidden">Category</th>
            <th className="p-3 font-medium">Price</th>
            <th className="p-3 font-medium max-md:hidden">Status</th>
            <th className="p-3 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {cars.map((car, index) => {
            const isAvailable = car.availability_status ?? car.isAvaliable ?? true;
            return (
              <tr key={car._id || index} className="border-t border-borderColor hover:bg-gray-50/50">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image || assets.main_car}
                    alt=""
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />

                  <div>
                    <p className="font-medium text-gray-800">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {car.seating_capacity} seats • {car.category}
                    </p>
                  </div>
                </td>

                <td className="p-3 max-md:hidden">{car.category}</td>

                <td className="p-3">
                  {currency}
                  {car.price_per_day || car.pricePerDay}/day
                </td>

                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isAvailable
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      title={isAvailable ? "Mark Unavailable" : "Mark Available"}
                      onClick={() => toggleAvailability(car._id)}
                      className="cursor-pointer p-1 hover:bg-gray-100 rounded"
                    >
                      <img
                        src={isAvailable ? assets.eye_icon : assets.eye_close_icon}
                        alt="toggle"
                        className="w-5 h-5 opacity-70 hover:opacity-100"
                      />
                    </button>
                    <button
                      title="Delete Car"
                      onClick={() => handleDeleteCar(car._id)}
                      className="cursor-pointer p-1 hover:bg-red-50 rounded"
                    >
                      <img src={assets.delete_icon} alt="delete" className="w-5 h-5 opacity-70 hover:opacity-100" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {cars.length === 0 && (
        <p className="text-center py-10 text-gray-400">No cars listed yet. Click 'Add car' to list your first car.</p>
      )}
    </div>
  );
};

export default ManageCars;
