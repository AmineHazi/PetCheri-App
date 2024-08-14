import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import DetailedRegistration from './pages/DetailedRegistrationPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import NewApplications from './pages/NewApplications';
import AllServiceProviders from './pages/AllServiceProviders';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplicationFormPage />} />
        <Route path="/register/:token" element={<DetailedRegistration />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/new-applications" element={<NewApplications />} />
        <Route path="/admin/service-providers" element={<AllServiceProviders />} />
      </Routes>
    </Router>
  );
};

export default App;
