import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useApp } from "../context/AppContext";

const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Cars", path: "/cars" },
  { name: "My Bookings", path: "/mybookings" },
];

const Navbar = ({ setShowLogin }) => {
  const { user, token, logout } = useApp();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-700 border-b border-borderColor relative transition-all duration-300 ${
        location.pathname === "/" ? "bg-light" : "bg-white"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="h-8" />
      </Link>

      {/* Desktop Menu */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-3/5 max-sm:top-16 max-sm:right-0 max-sm:border-l border-borderColor flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 sm:p-0 transition-all duration-300 z-50 ${
          location.pathname === "/" ? "bg-light" : "bg-white"
        } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className={`text-base font-medium ${
              location.pathname === link.path
                ? "text-primary font-semibold"
                : "text-gray-600"
            } hover:text-primary transition`}
            onClick={() => setOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        {/* Mobile auth buttons */}
        <div className="sm:hidden flex flex-col gap-3 mt-4 w-full">
          <button onClick={() => { setOpen(false); navigate('/owner'); }} className="text-left font-medium text-gray-600 hover:text-primary">
            Dashboard
          </button>
          {token ? (
            <button onClick={() => { logout(); setOpen(false); }} className="w-full text-center px-4 py-2 border border-red-500 text-red-500 rounded-lg">
              Logout
            </button>
          ) : (
            <button onClick={() => { setShowLogin(true); setOpen(false); }} className="w-full text-center px-4 py-2 bg-primary text-white rounded-lg">
              Login
            </button>
          )}
        </div>
      </div>

      {/* Search bar - Desktop */}
      <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56 bg-white shadow-sm">
        <img src={assets.search_icon} alt="search" className="w-4" />
        <input
          type="text"
          placeholder="Search..."
          className="outline-none w-full"
        />
      </div>

      {/* Right Buttons */}
      <div className="hidden sm:flex items-center gap-6">
        <button onClick={() => navigate('/owner')} className="cursor-pointer hover:text-primary transition">
          Dashboard
        </button>
        {token ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Hi, {user?.name || "User"}
            </span>
            <button 
              onClick={logout} 
              className="cursor-pointer px-4 py-1.5 border border-red-400 text-red-500 hover:bg-red-50 transition-all rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg">
            Login
          </button>
        )}
      </div>

      {/* Mobile Buttons */}
      <button className="sm:hidden cursor-pointer" aria-label="Menu" onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className="w-4" />
      </button>
    </div>
  );
};

export default Navbar;
