import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    let tempErrors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Valid email is required";
    if (!password) tempErrors.password = "Password is required";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Invalid credentials");
      }

      const data = await res.json();
      setUser(data.user);
      setSuccess("Login successful! Redirecting...");
      localStorage.setItem("token", data.token);

      setEmail("");
      setPassword("");

      navigate("/navhome");
    } catch (err) {
      setErrors({ form: err.message || "Something went wrong" });
    }
    setLoading(false);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mx-4 sm:mx-6 mt-4 gap-4 sm:gap-0">
        <img
          src="public/notes logo.png"
          alt="logo"
          className="w-16 h-16 rounded-full cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="flex gap-4">
          <button
            className="bg-green-500 py-2 px-4 text-white font-medium rounded-md shadow-2xl cursor-pointer hover:bg-green-800"
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>
        </div>
      </div>

      <hr className="mt-4 text-gray-400" />

      {/* Form Container */}
      <div className="flex justify-center items-center mt-8 px-4 sm:px-0">
        <div className="bg-slate-100 w-full max-w-md px-5 py-5 rounded-md shadow-2xl">
          <h1 className="text-center text-green-700 font-medium text-2xl mb-4">
            Login to your account
          </h1>

          {errors.form && <p className="text-red-600 text-center mb-2">{errors.form}</p>}
          {success && <p className="text-green-600 text-center mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="flex flex-col my-3">
              <label htmlFor="email" className="text-black font-medium text-lg mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="p-2 block border-2 rounded-lg w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="text-red-600">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col my-3">
              <label htmlFor="password" className="text-black font-medium text-lg mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="p-2 block border-2 rounded-lg w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="text-red-600">{errors.password}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-green-700 px-3 py-2 rounded-md w-full text-white font-semibold cursor-pointer hover:bg-green-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
