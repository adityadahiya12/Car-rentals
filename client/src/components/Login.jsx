import React, { useState } from "react";
import axios from "axios";
import { useApp } from "../context/AppContext";

const Login = ({ setShowLogin }) => {
  const { backendUrl, login } = useApp();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (state === "register") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          login(data.token, data.user);
          setShowLogin(false);
        } else {
          setErrorMessage(data.message || "Registration failed");
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (data.success) {
          login(data.token, data.user);
          setShowLogin(false);
        } else {
          setErrorMessage(data.message || "Login failed");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 flex items-center justify-center z-[100] bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-[90%] max-w-3xl"
      >
        {/* Left Image */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://www.pixelstalk.net/wp-content/uploads/2016/06/HD-Backgrounds-Car-Wallpapers.jpg"
            alt="Login Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full md:w-1/2 flex flex-col gap-4 p-8 bg-white"
        >
          <p className="text-2xl font-semibold text-center text-gray-800">
            <span className="text-primary">User</span>{" "}
            {state === "login" ? "Login" : "Sign Up"}
          </p>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm text-center">
              {errorMessage}
            </div>
          )}

          {state === "register" && (
            <div className="w-full">
              <label className="text-sm font-medium">Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="type here"
                className="border border-gray-300 rounded w-full p-2 mt-1 outline-primary"
                type="text"
                required
              />
            </div>
          )}

          <div className="w-full">
            <label className="text-sm font-medium">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="type here"
              className="border border-gray-300 rounded w-full p-2 mt-1 outline-primary"
              type="email"
              required
            />
          </div>

          <div className="w-full">
            <label className="text-sm font-medium">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="type here"
              className="border border-gray-300 rounded w-full p-2 mt-1 outline-primary"
              type="password"
              required
            />
          </div>

          {state === "register" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-primary font-medium cursor-pointer"
              >
                Login
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-primary font-medium cursor-pointer"
              >
                Register
              </span>
            </p>
          )}

          <button 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all text-white w-full py-2 rounded-md font-medium cursor-pointer"
          >
            {loading ? "Processing..." : state === "register" ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
