import { TemperatureUnit } from '@/types/weather';

export function getDayName(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function getWeatherBgGradient(weatherCode: number, isDay: boolean): string {
  if (!isDay) {
    return 'from-slate-900 via-purple-900 to-slate-800';
  }
  
  if (weatherCode === 0 || weatherCode === 1) {
    return 'from-blue-400 via-blue-500 to-blue-600';
  }
  if (weatherCode === 2) {
    return 'from-blue-300 via-blue-400 to-blue-500';
  }
  if (weatherCode === 3) {
    return 'from-gray-400 via-gray-500 to-gray-600';
  }
  if (weatherCode >= 45 && weatherCode <= 48) {
    return 'from-gray-300 via-gray-400 to-gray-500';
  }
  if (weatherCode >= 51 && weatherCode <= 67) {
    return 'from-blue-500 via-gray-500 to-blue-600';
  }
  if (weatherCode >= 71 && weatherCode <= 77) {
    return 'from-blue-100 via-gray-200 to-blue-300';
  }
  if (weatherCode >= 80 && weatherCode <= 82) {
    return 'from-blue-600 via-gray-600 to-blue-700';
  }
  if (weatherCode >= 95) {
    return 'from-gray-700 via-purple-800 to-gray-900';
  }
  
  return 'from-blue-400 via-blue-500 to-blue-600';
}

export function getWeatherGradientClass(code: number, isDay: boolean): string {
  return getWeatherBgGradient(code, isDay);
}

export const UNIT_KEY = 'weather-unit';
export const LAST_LOCATION_KEY = 'weather-last-location';

export function getStoredUnit(): TemperatureUnit {
  if (typeof window === 'undefined') return 'celsius';
  return (localStorage.getItem(UNIT_KEY) as TemperatureUnit) || 'celsius';
}

export function setStoredUnit(unit: TemperatureUnit): void {
  localStorage.setItem(UNIT_KEY, unit);
}

export function getStoredLocation(): { lat: number; lon: number; name: string } | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(LAST_LOCATION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setStoredLocation(lat: number, lon: number, name: string): void {
  localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify({ lat, lon, name }));
}
