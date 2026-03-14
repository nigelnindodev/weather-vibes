'use client';

import { motion } from 'framer-motion';
import { Wind, Droplets, Thermometer } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { getWeatherCondition, formatTemperature } from '@/lib/api';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: TemperatureUnit;
  cityName: string;
}

export function CurrentWeather({ data, unit, cityName }: CurrentWeatherProps) {
  const { current, daily } = data;
  const condition = getWeatherCondition(current.weather_code);
  const isDay = current.is_day === 1;
  const temperature = current.temperature_2m;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="text-2xl font-semibold text-white mb-1">{cityName}</h2>
      <p className="text-white/70 mb-6">{condition.description}</p>

      <div className="flex items-center justify-center mb-6">
        <WeatherIcon 
          icon={condition.icon} 
          isDay={isDay} 
          size={80} 
          className="drop-shadow-lg"
        />
      </div>

      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-8xl font-light text-white mb-2"
      >
        {formatTemperature(temperature, unit)}
      </motion.div>

      <p className="text-white/70 mb-8">
        H: {formatTemperature(daily.temperature_2m_max[0], unit)} 
        {' · '}
        L: {formatTemperature(daily.temperature_2m_min[0], unit)}
      </p>

      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/20 backdrop-blur-md rounded-2xl p-4"
        >
          <Wind className="w-6 h-6 mx-auto mb-2 text-white" />
          <p className="text-white/70 text-sm">Wind</p>
          <p className="text-white font-semibold">{Math.round(current.wind_speed_10m)} km/h</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/20 backdrop-blur-md rounded-2xl p-4"
        >
          <Droplets className="w-6 h-6 mx-auto mb-2 text-white" />
          <p className="text-white/70 text-sm">Humidity</p>
          <p className="text-white font-semibold">{current.relative_humidity_2m}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/20 backdrop-blur-md rounded-2xl p-4"
        >
          <Thermometer className="w-6 h-6 mx-auto mb-2 text-white" />
          <p className="text-white/70 text-sm">Feels Like</p>
          <p className="text-white font-semibold">{formatTemperature(current.apparent_temperature, unit)}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
