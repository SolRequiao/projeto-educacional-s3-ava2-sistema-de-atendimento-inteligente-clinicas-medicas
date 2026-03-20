import axios from 'axios';
import { env } from '../config/env.js';

export async function getAddressByCep(cep) {
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    const error = new Error('CEP inválido. Informe 8 dígitos.');
    error.status = 400;
    throw error;
  }

  const url = `${env.viacepBaseUrl}/${cleanCep}/json/`;
  const { data } = await axios.get(url, { timeout: 5000 });

  if (!data || data.erro) {
    const error = new Error('CEP não encontrado.');
    error.status = 404;
    throw error;
  }

  return {
    cep: data.cep,
    street: data.logradouro || '',
    district: data.bairro || '',
    city: data.localidade || '',
    state: data.uf || ''
  };
}
