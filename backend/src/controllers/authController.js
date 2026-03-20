import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getAddressByCep } from '../services/cepService.js';

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    cep: user.cep,
    street: user.street,
    number: user.number,
    district: user.district,
    city: user.city,
    state: user.state,
    createdAt: user.createdAt
  };
}

export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role = 'patient',
    phone = '',
    cep = '',
    number = ''
  } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });

  if (exists) {
    return res.status(409).json({ message: 'Já existe um usuário com este e-mail.' });
  }

  let address = {
    cep: '',
    street: '',
    district: '',
    city: '',
    state: ''
  };

  if (cep) {
    address = await getAddressByCep(cep);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: passwordHash,
    role,
    phone,
    cep: address.cep || cep,
    street: address.street,
    number,
    district: address.district,
    city: address.city,
    state: address.state
  });

  const token = generateToken(user);

  res.status(201).json({
    message: 'Usuário cadastrado com sucesso.',
    token,
    user: sanitizeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = generateToken(user);

  res.json({
    message: 'Login realizado com sucesso.',
    token,
    user: sanitizeUser(user)
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
