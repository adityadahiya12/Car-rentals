import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);

  // ✅ Fetch cars
  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching owner cars:", error);
      toast.error("Failed to load cars");
    }
  };

  useEffect(() => {
    if (isOwner) fetchOwnerCars();
  }, [isOwner]);

  // ✅ Toggle availability
  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId });

      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars(); // refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating car");
    }
  };

  // ✅ Delete car
  const deleteCar = async (carId) => {
    try {
      const confirmDelete = window.confirm("Are you sure?");
      if (!confirmDelete) return;

      const { data } = await axios.post("/api/owner/delete-car", { carId });

      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting car");
    }
  };

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update or remove them"
      />

      <table className="w-full border-collapse text-left text-sm text-gray-600 mt-6">
        <thead className="text-gray-500">
          <tr>
            <th className="p-3 font-medium">Car</th>
            <th className="p-3 font-medium max-md:hidden">Category</th>
            <th className="p-3 font-medium">Price</th>
            <th className="p-3 font-medium max-md:hidden">Status</th>
            <th className="p-3 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {cars.map((car) => (
            <tr key={car._id} className="border-t border-borderColor">
              {/* Car Info */}
              <td className="p-3 flex items-center gap-3">
                <img
                  src={car.image}
                  alt=""
                  className="h-12 w-12 rounded-md object-cover"
                />

                <div>
                  <p className="font-medium">
                    {car.brand} {car.model}
                  </p>
                  <p className="text-xs text-gray-500">
                    {car.seating_capacity} • {car.category}
                  </p>
                </div>
              </td>

              {/* Category */}
              <td className="p-3 max-md:hidden">{car.category}</td>

              {/* Price */}
              <td className="p-3">
                {currency}
                {car.price_per_day}/day
              </td>

              {/* Status */}
              <td className="p-3 max-md:hidden">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    car.isAvailable
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {car.isAvailable ? "Available" : "Unavailable"}
                </span>
              </td>

              {/* Actions */}
              <td className="p-3 flex items-center gap-3">
                {/* Toggle */}
                <img
                  onClick={() => toggleAvailability(car._id)}
                  src={
                    car.isAvailable
                      ? assets.eye_close_icon
                      : assets.eye_icon
                  }
                  alt="toggle"
                  className="cursor-pointer w-5"
                />

                {/* Delete */}
                <img
                  onClick={() => deleteCar(car._id)}
                  src={assets.delete_icon}
                  alt="delete"
                  className="cursor-pointer w-5"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCars;