import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Signup = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

    let tempErrors = {};
    if (!name) tempErrors.name = "Name is required";
    if (!email || !/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Valid email is required";
    if (!password || !passwordRegex.test(password))
      tempErrors.password = "Password must be 8-12 characters, include uppercase, lowercase, number and special character.";
    if (!confirmPassword) tempErrors.confirmPassword = "Confirm password is required";
    if (password && confirmPassword && password !== confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Invalid details");
      }

      const data = await res.json();
      console.log("Signup successful:", data);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log(data.user.username);
      setSuccess("Registration successful! Redirecting to login...");

      setName(""); setEmail(""); setPassword(""); setConfirmPassword("");

      navigate("/navhome");

    } catch (err) {
      setErrors({ form: err.message || "Something went wrong" });
    }

    setLoading(false);
  }

  return (
    <>
      <div className='flex justify-between items-center mx-6 mt-3'>
        <img src="src/assets/notes logo.png" alt="logo" className='w-16 h-16 rounded-full cursor-pointer' onClick={() => navigate("/")} />
        <div className='space-x-4'>
          <button type='button' className='bg-green-500 py-2 px-3 text-white font-medium rounded-md shadow-2xl cursor-pointer hover:bg-green-800' onClick={() => navigate("/login")} >login</button>
        </div>
      </div>
      <hr className='mt-3 text-gray-400' />
      <div className='flex justify-center items-center mt-10'>
        <div className='bg-slate-100 w-96 px-5 py-5 rounded-md shadow-2xl'>
          <h1 className='text-center text-green-700 font-medium text-2xl mb-4'>Register your account</h1>

          {errors.form && <p className="text-red-600 text-center mb-2">{errors.form}</p>}
          {success && <p className="text-green-600 text-center mb-2">{success}</p>}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className='flex flex-col my-3'>
              <label htmlFor="username" className='text-black font-medium text-lg mb-2'>Username</label>
              <input
                type="text"
                id='username'
                placeholder='Enter your name'
                className='p-2 block border-2 rounded-lg'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className='text-red-600'>{errors.name}</span>}
            </div>

            {/* Email */}
            <div className='flex flex-col my-3'>
              <label htmlFor="email" className='text-black font-medium text-lg mb-2'>Email</label>
              <input
                type="email"
                id='email'
                placeholder='Enter your email'
                className='p-2 block border-2 rounded-lg'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className='text-red-600'>{errors.email}</span>}
            </div>

            {/* Password */}
            <div className='flex flex-col my-3'>
              <label htmlFor="password" className='text-black font-medium text-lg mb-2'>Password</label>
              <input
                type="password"
                id='password'
                placeholder='Enter your password'
                className='p-2 block border-2 rounded-lg'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className='text-red-600'>{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className='flex flex-col my-3'>
              <label htmlFor="confirmPassword" className='text-black font-medium text-lg mb-2'>Confirm Password</label>
              <input
                type="password"
                id='confirmPassword'
                placeholder='Confirm your password'
                className='p-2 block border-2 rounded-lg'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <span className='text-red-600'>{errors.confirmPassword}</span>}
            </div>

            <button
              type='submit'
              disabled={loading}
              className={`bg-green-700 px-3 py-2 rounded-md w-full text-white font-semibold cursor-pointer hover:bg-green-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Registering..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup;
