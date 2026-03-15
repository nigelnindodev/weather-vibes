import { WeatherData, GeoLocation } from '@/types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const response = await fetch(
    `${NOMINATIM_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
    { headers: { 'User-Agent': 'WeatherApp/1.0 (weather-vibes)' } }
  );

  if (!response.ok) throw new Error('Failed to reverse geocode');

  const data = await response.json();
  const address = data.address;
  
  if (address) {
    return address.city || address.town || address.village || address.county || 'Current Location';
  }
  
  return 'Current Location';
}

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query || query.length < 2) return [];

  const response = await fetch(
    `${GEO_URL}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );

  if (!response.ok) throw new Error('Failed to search locations');

  const data = await response.json();
  return data.results || [];
}

export async function getWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max',
    hourly: 'temperature_2m,weather_code,precipitation_probability',
    timezone: 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`${BASE_URL}/forecast?${params}`);

  if (!response.ok) throw new Error('Failed to fetch weather data');

  return response.json();
}

export function getWeatherCondition(code: number): { description: string; icon: string } {
  const conditions: Record<number, { description: string; icon: string }> = {
    0: { description: 'Clear sky', icon: 'sun' },
    1: { description: 'Mainly clear', icon: 'sun' },
    2: { description: 'Partly cloudy', icon: 'cloud-sun' },
    3: { description: 'Overcast', icon: 'cloud' },
    45: { description: 'Foggy', icon: 'cloud-fog' },
    48: { description: 'Depositing rime fog', icon: 'cloud-fog' },
    51: { description: 'Light drizzle', icon: 'cloud-drizzle' },
    53: { description: 'Moderate drizzle', icon: 'cloud-drizzle' },
    55: { description: 'Dense drizzle', icon: 'cloud-drizzle' },
    61: { description: 'Slight rain', icon: 'cloud-rain' },
    63: { description: 'Moderate rain', icon: 'cloud-rain' },
    65: { description: 'Heavy rain', icon: 'cloud-rain' },
    71: { description: 'Slight snow', icon: 'snowflake' },
    73: { description: 'Moderate snow', icon: 'snowflake' },
    75: { description: 'Heavy snow', icon: 'snowflake' },
    77: { description: 'Snow grains', icon: 'snowflake' },
    80: { description: 'Slight rain showers', icon: 'cloud-rain' },
    81: { description: 'Moderate rain showers', icon: 'cloud-rain' },
    82: { description: 'Violent rain showers', icon: 'cloud-rain' },
    85: { description: 'Slight snow showers', icon: 'snowflake' },
    86: { description: 'Heavy snow showers', icon: 'snowflake' },
    95: { description: 'Thunderstorm', icon: 'cloud-lightning' },
    96: { description: 'Thunderstorm with slight hail', icon: 'cloud-lightning' },
    99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
  };

  return conditions[code] || { description: 'Unknown', icon: 'cloud' };
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9 / 5) + 32;
}

export function formatTemperature(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    return `${Math.round(celsiusToFahrenheit(celsius))}°F`;
  }
  return `${Math.round(celsius)}°C`;
}
