import React, { useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const AddCar = () => {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    // ✅ Validation
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      formData.append(
        "carData",
        JSON.stringify({
          ...car,
          price_per_day: car.pricePerDay, // match backend
        })
      );

      const { data } = await axios.post("/api/owner/add-car", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success(data.message);

        // ✅ Reset form
        setImage(null);
        setCar({
          brand: "",
          model: "",
          year: "",
          pricePerDay: "",
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: "",
          location: "",
          description: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding car");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >
        {/* Image Upload */}
        <div className="flex items-center gap-2">
          <label htmlFor="car-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt=""
              className="h-14 rounded cursor-pointer"
            />
            <input
              type="file"
              id="car-image"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p>Upload car image</p>
        </div>

        {/* Brand & Model */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Brand"
            value={car.brand}
            onChange={(e) => setCar({ ...car, brand: e.target.value })}
            className="input"
            required
          />
          <input
            placeholder="Model"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
            className="input"
            required
          />
        </div>

        {/* Year & Price */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Year"
            value={car.year}
            onChange={(e) => setCar({ ...car, year: e.target.value })}
            className="input"
            required
          />
          <input
            type="number"
            placeholder={`Price (${currency})`}
            value={car.pricePerDay}
            onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            className="input"
            required
          />
        </div>

        {/* Category */}
        <select
          value={car.category}
          onChange={(e) => setCar({ ...car, category: e.target.value })}
          className="input"
          required
        >
          <option value="">Select Category</option>
          <option>Sedan</option>
          <option>SUV</option>
          <option>Hatchback</option>
        </select>

        {/* Transmission */}
        <select
          value={car.transmission}
          onChange={(e) => setCar({ ...car, transmission: e.target.value })}
          className="input"
          required
        >
          <option value="">Transmission</option>
          <option>Automatic</option>
          <option>Manual</option>
        </select>

        {/* Fuel */}
        <select
          value={car.fuel_type}
          onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
          className="input"
          required
        >
          <option value="">Fuel</option>
          <option>Petrol</option>
          <option>Diesel</option>
          <option>Electric</option>
        </select>

        {/* Seating */}
        <input
          type="number"
          placeholder="Seating Capacity"
          value={car.seating_capacity}
          onChange={(e) =>
            setCar({ ...car, seating_capacity: e.target.value })
          }
          className="input"
          required
        />

        {/* Location */}
        <input
          placeholder="Location"
          value={car.location}
          onChange={(e) => setCar({ ...car, location: e.target.value })}
          className="input"
          required
        />

        {/* Description */}
        <textarea
          rows={4}
          placeholder="Description"
          value={car.description}
          onChange={(e) => setCar({ ...car, description: e.target.value })}
          className="input"
          required
        />

        <button
          disabled={isLoading}
          className="bg-primary text-white py-2 rounded flex items-center gap-2 px-4 mt-4 bg-primary text white py-2 rounded-md font-medium w-max cursor-pointer"
        >
          <img src= {assets.tick_icon} alt=""/>

          {isLoading ? "Listing..." : "Add Car"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;