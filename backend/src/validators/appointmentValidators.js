import { body, param } from 'express-validator';

const validStatuses = ['scheduled', 'confirmed', 'cancelled', 'completed'];

export const createAppointmentValidator = [
  body('doctorName').trim().notEmpty().withMessage('Nome do médico é obrigatório.'),
  body('specialty').trim().notEmpty().withMessage('Especialidade é obrigatória.'),
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Data deve estar no formato YYYY-MM-DD.'),
  body('time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Horário deve estar no formato HH:mm.'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Observações devem ter no máximo 500 caracteres.')
];

export const updateAppointmentValidator = [
  body('doctorName').optional().trim().notEmpty().withMessage('Nome do médico inválido.'),
  body('specialty').optional().trim().notEmpty().withMessage('Especialidade inválida.'),
  body('date').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Data deve estar no formato YYYY-MM-DD.'),
  body('time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Horário deve estar no formato HH:mm.'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Observações devem ter no máximo 500 caracteres.'),
  body('status').optional().isIn(validStatuses).withMessage('Status inválido.')
];

export const updateStatusValidator = [
  body('status').isIn(validStatuses).withMessage('Status inválido.')
];

export const appointmentIdValidator = [
  param('id').isMongoId().withMessage('ID inválido.')
];
