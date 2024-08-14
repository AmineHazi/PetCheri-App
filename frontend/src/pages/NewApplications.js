import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/applications')
      .then(response => setApplications(response.data))
      .catch(error => console.error('Error fetching applications:', error));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">New Applications</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Phone Number</th>
            <th className="py-2">Address</th>
            <th className="py-2">Description</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td className="border px-4 py-2">{app.first_name} {app.last_name}</td>
              <td className="border px-4 py-2">{app.email}</td>
              <td className="border px-4 py-2">{app.phone_number}</td>
              <td className="border px-4 py-2">{app.address}</td>
              <td className="border px-4 py-2">{app.profile_description}</td>
              <td className="border px-4 py-2">
                {/* Add actions like Approve or Reject here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewApplications;
