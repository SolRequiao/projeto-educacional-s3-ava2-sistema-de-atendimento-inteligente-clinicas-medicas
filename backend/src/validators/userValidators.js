import { body, param } from 'express-validator';

export const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres.'),
  body('phone').optional().isLength({ min: 8 }).withMessage('Telefone inválido.'),
  body('cep').optional().isLength({ min: 8, max: 9 }).withMessage('CEP inválido.'),
  body('email').optional().isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('street').optional().isString(),
  body('number').optional().isString(),
  body('district').optional().isString(),
  body('city').optional().isString(),
  body('state').optional().isLength({ min: 2, max: 2 }).withMessage('UF inválida.')
];

export const cepParamValidator = [
  param('cep').isLength({ min: 8, max: 9 }).withMessage('CEP inválido.')
];
