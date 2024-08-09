import React from 'react';
import ApplicationForm from '../components/ApplicationForm';

const ApplicationFormPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-white pt-16">
      <div className="w-full p-8 relative">
        <div className="text-center mb-8">
          <img src="https://via.placeholder.com/50" alt="Profile" className="mx-auto rounded-full mb-2"/>
        </div>
        <ApplicationForm />
      </div>
    </div>
  );
};

export default ApplicationFormPage;
