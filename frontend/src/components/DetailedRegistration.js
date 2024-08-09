import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetailedRegistration = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch initial application data using the token
    axios.get(`http://localhost:5000/api/applications/${token}`)
      .then(response => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching application data:', error);
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.acceptCGV || !formData.signContract || !formData.password) {
      setErrors({
        ...errors,
        acceptCGV: !formData.acceptCGV ? 'You must accept the CGV.' : '',
        signContract: !formData.signContract ? 'You must sign the contract.' : '',
        password: !formData.password ? 'Password is required.' : ''
      });
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/complete-registration/${token}`, formData);
      console.log('Registration completed:', response.data);
      alert('Registration completed successfully!');
    } catch (error) {
      console.error('Error completing registration:', error);
      alert('Error completing registration.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-semibold mb-4">Complete Your Registration</h2>
      <input
        type="text"
        name="firstName"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="First Name"
        className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
      <input
        type="text"
        name="lastName"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Last Name"
        className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
      <input
        type="tel"
        name="phoneNumber"
        value={formData.phone_number}
        onChange={handleChange}
        placeholder="Phone Number"
        className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
      <textarea
        name="profileDescription"
        value={formData.profile_description}
        onChange={handleChange}
        placeholder="Profile Description"
        className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
      <label className="flex items-center mt-2">
        <input
          type="checkbox"
          name="acceptCGV"
          checked={formData.acceptCGV}
          onChange={handleChange}
          className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
        />
        <span className="ml-2 text-gray-700">Accepter les CGV</span>
      </label>
      {errors.acceptCGV && <p className="text-red-500">{errors.acceptCGV}</p>}
      <label className="flex items-center mt-2">
        <input
          type="checkbox"
          name="signContract"
          checked={formData.signContract}
          onChange={handleChange}
          className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
        />
        <span className="ml-2 text-gray-700">Signer le contrat</span>
      </label>
      {errors.signContract && <p className="text-red-500">{errors.signContract}</p>}
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        required
      />
      {errors.password && <p className="text-red-500">{errors.password}</p>}
      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white p-3 rounded-md text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      >
        Complete Registration
      </button>
    </form>
  );
};

export default DetailedRegistration;
