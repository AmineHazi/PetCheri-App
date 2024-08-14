import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="space-y-4">
        <Link to="/admin/new-applications">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full text-left">New Applications</button>
        </Link>
        <Link to="/admin/service-providers">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md w-full text-left">All Service Providers</button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
