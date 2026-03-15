export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast;
  hourly: HourlyForecast;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface WeatherCondition {
  code: number;
  description: string;
  icon: string;
}
