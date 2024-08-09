import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-phone-input-2/lib/style.css';
import { PlaceKit } from '@placekit/autocomplete-react';
import '@placekit/autocomplete-js/dist/placekit-autocomplete.css';

const questions = [
  { id: 'name', question: 'Prénom et Nom *', type: 'name', required: true },
  { id: 'email', question: 'Adresse E-Mail *', type: 'email', required: true },
  { id: 'phoneNumber', question: 'Numéro de téléphone *', type: 'tel', required: true },
  { id: 'address', question: 'Adresse postale *', type: 'text', required: true },
  { id: 'profileDescription', question: 'Un petit mot sur vous, votre expérience avec les animaux, et pourquoi vous souhaitez nous rejoindre en tant que chouchouteur ✨*', type: 'textarea', required: true },
  { id: 'prestations', question: 'Quelle(s) prestation(s) souhaitez-vous réaliser si vous nous rejoignez ? (Plusieurs réponses possible)*', type: 'checkbox', options: ['Garde de chien chez le client', 'Garde de chien à mon domicile', 'Toilettage de chien', 'toilettage de chat', 'Promenade de chien en ville', 'Promenade de chien en forêt', 'Education et comportement', 'Garde de chat chez le client',
    'Garde de chat à mon domicile', 'Visite de chat chez le client', 'Transport d\'animaux', 'Massage et bien-être', 'Ostéopathie', 'Garde ou visite de Nac'], required: true },
];

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrors({ ...errors, [name]: '' });

    if (type === 'checkbox') {
      const values = formData[name] || [];
      if (checked) {
        setFormData({ ...formData, [name]: [...values, value] });
      } else {
        setFormData({ ...formData, [name]: values.filter(v => v !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhoneChange = (value) => {
    setErrors({ ...errors, phoneNumber: '' });
    setFormData({ ...formData, phoneNumber: value });
  };

  const handleSelect = useCallback((value, item) => {
    setFormData({ ...formData, address: value });
    setErrors({ ...errors, address: '' });
    console.log('Selected Address:', value);
  }, [formData, errors]);

  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    const currentValue = formData[currentQuestion.id];

    if (currentQuestion.id === 'name') {
      const firstName = formData.firstName || '';
      const lastName = formData.lastName || '';
      if (!firstName.trim() || !lastName.trim()) {
        setErrors({ ...errors, firstName: 'Prénom est requis', lastName: 'Nom est requis' });
        return;
      }
    } else if (currentQuestion.required && (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0))) {
      setErrors({ ...errors, [currentQuestion.id]: 'This field is required' });
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('Form data submitted:', formData);
    alert('Candidature déposé !');

    const proxyUrl = 'http://localhost:5000/send-to-slack'; // URL de votre serveur proxy
    const message = {
      text: `Nouvelle Candidature:\nNom: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nTéléphone: ${formData.phoneNumber}\nAdresse: ${formData.address}\nPrestations: ${formData.prestations?.join(', ')}\nDescription: ${formData.profileDescription}`
    };
    
    try {
      const response = await axios.post('http://localhost:5000/api/applications', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        address: formData.address,
        profile_description: formData.profileDescription,
        prestations: formData.prestations
      });
      console.log('Application submitted:', response.data);
    } catch (error) {
      console.error('Error submitting application:', error);
    }

    
    try {
      await axios.post(proxyUrl, message, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Message envoyé à Slack');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message à Slack', error);
    }
  };

  const renderQuestion = (question) => {
    if (question.type === 'name') {
      return (
        <div className="flex flex-col">
          <div className="flex space-x-4">
            <input
              type="text"
              name="firstName"
              placeholder="Prénom"
              value={formData.firstName || ''}
              onChange={handleChange}
              className={`mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2 ${errors.firstName ? 'border-red-500' : ''}`}
              required={question.required}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Nom"
              value={formData.lastName || ''}
              onChange={handleChange}
              className={`mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2 ${errors.lastName ? 'border-red-500' : ''}`}
              required={question.required}
            />
          </div>
          {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
        </div>
      );
    }

    if (question.id === 'address') {
      return (
        <div>
          <PlaceKit
            apiKey="pk_R5EHxiISrZNpUXNVsO0n5CLut9qO9Dct+ApPchwbgiM="
            onPick={handleSelect}
            placeholder="Adresse postale *"
            name="address"
            className={`mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${errors.address ? 'border-red-500' : ''}`}
            required={question.required}
          />
          {errors.address ? <p className="text-red-500">{errors.address}</p> : null}
        </div>
      );
    }

    switch (question.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div>
            <input
              type={question.type}
              name={question.id}
              value={formData[question.id] || ''}
              onChange={handleChange}
              className={`mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${errors[question.id] ? 'border-red-500' : ''}`}
              required={question.required}
            />
            {errors[question.id] ? <p className="text-red-500">{errors[question.id]}</p> : null}
          </div>
        );
      case 'textarea':
        return (
          <div>
            <textarea
              name={question.id}
              value={formData[question.id] || ''}
              onChange={handleChange}
              className={`mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${errors[question.id] ? 'border-red-500' : ''}`}
              required={question.required}
            />
            {errors[question.id] ? <p className="text-red-500">{errors[question.id]}</p> : null}
          </div>
        );
      case 'checkbox':
        if (question.options) {
          return (
            <div className="mt-2 space-y-2">
              {question.options.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    name={question.id}
                    value={option}
                    checked={Array.isArray(formData[question.id]) && formData[question.id].includes(option)}
                    onChange={handleChange}
                    className={`form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out ${errors[question.id] ? 'border-red-500' : ''}`}
                    required={question.required && !formData[question.id]?.length}
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
              {errors[question.id] ? <p className="text-red-500">{errors[question.id]}</p> : null}
            </div>
          );
        } else {
          return (
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name={question.id}
                  checked={formData[question.id] || false}
                  onChange={handleChange}
                  className={`form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out ${errors[question.id] ? 'border-red-500' : ''}`}
                  required={question.required}
                />
                <span className="ml-2 text-gray-700">{question.question}</span>
              </label>
              {errors[question.id] ? <p className="text-red-500">{errors[question.id]}</p> : null}
            </div>
          );
        }
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-white pt-16">
      <div className="w-full p-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Candidater en tant que prestataire</h2>
              <p className="text-gray-600">{questions[currentStep].question}</p>
            </div>
            <div className="mb-6">
              {renderQuestion(questions[currentStep])}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center mt-4 relative">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="absolute left-0 bg-transparent text-gray-700 p-3 rounded-full text-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiArrowLeft size={24} />
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-600 text-white p-3 rounded-md text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currentStep < questions.length - 1 ? 'Suivant' : 'Soumettre'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
