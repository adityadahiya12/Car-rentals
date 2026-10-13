import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden shadow-sm">
        <div className="text-white pb-6 md:pb-10">
            <h2 className="text-3xl font-medium">Do you Own a Luxury Car?</h2>
            <p className="mt-2 text-white/90">Monetize your vehicle effortlessly by listing it on CarRental.</p>
            <p className="max-w-139 text-white/80 text-sm mt-1">We take care of insurance, driver verification and secure payments so you can earn passive income, stress-free.</p>
        <button onClick={() => navigate("/owner/add-car")} className="px-6 py-2 bg-white hover:bg-slate-100 transition-all text-primary font-medium rounded-lg text-sm mt-5 cursor-pointer">List your Car!</button>
        </div>
        <img src={assets.banner_car_image} alt="" className="max-h-45 mt-4 md:mt-10" />
    </div>
    );
};
export default Banner;
