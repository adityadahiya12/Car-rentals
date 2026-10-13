import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useApp } from "../../context/AppContext";

const NavbarOwner = () => {
  const { user } = useApp();

  return (
    <div className="flex items-center justify-between px-6 md:px-10 py-4 text-gray-600 border-b border-borderColor bg-white relative transition-all">
      <Link to="/" className="flex items-center gap-3">
        <img src={assets.logo} alt="Logo" className="h-7" />
        <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded">Owner Panel</span>
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <p>Welcome, <span className="font-semibold text-gray-800">{user?.name || "Owner"}</span></p>
        <Link to="/" className="text-primary hover:underline text-xs">Back to store →</Link>
      </div>
    </div>
  );
};

export default NavbarOwner;