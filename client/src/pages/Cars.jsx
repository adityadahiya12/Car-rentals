import React, { useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useApp } from "../context/AppContext";

const Cars = () => {
  const [input, setInput] = useState('');
  const { cars } = useApp();

  const filteredCars = cars.filter((car) => {
    if (!input.trim()) return true;
    const query = input.toLowerCase();
    return (
      car.brand?.toLowerCase().includes(query) ||
      car.model?.toLowerCase().includes(query) ||
      car.category?.toLowerCase().includes(query) ||
      car.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure' />

        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="search" className="w-4.5 h-4.5 mr-2" />
          <input 
            onChange={(e) => setInput(e.target.value)} 
            value={input} 
            type="text" 
            placeholder="Search by make, model, category or location" 
            className="w-full h-full outline-none text-gray-500"
          />
          <img src={assets.filter_icon} alt="filter" className="w-4.5 h-4.5 ml-2 cursor-pointer" />
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"> 
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} Cars
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto mb-16">
        {filteredCars.length > 0 ? (
          filteredCars.map((car, index) => (
            <div key={car._id || car.id || index}>
              <CarCard car={car} />
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 py-12 text-base">
            No cars found matching "{input}"
          </p>
        )}
      </div>
    </div>
  );
};

export default Cars;