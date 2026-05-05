import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {

  const { setShowLogin, axios, setToken } = useAppContext();
  const navigate = useNavigate();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        `/api/user/${state}`,
        state === "register"
          ? { name, email, password }
          : { email, password }
      );

      if (data.success) {
        toast.success(data.message);

        setToken(data.token);
        localStorage.setItem("token", data.token);

        setShowLogin(false);
        navigate("/");

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error(
        error.message ||
        `Failed to ${state === "register" ? "register" : "login"}`
      );
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

        {/* Form */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full md:w-1/2 flex flex-col gap-4 p-8 bg-white"
        >
          <p className="text-2xl font-semibold text-center text-gray-800">
            <span className="text-primary">User</span>{" "}
            {state === "login" ? "Login" : "Sign Up"}
          </p>

          {state === "register" && (
            <div>
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
          )}

          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>

          <p className="text-sm">
            {state === "register"
              ? "Already have an account?"
              : "Don't have an account?"}

            <span
              onClick={() =>
                setState(state === "login" ? "register" : "login")
              }
              className="text-primary cursor-pointer ml-2"
            >
              {state === "login" ? "Register" : "Login"}
            </span>
          </p>

          <button className="bg-primary text-white py-2 rounded">
            {state === "register" ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;