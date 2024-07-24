// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get('/api/providers');
        setProviders(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des prestataires', error);
      }
    };

    fetchProviders();
  }, []);

  const handleAssignService = (providerId) => {
    // Logique pour assigner une prestation
  };

  const handleEditProvider = (providerId) => {
    // Logique pour modifier les informations du prestataire
  };

  return (
    <div className="container mx-auto mt-10 p-5 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Gestion des Prestataires</h1>
      <ul>
        {providers.map((provider) => (
          <li key={provider.id} className="mb-4 p-4 border rounded shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{provider.name}</h2>
                <p>{provider.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditProvider(provider.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleAssignService(provider.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Assigner une Prestation
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
