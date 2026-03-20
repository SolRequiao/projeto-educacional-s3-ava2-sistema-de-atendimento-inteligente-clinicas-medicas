import { Router } from 'express';
import { getAddressFromCep, getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { cepParamValidator, updateProfileValidator } from '../validators/userValidators.js';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidator, validateRequest, updateProfile);
router.get('/cep/:cep', protect, cepParamValidator, validateRequest, getAddressFromCep);

export default router;
