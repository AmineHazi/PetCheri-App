import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Hi, welcome to the PetCheri App!</h1>
      <p className="text-lg mb-8">What do you want to do today?</p>
      <div className="space-x-4">
        <Link to="/apply">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Apply to join us</button>
        </Link>
        <Link to="/login">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">Connect</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
