import React from "react";
import { assets } from "../assets/assets";
import { cityList } from "../assets/assets";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
    const navigate = useNavigate();
    const [pickupLocation, setPickupLocation] = React.useState("");
    const [pickupDate, setPickupDate] = React.useState("");
    const [returnDate, setReturnDate] = React.useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/cars');
    };

  return (
    <div className="min-h-[85vh] py-12 flex flex-col items-center justify-center gap-10 bg-light text-center px-4">
      <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
        Dahiya Rentals — Your Journey, Elevated.
      </h1>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 min-md:ml-8">
            <div className="flex flex-col items-start gap-1">
                <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="border border-borderColor rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition w-48 text-sm bg-white text-gray-600">
                    <option value = "">PickUp Location</option>
                    {cityList.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                <p className="px-1 text-xs text-gray-500">{pickupLocation ? pickupLocation : "Select city"}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
                <label htmlFor="pickup-date" className="text-xs text-gray-600 font-medium">Pick-Up Date</label> 
                <input value={pickupDate} onChange={e=>setPickupDate(e.target.value)} type="date" id="pickup-date" min={new Date().toISOString().split("T")[0]} className="text-sm text-gray-600 outline-none" />          
            </div>
            <div className="flex flex-col items-start gap-1">
               <label htmlFor="return-date" className="text-xs text-gray-600 font-medium">Return Date</label> 
               <input value={returnDate} onChange={e=>setReturnDate(e.target.value)} type="date" id="return-date" min={pickupDate || new Date().toISOString().split("T")[0]} className="text-sm text-gray-600 outline-none" />          
            </div>
        </div>
        <button type="submit" className="flex items-center justify-center gap-2 px-9 py-3 max-sm:w-full bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer">
                <img src={assets.search_icon} alt="search" className="brightness-300 w-4 h-4" />
                Search
        </button>
      </form>

      <img 
        src={assets.main_car} 
        alt="car hero" 
        className="max-h-72 w-auto"
      />
    </div>
  );
};

export default Hero;
