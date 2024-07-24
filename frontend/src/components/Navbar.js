import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">Gestion Animaux</Link>
        <div className="hidden md:flex space-x-4">
          <Link to="/login" className="text-white">Connexion</Link>
          <Link to="/register" className="text-white">Inscription</Link>
          <Link to="/service-provider" className="text-white">Prestataire</Link>
          <Link to="/calendar" className="text-white">Calendrier</Link>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-2">
          <Link to="/login" className="block text-white py-2">Connexion</Link>
          <Link to="/register" className="block text-white py-2">Inscription</Link>
          <Link to="/service-provider" className="block text-white py-2">Prestataire</Link>
          <Link to="/calendar" className="block text-white py-2">Calendrier</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
