import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Cars = () => {
  const [searchParams] = useSearchParams();

  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const [input, setInput] = useState("");

  // ✅ FIXED: use api instead of axios
  const { cars, axios } = useAppContext();

  const isSearchData = pickupLocation && pickupDate && returnDate;

  const [filteredCars, setFilteredCars] = useState([]);

  // ✅ SEARCH API
  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        const result = data.availableCars || data.cars || [];
        setFilteredCars(result);

        if (result.length === 0) {
          toast("Oops! No cars available", { icon: "😞" });
        }
      } else {
        setFilteredCars([]);
      }
    } catch (error) {
      console.error("Error fetching car availability:", error);
      setFilteredCars([]);
    }
  };

  // ✅ RUN WHEN URL PARAMS CHANGE
  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    }
  }, [pickupLocation, pickupDate, returnDate]);

  // ✅ BASE DATA (API or ALL CARS)
  const baseCars = isSearchData ? filteredCars : cars;

  // ✅ INPUT SEARCH FILTER (ALWAYS APPLIED)
  const displayCars = baseCars.filter((car) => {
    return (
      car.brand?.toLowerCase().includes(input.toLowerCase()) ||
      car.model?.toLowerCase().includes(input.toLowerCase()) ||
      car.category?.toLowerCase().includes(input.toLowerCase()) ||
      car.transmission?.toLowerCase().includes(input.toLowerCase())
    );
  });

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles"
        />

        {/* SEARCH BAR */}
        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} className="w-4.5 h-4.5 mr-2" />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search by make, model, category..."
            className="w-full h-full outline-none text-gray-500"
          />

          <img src={assets.filter_icon} className="w-4.5 h-4.5 ml-2" />
        </div>
      </div>

      {/* COUNT */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {displayCars.length} Cars
        </p>
      </div>

      {/* CARS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
        {displayCars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default Cars;