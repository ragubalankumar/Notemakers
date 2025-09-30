import React from 'react'
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-center mx-4 sm:mx-6 mt-3 gap-3 sm:gap-0'>
        <img 
          src="src/assets/notes logo.png" 
          alt="logo" 
          className='w-16 h-16 rounded-full cursor-pointer'
          onClick={() => navigate("/")} 
        />
        <div className='flex gap-4'>
          <button 
            type='button' 
            className='bg-green-500 py-2 px-3 text-white font-medium rounded-md shadow-2xl cursor-pointer hover:bg-green-800'
            onClick={() => navigate("/login")} 
          >
            Login
          </button>
          <button 
            className='bg-green-500 py-2 px-3 text-white font-medium rounded-md shadow-2xl cursor-pointer hover:bg-green-800'
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>
        </div>
      </div>

      <hr className='mt-3 text-gray-400' />

      {/* Hero Text */}
      <div className="text-center px-4 sm:px-0">
        <h1 className='text-green-700 font-semibold mt-7 text-2xl sm:text-3xl'>It's Notemaker</h1>
        <p className='mt-3 text-lg font-normal'>Greate a Ideas to proof and your visual to charts</p>
      </div>

      {/* Hero Section */}
      <div className="bg-green-700 mx-4 sm:mx-20 rounded-md py-10 mt-10">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-10 px-4 sm:px-0">
          <img
            src="src/assets/notes-1.png"
            alt="Notebook"
            className="w-full sm:w-80 h-64 sm:h-96 object-cover rounded-lg shadow-lg"
          />
          <div className="w-full sm:w-80 text-center lg:text-left">
            <p className="text-white font-medium leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias officiis provident
              suscipit ut nostrum nulla ipsa! Dolore, explicabo perferendis molestiae delectus
              aliquam libero cumque facilis quae incidunt? Qui, ipsam optio.
            </p>
            <button className="bg-white py-2 px-4 rounded-md mt-5 text-lg font-semibold cursor-pointer hover:bg-slate-100 transition">
              Try it
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-4 sm:px-10 mt-10 text-center">
        <p className='font-medium text-lg'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum iste minus adipisci possimus reiciendis quisquam dolorum, fugit voluptatibus ipsam accusantium, earum, atque fugiat explicabo nihil consequatur inventore hic error voluptatum?
        </p>
      </div>

      {/* Footer */}
      <div className='bg-green-700 mt-10'>
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-10 py-10 text-white px-3'>
          <img src="src/assets/notes logo.png" alt="logo" className='w-16 h-16 rounded-full'/>
          <p>copyrights @&copy; 2025</p>
          <p>contact notemaker</p>
        </div>
      </div>
    </div>
  )
}

export default Home
