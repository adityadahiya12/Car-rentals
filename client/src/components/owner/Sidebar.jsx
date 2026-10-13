import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ownerMenuLinks, assets } from "../../assets/assets"; 
import { useApp } from "../../context/AppContext";

const Sidebar = () => {
    const { user } = useApp();
    const location = useLocation();
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-16 md:max-w-60 w-full border-r border-borderColor bg-white text-sm">
            <div className="group relative">
                <label htmlFor="image" className="cursor-pointer block relative">
                    <img 
                        src={preview || user?.image || "https://images.unsplash.com/photo-16633332755192-727a05c4013d?q=80&w=300"} 
                        alt="Profile" 
                        className="h-10 w-10 md:h-16 md:w-16 rounded-full object-cover mx-auto border-2 border-primary/20"
                    />
                    <input type="file" id="image" accept="image/*" hidden onChange={handleImageChange}/>

                    <div className="absolute inset-0 bg-black/30 rounded-full hidden group-hover:flex items-center justify-center transition">
                        <img src={assets.edit_icon} alt="edit" className="w-5 h-5 brightness-200" />
                    </div>
                </label>
            </div>

            <p className="mt-3 text-base font-semibold max-md:hidden text-gray-800">
                {user?.name || "Owner"}
            </p>
            <p className="text-xs text-gray-400 max-md:hidden capitalize">
                {user?.role || "Owner"}
            </p>

            <div className="w-full mt-6">
                {ownerMenuLinks.map((link, index) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <NavLink 
                            key={index} 
                            to={link.path} 
                            className={`relative flex items-center gap-3 w-full py-3 pl-4 transition-colors ${
                                isActive 
                                    ? 'bg-primary/10 text-primary font-medium' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <img src={isActive ? link.coloredIcon : link.icon} alt="" className="w-5 h-5" />
                            <span className="max-md:hidden">{link.name}</span>
                            {isActive && (
                                <div className="bg-primary w-1.5 h-8 rounded-l right-0 absolute"></div>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;