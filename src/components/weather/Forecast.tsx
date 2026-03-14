'use client';

import { motion } from 'framer-motion';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { getWeatherCondition, formatTemperature } from '@/lib/api';
import { getDayName } from '@/lib/utils';
import { WeatherIcon } from './WeatherIcon';

interface ForecastProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export function Forecast({ data, unit }: ForecastProps) {
  const { daily } = data;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <h3 className="text-xl font-semibold text-white mb-4 px-2">5-Day Forecast</h3>
      <div className="grid grid-cols-5 gap-2">
        {daily.time.slice(1, 6).map((date, index) => {
          const weatherCode = daily.weather_code[index + 1];
          const condition = getWeatherCondition(weatherCode);
          
          return (
            <motion.div
              key={date}
              variants={item}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center"
            >
              <p className="text-white/70 text-sm mb-2">{getDayName(date)}</p>
              <WeatherIcon 
                icon={condition.icon} 
                isDay={true} 
                size={32} 
                className="mb-2"
              />
              <p className="text-white font-semibold">
                {formatTemperature(daily.temperature_2m_max[index + 1], unit)}
              </p>
              <p className="text-white/50 text-sm">
                {formatTemperature(daily.temperature_2m_min[index + 1], unit)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
