import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { assets, dummyCarData } from "../assets/assets";
import Loader from "../components/Loader";
import { useApp } from "../context/AppContext";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token, cars } = useApp();
  const [car, setCar] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState({ text: "", isError: false });
  const currency = import.meta.env.VITE_CURRENCY || "$";

  useEffect(() => {
    const fetchCarDetail = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/cars/${id}`);
        if (data.success && data.car) {
          setCar(data.car);
          return;
        }
      } catch (err) {
        // Fallback to local context/dummy list
      }

      const found = cars.find((c) => c._id === id || c.id === id) ||
                    dummyCarData.find((c) => c._id === id || c.id === id);
      setCar(found || dummyCarData[0]);
    };

    if (id) {
      fetchCarDetail();
    }
  }, [id, cars]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage({ text: "", isError: false });

    if (!token) {
      setBookingMessage({ text: "Please login first to reserve a car.", isError: true });
      return;
    }

    if (!pickupDate || !returnDate) {
      setBookingMessage({ text: "Please select both pickup and return dates.", isError: true });
      return;
    }

    try {
      setBookingLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/book`,
        {
          carId: car._id,
          pickupDate,
          returnDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setBookingMessage({ text: "Booking confirmed successfully! Redirecting to My Bookings...", isError: false });
        setTimeout(() => {
          navigate("/mybookings");
        }, 1500);
      } else {
        setBookingMessage({ text: data.message || "Booking failed", isError: true });
      }
    } catch (err) {
      setBookingMessage({ text: err.response?.data?.message || err.message || "Failed to book car", isError: true });
    } finally {
      setBookingLoading(false);
    }
  };

  if (!car) return <Loader />;

  const dailyPrice = car.price_per_day || car.pricePerDay || 100;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 mb-20">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer hover:text-gray-800"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-60" />
        Back to All Cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <img 
            src={car.image} 
            alt={car.model}
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          />

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{car.brand} {car.model}</h1>
              <p className="text-gray-500 text-lg">
                {car.category} • {car.year}
              </p>
            </div>

            <hr className="border-borderColor my-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission || "Automatic" },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div key={text} className="flex flex-col items-center bg-light p-4 rounded-lg">
                  <img src={icon} alt="" className="h-5 mb-2" />
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-medium mb-3">Description</h2>
              <p className="text-gray-500 leading-relaxed">{car.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-medium mb-3">Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                {["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear Parking Sensors"].map((item) => (
                  <li key={item} className="flex items-center">
                    <img src={assets.check_icon} className="h-4 mr-2" alt="" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right side booking card */}
        <form onSubmit={handleSubmit} className="shadow-lg h-max sticky top-24 rounded-xl p-6 space-y-6 bg-white border border-borderColor text-gray-500">
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
            {currency}{dailyPrice}
            <span className="text-base text-gray-400 font-normal">per day</span>
          </p>

          <hr className="border-borderColor my-4" />

          {bookingMessage.text && (
            <div className={`p-3 rounded-lg text-sm ${bookingMessage.isError ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
              {bookingMessage.text}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date">Pickup Date</label>
            <input 
              type="date" 
              className="border border-borderColor px-3 py-2 rounded-lg text-gray-700 outline-none" 
              required 
              id="pickup-date" 
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="return-date">Return Date</label>
            <input 
              type="date" 
              className="border border-borderColor px-3 py-2 rounded-lg text-gray-700 outline-none" 
              required 
              id="return-date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split('T')[0]}
            />
          </div>

          <button 
            disabled={bookingLoading}
            type="submit"
            className="w-full bg-primary hover:bg-primary-dull disabled:opacity-50 transition-all py-3 font-medium text-white rounded-xl cursor-pointer"
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>

          <p className="text-center text-sm">No credit card required to reserve</p>
        </form>
      </div>
    </div>
  );
};

export default CarDetails;

