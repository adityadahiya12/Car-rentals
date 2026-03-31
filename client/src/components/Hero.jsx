import React from "react";
import { assets } from "../assets/assets";
import { cityList } from "../assets/assets";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Hero = () => {

    const [ pickupLocation, setPickupLocation ] = React.useState("");
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-10 bg-light text-center px-4">
      <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
        Dahiya Rentals — Your Journey, Elevated.
      </h1>
      <form className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8">
            <div className="flex flex-col items-start gap-2">
                <select required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="border border-borderColor rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition w-48 text-sm bg-white text-gray-600">
                    <option value = "">PickUp Location </option>
                    {cityList.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                <p className = "px-1 text-sm text-gray-500" >{pickupLocation ? pickupLocation : "Please Select Location"}</p>
           
            </div>
            <div className="flex flex-col items-start gap-2">
                    <label htmlFor="pickup-date" className="text-sm text-gray-600 font-medium">Pick-Up Date</label> 
                    <input type="date" id="pickup-date" min = {new Date().toISOString().split("T")[0]} className="text-sm text-gray-600 " required/>          
            </div>
            <div className="flex flex-col items-start gap-2">
               <label htmlFor="return-date" className="text-sm text-gray-600 font-medium">Return Date</label> 
               <input type="date" id="return-date" min = {new Date().toISOString().split("T")[0]} className="text-sm text-gray-600 " required/>          
            
            </div>
            

        </div>
        <button className="flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer">
                <img src={assets.search_icon} alt="search" className="brightness-300" />
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
