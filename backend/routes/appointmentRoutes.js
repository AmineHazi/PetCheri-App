const express = require('express');
const { createAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { isAuthenticated, isServiceProvider } = require('../utils/auth');
const router = express.Router();

router.post('/appointments', isAuthenticated, createAppointment);
router.get('/appointments', isAuthenticated, isServiceProvider, getAppointments);
router.put('/appointments/:id', isAuthenticated, isServiceProvider, updateAppointmentStatus);

module.exports = router;
