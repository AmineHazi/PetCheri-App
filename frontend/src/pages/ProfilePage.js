import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      } else {
        navigate('/login'); // Redirect to login if no token is found
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        <p>Name: {user.first_name} {user.last_name}</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 text-white p-3 rounded-md text-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
