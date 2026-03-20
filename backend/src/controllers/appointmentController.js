import { Appointment } from '../models/Appointment.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getWeatherAlertForAppointment } from '../services/weatherService.js';

function isPastDateTime(date, time) {
  const appointmentDateTime = new Date(`${date}T${time}:00`);
  return Number.isNaN(appointmentDateTime.getTime()) || appointmentDateTime < new Date();
}

async function ensureSlotIsAvailable({ doctorName, date, time, excludeId = null }) {
  const query = {
    doctorName,
    date,
    time,
    status: { $ne: 'cancelled' }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existing = await Appointment.findOne(query);

  if (existing) {
    const error = new Error('Já existe uma consulta agendada para este médico, data e horário.');
    error.status = 409;
    throw error;
  }
}

export const createAppointment = asyncHandler(async (req, res) => {
  const { doctorName, specialty, date, time, notes = '' } = req.body;

  if (isPastDateTime(date, time)) {
    return res.status(400).json({ message: 'Não é permitido agendar consulta em data ou horário passados.' });
  }

  await ensureSlotIsAvailable({ doctorName, date, time });

  const patient = await User.findById(req.user._id);

  const weather = await getWeatherAlertForAppointment({
    date,
    city: patient?.city,
    state: patient?.state
  });

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctorName,
    specialty,
    date,
    time,
    notes,
    weatherAlert: weather.weatherAlert,
    weatherDescription: weather.weatherDescription
  });

  const populated = await appointment.populate('patient', 'name email phone city state');

  res.status(201).json({
    message: 'Consulta agendada com sucesso.',
    appointment: populated
  });
});

export const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate('patient', 'name email phone city state')
    .sort({ date: 1, time: 1, createdAt: -1 });

  res.json({ appointments });
});

export const getAllAppointments = asyncHandler(async (req, res) => {
  const { status, date, doctorName, specialty } = req.query;
  const filters = {};

  if (status) filters.status = status;
  if (date) filters.date = date;
  if (doctorName) filters.doctorName = new RegExp(doctorName, 'i');
  if (specialty) filters.specialty = new RegExp(specialty, 'i');

  const appointments = await Appointment.find(filters)
    .populate('patient', 'name email phone city state')
    .sort({ date: 1, time: 1, createdAt: -1 });

  const totals = {
    total: appointments.length,
    scheduled: appointments.filter((item) => item.status === 'scheduled').length,
    confirmed: appointments.filter((item) => item.status === 'confirmed').length,
    cancelled: appointments.filter((item) => item.status === 'cancelled').length,
    completed: appointments.filter((item) => item.status === 'completed').length,
    rainyAlerts: appointments.filter((item) => item.weatherAlert).length
  };

  res.json({ totals, appointments });
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate('patient', 'name email phone city state');

  if (!appointment) {
    return res.status(404).json({ message: 'Consulta não encontrada.' });
  }

  const isAdmin = req.user.role === 'admin';
  const isOwner = appointment.patient._id.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: 'Você não tem permissão para editar esta consulta.' });
  }

  const doctorName = req.body.doctorName ?? appointment.doctorName;
  const specialty = req.body.specialty ?? appointment.specialty;
  const date = req.body.date ?? appointment.date;
  const time = req.body.time ?? appointment.time;
  const notes = req.body.notes ?? appointment.notes;
  const status = req.body.status ?? appointment.status;

  if (isPastDateTime(date, time) && status !== 'completed' && status !== 'cancelled') {
    return res.status(400).json({ message: 'Não é permitido reagendar para data ou horário passados.' });
  }

  await ensureSlotIsAvailable({ doctorName, date, time, excludeId: appointment._id });

  const weather = await getWeatherAlertForAppointment({
    date,
    city: appointment.patient.city,
    state: appointment.patient.state
  });

  appointment.doctorName = doctorName;
  appointment.specialty = specialty;
  appointment.date = date;
  appointment.time = time;
  appointment.notes = notes;
  appointment.status = status;
  appointment.weatherAlert = weather.weatherAlert;
  appointment.weatherDescription = weather.weatherDescription;

  await appointment.save();
  await appointment.populate('patient', 'name email phone city state');

  res.json({
    message: 'Consulta atualizada com sucesso.',
    appointment
  });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate('patient', 'name email phone city state');

  if (!appointment) {
    return res.status(404).json({ message: 'Consulta não encontrada.' });
  }

  appointment.status = req.body.status;
  await appointment.save();

  res.json({
    message: 'Status da consulta atualizado com sucesso.',
    appointment
  });
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({ message: 'Consulta não encontrada.' });
  }

  const isAdmin = req.user.role === 'admin';
  const isOwner = appointment.patient.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: 'Você não tem permissão para remover esta consulta.' });
  }

  await appointment.deleteOne();

  res.json({ message: 'Consulta removida com sucesso.' });
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  const [totalAppointments, todayAppointments, rainyAppointments, scheduled, confirmed, cancelled, completed] = await Promise.all([
    Appointment.countDocuments(),
    Appointment.countDocuments({ date: today }),
    Appointment.countDocuments({ weatherAlert: true, status: { $ne: 'cancelled' } }),
    Appointment.countDocuments({ status: 'scheduled' }),
    Appointment.countDocuments({ status: 'confirmed' }),
    Appointment.countDocuments({ status: 'cancelled' }),
    Appointment.countDocuments({ status: 'completed' })
  ]);

  const nextAppointments = await Appointment.find({
    status: { $in: ['scheduled', 'confirmed'] }
  })
    .populate('patient', 'name email phone city state')
    .sort({ date: 1, time: 1 })
    .limit(10);

  res.json({
    indicators: {
      totalAppointments,
      todayAppointments,
      rainyAppointments,
      scheduled,
      confirmed,
      cancelled,
      completed
    },
    nextAppointments
  });
});
