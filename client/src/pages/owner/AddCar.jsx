import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { assets, cityList } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useApp } from "../../context/AppContext";

const AddCar = () => {
  const { backendUrl, token, fetchCars } = useApp();
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    pricePerDay: "",
    category: "Sedan",
    transmission: "Automatic",
    fuel_type: "Petrol",
    seating_capacity: 4,
    location: "New York",
    description: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });

    if (!token) {
      setMessage({ text: "Please login with an owner account first.", isError: true });
      return;
    }

    if (!image) {
      setMessage({ text: "Please select an image for your car.", isError: true });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", image);
      formData.append(
        "carData",
        JSON.stringify({
          brand: car.brand,
          model: car.model,
          year: Number(car.year),
          price_per_day: Number(car.pricePerDay),
          category: car.category,
          transmission: car.transmission,
          fuel_type: car.fuel_type,
          seating_capacity: String(car.seating_capacity),
          location: car.location,
          description: car.description,
        })
      );

      const { data } = await axios.post(`${backendUrl}/api/owner/add-car`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setMessage({ text: "Car listed successfully!", isError: false });
        setImage(null);
        setCar({
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          pricePerDay: "",
          category: "Sedan",
          transmission: "Automatic",
          fuel_type: "Petrol",
          seating_capacity: 4,
          location: "New York",
          description: "",
        });
        fetchCars();
        setTimeout(() => {
          navigate("/owner/manage-cars");
        }, 1200);
      } else {
        setMessage({ text: data.message || "Failed to list car", isError: true });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message || "Error listing car", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability and car specifications."
      />

      {message.text && (
        <div className={`mt-4 max-w-xl p-3 rounded-lg text-sm ${message.isError ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {message.text}
        </div>
      )}

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >
        {/* Car Image */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt="upload car"
              className="h-16 w-24 object-cover border border-dashed border-gray-300 rounded cursor-pointer p-1"
            />
            <input
              type="file"
              id="car-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p className="text-sm text-gray-500">
            {image ? image.name : "Click to upload a picture of your car"}
          </p>
        </div>

        {/* Car brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Brand</label>
            <input
              type="text"
              placeholder="eg. BMW, Mercedes, Audi..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-700"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Model</label>
            <input
              type="text"
              placeholder="eg. X5, E-Class, M4..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-700"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* Car Year , Price , Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Year</label>
            <input
              type="number"
              placeholder="eg. 2024"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-700"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>

          <div className="flex flex-col w-full">
            <label>Daily Price ({currency})</label>
            <input
              type="number"
              placeholder="eg. 150"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-700"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>

          <div className="flex flex-col w-full">
            <label>Category</label>
            <select
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              value={car.category}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-700"
            >
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Coupe">Coupe</option>
            </select>
          </div>
        </div>

        {/* Car transmission , fuel_type , seating_capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Transmission</label>
            <select
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              value={car.transmission}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-700"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label>Fuel Type</label>
            <select
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              value={car.fuel_type}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-700"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="CNG">CNG</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label>Seating Capacity</label>
            <input
              type="number"
              placeholder="eg. 4"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-700"
              value={car.seating_capacity}
              onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
            />
          </div>
        </div>

        {/* Car Location */}
        <div className="flex flex-col w-full">
          <label>Location</label>
          <select
            onChange={(e) => setCar({ ...car, location: e.target.value })}
            value={car.location}
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-700"
          >
            {cityList.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Car Description */}
        <div className="flex flex-col w-full">
          <label>Description</label>
          <textarea
            rows={4}
            placeholder="eg. A luxurious SUV with a spacious interior and smooth ride..."
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-gray-700"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          ></textarea>
        </div>

        <button 
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 mt-2 bg-primary hover:bg-primary-dull disabled:opacity-50 transition text-white rounded-md font-medium w-max cursor-pointer"
        >
          <img src={assets.tick_icon} alt="" />
          {loading ? "Uploading & Listing..." : "List Your Car"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
