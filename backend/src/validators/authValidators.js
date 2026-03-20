import { body } from 'express-validator';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório.').isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres.'),
  body('email').trim().isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.'),
  body('role').optional().isIn(['patient', 'admin']).withMessage('Perfil inválido.'),
  body('cep').optional().isLength({ min: 8, max: 9 }).withMessage('CEP inválido.'),
  body('phone').optional().isLength({ min: 8 }).withMessage('Telefone inválido.')
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('password').notEmpty().withMessage('Senha é obrigatória.')
];
