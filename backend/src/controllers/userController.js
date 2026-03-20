import { User } from '../models/User.js';
import { getAddressByCep } from '../services/cepService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const allowedFields = ['name', 'email', 'phone', 'street', 'number', 'district', 'city', 'state'];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      user[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    }
  }

  if (req.body.email) {
    const emailInUse = await User.findOne({
      email: req.body.email.toLowerCase(),
      _id: { $ne: user._id }
    });

    if (emailInUse) {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    user.email = req.body.email.toLowerCase();
  }

  if (req.body.cep) {
    const address = await getAddressByCep(req.body.cep);
    user.cep = address.cep;
    user.street = address.street;
    user.district = address.district;
    user.city = address.city;
    user.state = address.state;
  }

  await user.save();

  res.json({
    message: 'Perfil atualizado com sucesso.',
    user: sanitizeUser(user)
  });
});

export const getAddressFromCep = asyncHandler(async (req, res) => {
  const address = await getAddressByCep(req.params.cep);
  res.json(address);
});
