'use client';

import { motion } from 'framer-motion';
import { 
  Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, 
  Snowflake, CloudLightning
} from 'lucide-react';

interface WeatherIconProps {
  icon: string;
  isDay: boolean;
  className?: string;
  size?: number;
  animate?: boolean;
}

export function WeatherIcon({ icon, isDay: _isDay, className = '', size = 24, animate = false }: WeatherIconProps) {
  const animateClass = animate ? 'animate-pulse-soft' : '';
  
  const animatedProps = animate ? {
    animate: { 
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  switch (icon) {
    case 'sun': {
      const SunComponent = <Sun size={size} className={`${className} text-yellow-400 ${animateClass}`} />;
      return animate ? <motion.div {...animatedProps}>{SunComponent}</motion.div> : SunComponent;
    }
    case 'cloud-sun':
      return <CloudSun size={size} className={`${className} text-white`} />;
    case 'cloud':
      return <Cloud size={size} className={`${className} text-white`} />;
    case 'cloud-fog':
      return <CloudFog size={size} className={`${className} text-gray-300`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle size={size} className={`${className} text-blue-300`} />;
    case 'cloud-rain':
      return <CloudRain size={size} className={`${className} text-blue-400`} />;
    case 'snowflake': {
      const SnowComponent = <Snowflake size={size} className={`${className} text-blue-200 ${animateClass}`} />;
      return animate ? <motion.div {...animatedProps}>{SnowComponent}</motion.div> : SnowComponent;
    }
    case 'cloud-lightning': {
      const LightningComponent = <CloudLightning size={size} className={`${className} text-yellow-400 ${animateClass}`} />;
      return animate ? <motion.div {...animatedProps}>{LightningComponent}</motion.div> : LightningComponent;
    }
    default:
      return <Cloud size={size} className={`${className} text-white`} />;
  }
}
