import { Router } from 'express';
import { login, me, register } from '../controllers/authController.js';
import { loginValidator, registerValidator } from '../validators/authValidators.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/me', protect, me);

export default router;
