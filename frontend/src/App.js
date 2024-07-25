import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServiceProviderPage from './pages/ServiceProviderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApplyPage from './pages/ApplyPage';
import CalendarPage from './pages/CalendarPage';
import Navbar from './components/Navbar';
import './index.css'; // Importer le fichier CSS avec Tailwind

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto mt-10 p-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/service-provider" element={<ServiceProviderPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
