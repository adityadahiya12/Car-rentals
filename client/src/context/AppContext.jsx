import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { dummyCarData, dummyUserData, dummyMyBookingsData, dummyDashboardData } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);

  // Fetch current user profile if token exists
  const loadUserProfile = async (authToken = token) => {
    if (!authToken) {
      setUser(null);
      return;
    }
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
      }
      console.log("Error loading user profile:", error.message);
    }
  };

  // Fetch public cars list (fallback to dummyCarData if empty or server offline)
  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      const { data } = await axios.get(`${backendUrl}/api/user/cars`);
      if (data.success && data.cars && data.cars.length > 0) {
        setCars(data.cars);
      } else {
        setCars(dummyCarData);
      }
    } catch (error) {
      console.log("Could not fetch cars from server, using demo catalog:", error.message);
      setCars(dummyCarData);
    } finally {
      setLoadingCars(false);
    }
  };

  // Login handler
  const login = (authToken, userData) => {
    setToken(authToken);
    localStorage.setItem("token", authToken);
    if (userData) {
      setUser(userData);
    } else {
      loadUserProfile(authToken);
    }
  };

  // Logout handler
  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    fetchCars();
    if (token) {
      loadUserProfile(token);
    }
  }, []);

  const value = {
    backendUrl,
    currency,
    token,
    setToken,
    user,
    setUser,
    cars,
    setCars,
    fetchCars,
    loadingCars,
    login,
    logout,
    loadUserProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
