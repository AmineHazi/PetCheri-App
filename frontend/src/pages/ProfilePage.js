import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
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
          setFormData(response.data);
        } catch (err) {
          console.error('Error fetching profile:', err);
          setError('Error fetching profile');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profile_picture: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(formData);
      setEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Error saving profile');
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Logout
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex flex-col items-center md:w-1/3">
            <img
              src={formData.profile_picture || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4"
            />
            {editing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
              />
            )}
          </div>
          <div className="flex flex-col md:w-2/3 space-y-4">
            {editing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="Last Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Description
                  </label>
                  <textarea
                    name="profile_description"
                    value={formData.profile_description || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="Profile Description"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-700">Name:</h3>
                  <p className="ml-2 text-gray-600">{user.first_name} {user.last_name}</p>
                </div>
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-700">Email:</h3>
                  <p className="ml-2 text-gray-600">{user.email}</p>
                </div>
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-700">Phone Number:</h3>
                  <p className="ml-2 text-gray-600">{user.phone_number}</p>
                </div>
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-700">Address:</h3>
                  <p className="ml-2 text-gray-600">{user.address}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Profile Description:</h3>
                  <p className="mt-1 text-gray-600">{user.profile_description}</p>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
