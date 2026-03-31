import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();

  return (
    <div onClick={() => {navigate(`/car-details/${car._id}`); scrollTo(0, 0);}} className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-500 cursor-pointer">

      {/* Car Image */}
      <div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden">
        <img 
          src={car.image} 
          alt={car.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* ✅ Availability Badge with Icon */}
        {car.isAvailable && (
          <div className="absolute top-4 left-4 flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
            <img src={assets.available_icon} alt="Available" className="w-3 h-3" />
            <span>Available Now</span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <span className="font-semibold">{currency}{car.pricePerDay}</span>
          <span className="text-sm text-white/80"> / Day</span>
        </div>
      </div>

      {/* Car Details */}
      <div className="p-4 bg-white sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
            <p className="text-gray-500 text-sm">{car.category} • {car.year}</p>
          </div>
        </div>

        {/* Specs */}
        <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600 text-sm">
          <div className="flex items-center">
            <img src={assets.users_icon} alt="Seats" className="h-4 mr-2" />
            {car.seating_capacity} Seats
          </div>

          <div className="flex items-center">
            <img src={assets.fuel_icon} alt="Fuel" className="h-4 mr-2" />
            {car.fuel_type}
          </div>

          <div className="flex items-center">
            <img src={assets.car_icon} alt="Transmission" className="h-4 mr-2" />
            {car.transmission_type}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default CarCard;
