import React from "react";
import { assets } from "../assets/assets";

const testimonials = [
  {
    name: "Aryan Balyan",
    img: "https://randomuser.me/api/portraits/men/52.jpg",
    review: "Amazing service! Got a clean car on time. Hassle-free booking & best rental experience in Delhi NCR.",
  },
  {
    name: "Varsha Sharma",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    review: "Loved the comfort and condition of the car. Dahiya Car Rentals is now my go-to for trips!",
  },
  {
    name: "Nishikant Dahiya",
    img: "https://randomuser.me/api/portraits/men/61.jpg",
    review: "Affordable prices, smooth pickup & drop. Highly recommend Dahiya Rentals!",
  },
  {
    name: "Shrishti Malik",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
    review: "Excellent service and great support team! My Shimla trip was super smooth thanks to them.",
  },
];

const Testimonial = () => {
  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44 text-center">
      
      <h2 className="text-3xl font-semibold mb-10">
        Happy <span className="text-indigo-600 font-bold">Clients</span>
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="flex flex-col items-center group cursor-pointer">
            
            {/* Review Bubble */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white shadow-lg rounded-lg px-4 py-3 text-sm mb-3 max-w-[180px] scale-90 group-hover:scale-100 border border-gray-100">
              <p className="font-medium text-gray-700">{t.review}</p>
              <div className="flex text-yellow-400 text-xs mt-2 justify-center">
                ⭐⭐⭐⭐⭐
              </div>
            </div>

            {/* Image */}
            <img 
              src={t.img} 
              alt={t.name} 
              className="w-20 h-20 rounded-full border-4 border-white shadow-md hover:scale-110 hover:-translate-y-1 transition duration-300"
            />

            {/* Name */}
            <p className="mt-2 text-sm font-medium text-gray-900">{t.name}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Testimonial;
