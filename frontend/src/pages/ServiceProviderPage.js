import React, { useState } from 'react';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    companyName: 'Doe Services',
    siret: '12345678901234',
    phoneNumber: '0123456789',
    whatsappNumber: '0123456789',
    address: '123 Main St',
    postalCode: '75000',
    city: 'Paris',
    interventionArea: 'Paris et banlieue',
    instagram: 'john_doe_pets',
    vehicle: 'Oui',
    smoker: 'Non',
    languages: ['Français', 'Anglais'],
    profileDescription: 'Passionné par les animaux, j\'offre des services de qualité.',
    profilePicture: '',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setProfileData({ ...profileData, profilePicture: URL.createObjectURL(files[0]) });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleSave = () => {
    // Logique pour enregistrer les modifications
    console.log('Profile data saved:', profileData);
    alert('Modifications enregistrées');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Mon Profil</h1>
      <form>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={profileData.profilePicture || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="flex flex-col flex-1">
              <label className="text-lg font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-lg font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Adresse E-Mail</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Nom de votre société/numéro de SIRET (le cas échéant)</label>
            <input
              type="text"
              name="companyName"
              value={profileData.companyName}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="siret"
              value={profileData.siret}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Numéro de SIRET"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Numéro de téléphone</label>
            <input
              type="tel"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Numéro WhatsApp (si différent de votre numéro)</label>
            <input
              type="tel"
              name="whatsappNumber"
              value={profileData.whatsappNumber}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Adresse postale</label>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="flex flex-col flex-1">
              <label className="text-lg font-medium text-gray-700">Code postal</label>
              <input
                type="text"
                name="postalCode"
                value={profileData.postalCode}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-lg font-medium text-gray-700">Ville</label>
              <input
                type="text"
                name="city"
                value={profileData.city}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Quel est votre périmètre d'intervention ?</label>
            <textarea
              name="interventionArea"
              value={profileData.interventionArea}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Compte Instagram (si vous avez un compte dédié aux animaux de compagnie)</label>
            <input
              type="text"
              name="instagram"
              value={profileData.instagram}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Véhicule</label>
            <div className="flex mt-2 space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vehicle"
                  value="Oui"
                  checked={profileData.vehicle === 'Oui'}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700">Oui</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vehicle"
                  value="Non"
                  checked={profileData.vehicle === 'Non'}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700">Non</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Fumeur(se)</label>
            <div className="flex mt-2 space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="smoker"
                  value="Oui"
                  checked={profileData.smoker === 'Oui'}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700">Oui</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="smoker"
                  value="Oui, uniquement à l'extérieur"
                  checked={profileData.smoker === 'Oui, uniquement à l\'extérieur'}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700">Oui, uniquement à l'extérieur</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="smoker"
                  value="Oui, mais jamais en présence d'animaux"
                  checked={profileData.smoker === 'Oui, mais jamais en présence d\'animaux'}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700">Oui, mais jamais en présence d'animaux</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="smoker"
                  value="Non"
                  checked={profileData.smoker === 'Non'}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700">Non</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Quelle(s) langue(s) parlez-vous ?</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {['Français', 'Anglais', 'Espagnol', 'Portugais', 'Italien', 'Allemand', 'Arabe', 'Autre'].map(language => (
                <label key={language} className="flex items-center">
                  <input
                    type="checkbox"
                    name="languages"
                    value={language}
                    checked={profileData.languages.includes(language)}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-700">{language}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">Description pour votre profil</label>
            <textarea
              name="profileDescription"
              value={profileData.profileDescription}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-md text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
