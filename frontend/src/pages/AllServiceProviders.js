import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/service-providers')
      .then(response => setProviders(response.data))
      .catch(error => console.error('Error fetching service providers:', error));
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredProviders = providers.filter(provider =>
    provider.first_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">All Service Providers</h1>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search..."
        className="mb-4 p-2 border rounded"
      />
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Phone Number</th>
            <th className="py-2">Address</th>
            <th className="py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredProviders.map(provider => (
            <tr key={provider.id}>
              <td className="border px-4 py-2">{provider.first_name} {provider.last_name}</td>
              <td className="border px-4 py-2">{provider.email}</td>
              <td className="border px-4 py-2">{provider.phone_number}</td>
              <td className="border px-4 py-2">{provider.address}</td>
              <td className="border px-4 py-2">{provider.profile_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllServiceProviders;
