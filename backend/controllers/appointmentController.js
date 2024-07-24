const Appointment = require('../models/appointment');

exports.createAppointment = async (req, res) => {
  const { date, serviceProviderId, animalId } = req.body;
  try {
    const appointment = await Appointment.create({ date, serviceProviderId, animalId });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({ where: { serviceProviderId: req.user.id } });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    appointment.status = status;
    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
};
