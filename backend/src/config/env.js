import dotenv from 'dotenv';

dotenv.config();

const required = ['PORT', 'MONGO_URI', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente obrigatória não informada: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  openWeatherBaseUrl: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
  viacepBaseUrl: process.env.VIACEP_BASE_URL || 'https://viacep.com.br/ws',
  defaultCity: process.env.DEFAULT_CITY || 'Salvador',
  defaultState: process.env.DEFAULT_STATE || 'BA'
};
