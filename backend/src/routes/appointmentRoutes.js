import { Router } from 'express';
import {
  createAppointment,
  deleteAppointment,
  getAdminDashboard,
  getAllAppointments,
  getMyAppointments,
  updateAppointment,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  appointmentIdValidator,
  createAppointmentValidator,
  updateAppointmentValidator,
  updateStatusValidator
} from '../validators/appointmentValidators.js';

const router = Router();

router.post('/', protect, createAppointmentValidator, validateRequest, createAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/dashboard', protect, authorize('admin'), getAdminDashboard);
router.get('/', protect, authorize('admin'), getAllAppointments);
router.put('/:id', protect, appointmentIdValidator, updateAppointmentValidator, validateRequest, updateAppointment);
router.patch('/:id/status', protect, authorize('admin'), appointmentIdValidator, updateStatusValidator, validateRequest, updateAppointmentStatus);
router.delete('/:id', protect, appointmentIdValidator, validateRequest, deleteAppointment);

export default router;
