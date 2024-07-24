// src/components/AvailabilityForm.js
import React, { useState } from 'react';

const AvailabilityForm = () => {
  const [availability, setAvailability] = useState({
    days: [],
    startTime: '',
    endTime: '',
  });

  const handleDaysChange = (e) => {
    const { value, checked } = e.target;
    setAvailability((prev) => ({
      ...prev,
      days: checked
        ? [...prev.days, value]
        : prev.days.filter((day) => day !== value),
    }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setAvailability((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer les données au backend
    console.log(availability);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded">
      <div className="mb-4">
        <label className="block text-gray-700">Jours de la semaine</label>
        <div className="flex space-x-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <label key={day} className="flex items-center">
              <input
                type="checkbox"
                value={day}
                onChange={handleDaysChange}
                className="mr-2"
              />
              {day}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Heure de début</label>
        <input
          type="time"
          name="startTime"
          value={availability.startTime}
          onChange={handleTimeChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Heure de fin</label>
        <input
          type="time"
          name="endTime"
          value={availability.endTime}
          onChange={handleTimeChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Enregistrer les Disponibilités
      </button>
    </form>
  );
};

export default AvailabilityForm;
