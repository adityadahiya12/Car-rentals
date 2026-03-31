import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-300 px-6 pt-14 md:px-16 lg:px-32 w-full">

      <div className="flex flex-col md:flex-row justify-between w-full gap-12 border-b border-gray-700 pb-10">

        {/* Logo & About */}
        <div className="md:max-w-xs">
          <img 
            alt="Dahiya Car Rentals" 
            className="h-12 mb-4"
            src={assets.logo}
          />
          <p className="text-sm leading-relaxed text-black">
            Premium self-drive & chauffeur-driven car rental service across Delhi NCR.
            Reliable, affordable & hassle-free rides 24/7.
          </p>

          {/* App links */}
          <div className="flex items-center gap-3 mt-5">
            <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg" className="h-10 border border-gray-500 rounded" />
            <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg" className="h-10 border border-gray-500 rounded" />
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-12 md:gap-20">

          <div>
            <h2 className="text-black font-semibold mb-4 text-lg">Quick Links</h2>
            <ul className="text-sm space-y-2 text-black">
              <li><a className="hover:text-indigo-400 transition" href="/">Home</a></li>
              <li><a className="hover:text-indigo-400 transition" href="/cars">Our Cars</a></li>
              <li><a className="hover:text-indigo-400 transition" href="/about">About Us</a></li>
              <li><a className="hover:text-indigo-400 transition" href="/contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-black font-semibold mb-4 text-lg">Support</h2>
            <ul className="text-sm space-y-2 text-black">
              <li className="hover:text-white transition">+91-870850-3491</li>
              <li className="hover:text-white transition">dahiyacarrentals@gmail.com</li>
              <li className="hover:text-white transition">Delhi NCR, India</li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-4 mt-4 text-xl">
              <a href="#"><i className="ri-facebook-fill hover:text-indigo-400 transition"></i></a>
              <a href="#"><i className="ri-instagram-line hover:text-indigo-400 transition"></i></a>
              <a href="#"><i className="ri-whatsapp-line hover:text-indigo-400 transition"></i></a>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-xs text-gray-500 py-5">
        © {new Date().getFullYear()} Dahiya Car Rentals — All Rights Reserved.
      </p>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/918708503491" 
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition duration-300">
        <i className="ri-whatsapp-line text-3xl"></i>
      </a>

    </footer>
  );
};

export default Footer