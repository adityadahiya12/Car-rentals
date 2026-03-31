import React, { useState } from "react";

const Login = ({ setShowLogin }) => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
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

          <button className="bg-primary hover:bg-primary/90 transition-all text-white w-full py-2 rounded-md font-medium">
            {state === "register" ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
