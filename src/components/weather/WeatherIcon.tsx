'use client';

import { 
  Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, 
  Snowflake, CloudLightning, Cloudy
} from 'lucide-react';

interface WeatherIconProps {
  icon: string;
  isDay: boolean;
  className?: string;
  size?: number;
}

export function WeatherIcon({ icon, isDay, className = '', size = 24 }: WeatherIconProps) {
  const iconProps = { className, size };
  
  switch (icon) {
    case 'sun':
      return isDay ? <Sun {...iconProps} className={`${className} text-yellow-400`} /> : <Cloudy {...iconProps} className={className} />;
    case 'cloud-sun':
      return <CloudSun {...iconProps} className={`${className} text-white`} />;
    case 'cloud':
      return <Cloud {...iconProps} className={`${className} text-white`} />;
    case 'cloud-fog':
      return <CloudFog {...iconProps} className={`${className} text-gray-300`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle {...iconProps} className={`${className} text-blue-300`} />;
    case 'cloud-rain':
      return <CloudRain {...iconProps} className={`${className} text-blue-400`} />;
    case 'snowflake':
      return <Snowflake {...iconProps} className={`${className} text-blue-200`} />;
    case 'cloud-lightning':
      return <CloudLightning {...iconProps} className={`${className} text-yellow-400`} />;
    default:
      return <Cloud {...iconProps} className={`${className} text-white`} />;
  }
}
