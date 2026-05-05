import React, { useState } from "react";
import { Link, useLocation , useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Cars", path: "/cars" },
  { name: "My Bookings", path: "/mybookings" },
];

const Navbar = () => {

  const { setShowLogin, user, logout , isOwner , axios, setIsOwner} = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const changeRole = async () => {
  try {
    const token = localStorage.getItem("token"); // ✅ ensure token

    const { data } = await axios.post(
      "/api/owner/change-role",
      {},
      {
        headers: {
          Authorization: token, // ✅ force send token
        },
      }
    );

    if (data.success) {
      setIsOwner(true);
      toast.success(data.message);
      navigate("/owner"); // ✅ better UX
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Failed to change role");
  }
};

  return (
    <motion.div
    initial={{y: -20 , opacity: 0}}
    animate={{y: 0 , opacity: 1}}
    transition={{duration: 0.5}}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-700 border-b border-borderColor relative transition-all duration-300 ${
        location.pathname === "/" ? "bg-light" : "bg-white"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <motion.img whileHover={{scale: 1.05}} src={assets.logo} alt="Logo" className="h-8" />
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
        <button onClick={()=> isOwner ? navigate('/owner') : changeRole()} className="cursor-pointer hover:text-primary transition">
          {isOwner ? "Dashboard" : "List Your Cars"}
        </button>
        <button onClick={()=> { user ? logout() : setShowLogin(true)}} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg">
          {user ? "Logout" : "Login"}
        </button>
      </div>

      {/* Mobile Buttons */}
      
      <button className="sm:hidden cursor-pointer" aria-label="Menu" onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className="w-4" />
      </button>
    </motion.div>
  );
};

export default Navbar;
