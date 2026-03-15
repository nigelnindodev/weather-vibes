'use client';

import { motion } from 'framer-motion';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { getWeatherCondition, formatTemperature } from '@/lib/api';
import { getDayName } from '@/lib/utils';
import { WeatherIcon } from './WeatherIcon';
import { Droplets } from 'lucide-react';

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
          const precipitation = daily.precipitation_sum?.[index + 1] ?? 0;
          const precipChance = daily.precipitation_probability_max?.[index + 1] ?? 0;
          
          return (
            <motion.div
              key={date}
              variants={item}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center cursor-pointer"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(255,255,255,0.3)'
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <p className="text-white/70 text-xs md:text-sm mb-1">{getDayName(date)}</p>
              <WeatherIcon 
                icon={condition.icon} 
                isDay={true} 
                size={28} 
                className="mb-1"
              />
              <p className="text-white font-semibold text-sm md:text-base">
                {formatTemperature(daily.temperature_2m_max[index + 1], unit)}
              </p>
              <p className="text-white/50 text-xs md:text-sm">
                {formatTemperature(daily.temperature_2m_min[index + 1], unit)}
              </p>
              
              {/* Expanded details on hover */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                whileHover={{ height: 'auto', opacity: 1 }}
                className="overflow-hidden mt-1 pt-1 border-t border-white/20 w-full"
              >
                <div className="flex items-center justify-center gap-1 text-white/80 text-xs">
                  <Droplets className="w-3 h-3" />
                  <span>{Math.round(precipChance)}%</span>
                </div>
                {precipitation > 0 && (
                  <p className="text-white/60 text-xs text-center">
                    {precipitation.toFixed(1)}mm
                  </p>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
