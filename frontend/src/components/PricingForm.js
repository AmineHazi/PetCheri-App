// src/components/PricingForm.js
import React, { useState } from 'react';

const PricingForm = () => {
  const [pricing, setPricing] = useState({
    initialPrice: '',
    initialDuration: '',
    additionalPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPricing((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer les données au backend
    console.log(pricing);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded">
      <div className="mb-4">
        <label className="block text-gray-700">Prix initial (€)</label>
        <input
          type="number"
          name="initialPrice"
          value={pricing.initialPrice}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Durée initiale (heures)</label>
        <input
          type="number"
          name="initialDuration"
          value={pricing.initialDuration}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Prix supplémentaire par heure (€)</label>
        <input
          type="number"
          name="additionalPrice"
          value={pricing.additionalPrice}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Enregistrer les Prix
      </button>
    </form>
  );
};

export default PricingForm;
