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
  const baseProps = { className, size };
  
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

  const renderIcon = () => {
    switch (icon) {
      case 'sun':
        const SunComponent = <Sun {...baseProps} className={`${className} text-yellow-400 animate-pulse-soft`} />;
        return animate ? <motion.div {...animatedProps}>{SunComponent}</motion.div> : SunComponent;
      case 'cloud-sun':
        return <CloudSun {...baseProps} className={`${className} text-white`} />;
      case 'cloud':
        return <Cloud {...baseProps} className={`${className} text-white`} />;
      case 'cloud-fog':
        return <CloudFog {...baseProps} className={`${className} text-gray-300`} />;
      case 'cloud-drizzle':
        return <CloudDrizzle {...baseProps} className={`${className} text-blue-300`} />;
      case 'cloud-rain':
        return <CloudRain {...baseProps} className={`${className} text-blue-400`} />;
      case 'snowflake':
        const SnowComponent = <Snowflake {...baseProps} className={`${className} text-blue-200 animate-pulse-soft`} />;
        return animate ? <motion.div {...animatedProps}>{SnowComponent}</motion.div> : SnowComponent;
      case 'cloud-lightning':
        const LightningComponent = <CloudLightning {...baseProps} className={`${className} text-yellow-400 animate-pulse-soft`} />;
        return animate ? <motion.div {...animatedProps}>{LightningComponent}</motion.div> : LightningComponent;
      default:
        return <Cloud {...baseProps} className={`${className} text-white`} />;
    }
  };

  return renderIcon();
}
