'use client';

import { useQuery } from '@tanstack/react-query';
import { getWeatherData, searchLocations, reverseGeocode } from '@/lib/api';
import { GeoLocation, WeatherData } from '@/types/weather';

export function useWeather(latitude: number | null, longitude: number | null) {
  return useQuery<WeatherData>({
    queryKey: ['weather', latitude, longitude],
    queryFn: () => {
      if (latitude === null || longitude === null) {
        throw new Error('Invalid coordinates');
      }
      return getWeatherData(latitude, longitude);
    },
    enabled: latitude !== null && longitude !== null,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLocationSearch(query: string) {
  return useQuery<GeoLocation[]>({
    queryKey: ['search', query],
    queryFn: () => searchLocations(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 10,
  });
}

export function useReverseGeocode(latitude: number | null, longitude: number | null) {
  return useQuery<string>({
    queryKey: ['reverseGeocode', latitude, longitude],
    queryFn: () => {
      if (latitude === null || longitude === null) {
        throw new Error('Invalid coordinates');
      }
      return reverseGeocode(latitude, longitude);
    },
    enabled: latitude !== null && longitude !== null,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
