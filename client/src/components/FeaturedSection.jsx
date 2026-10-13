import React from "react";
import Title from "./Title";
import CarCard from "./CarCard";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { cars } = useApp();

  return (
    <div className="flex flex-col items-center py-24 px-6 md:px-15 lg:px-24 xl:px-32">
      <Title
        title="Featured Vehicles"
        subTitle="Discover premium rides with Dahiya Car Rentals — your journey begins here."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {cars.slice(0, 6).map((car, index) => (
          <CarCard key={car._id || car.id || index} car={car} />
        ))}
      </div>

      <button
        onClick={() => { navigate("/cars"); scrollTo(0, 0); }}
        className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-16 cursor-pointer"
      >
        Explore All Cars
        <img src={assets.arrow_icon} alt="arrow right" className="inline-block ml-2" />
      </button>
    </div>
  );
};

export default FeaturedSection;
