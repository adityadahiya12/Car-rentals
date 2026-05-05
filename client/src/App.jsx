import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";

// Pages
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import MyBookings from "./pages/MyBookings";

// Owner Pages
import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageBookings from "./pages/owner/ManageBooking";
import ManageCars from "./pages/owner/ManageCars";

// Context
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { showLogin } = useAppContext();
  const location = useLocation();

  // Check if current route is owner panel
  const isOwnerPath = location.pathname.startsWith("/owner");

  return (
    <>
       {/* ✅ Toast Notifications */}
      <Toaster position="top-right" />

      {/* ✅ Login Popup */}
      {showLogin && <Login />}

      {/* ✅ Navbar (hide in owner panel) */}
      {!isOwnerPath && <Navbar />}

      {/* ✅ Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/mybookings" element={<MyBookings />} />

        {/* Owner Routes */}
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>
      </Routes>

      {/* ✅ Footer (hide in owner panel) */}
      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;