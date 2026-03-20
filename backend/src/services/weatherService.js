import axios from 'axios';
import { env } from '../config/env.js';

function normalizeDate(date) {
  return new Date(`${date}T12:00:00`);
}

export async function getWeatherAlertForAppointment({ date, city, state }) {
  if (!env.openWeatherApiKey) {
    return {
      weatherAlert: false,
      weatherDescription: 'Integração de clima não configurada.'
    };
  }

  const queryCity = city || env.defaultCity;
  const queryState = state || env.defaultState;

  const geoResponse = await axios.get(`${env.openWeatherBaseUrl.replace('/data/2.5', '')}/geo/1.0/direct`, {
    params: {
      q: `${queryCity},${queryState},BR`,
      limit: 1,
      appid: env.openWeatherApiKey
    },
    timeout: 5000
  });

  if (!Array.isArray(geoResponse.data) || geoResponse.data.length === 0) {
    return {
      weatherAlert: false,
      weatherDescription: 'Não foi possível localizar a cidade para previsão.'
    };
  }

  const { lat, lon } = geoResponse.data[0];

  const forecastResponse = await axios.get(`${env.openWeatherBaseUrl}/forecast`, {
    params: {
      lat,
      lon,
      appid: env.openWeatherApiKey,
      units: 'metric',
      lang: 'pt_br'
    },
    timeout: 5000
  });

  const targetDate = normalizeDate(date);
  const items = forecastResponse.data?.list || [];

  const sameDayForecasts = items.filter((item) => {
    const forecastDate = new Date(item.dt_txt);
    return forecastDate.toISOString().slice(0, 10) === targetDate.toISOString().slice(0, 10);
  });

  if (sameDayForecasts.length === 0) {
    return {
      weatherAlert: false,
      weatherDescription: 'Previsão indisponível para a data da consulta.'
    };
  }

  const rainyForecast = sameDayForecasts.find((item) => {
    const main = item.weather?.[0]?.main?.toLowerCase() || '';
    const description = item.weather?.[0]?.description?.toLowerCase() || '';
    return main.includes('rain') || description.includes('chuva');
  });

  if (rainyForecast) {
    return {
      weatherAlert: true,
      weatherDescription: rainyForecast.weather?.[0]?.description || 'Há previsão de chuva no dia da consulta.'
    };
  }

  return {
    weatherAlert: false,
    weatherDescription: sameDayForecasts[0].weather?.[0]?.description || 'Sem previsão de chuva.'
  };
}
