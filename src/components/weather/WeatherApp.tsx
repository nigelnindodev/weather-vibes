'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { GeoLocation, TemperatureUnit } from '@/types/weather';
import { SearchBar } from './SearchBar';
import { CurrentWeather } from './CurrentWeather';
import { Forecast } from './Forecast';
import { UnitToggle } from './UnitToggle';
import { getWeatherGradientClass, getStoredUnit, setStoredUnit, getStoredLocation, setStoredLocation } from '@/lib/utils';
import { reverseGeocode } from '@/lib/api';

export function WeatherApp() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [cityName, setCityName] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState('');
  const requestIdRef = useRef(0);

  const { data: weatherData, isLoading, error: weatherError } = useWeather(
    location?.latitude ?? null,
    location?.longitude ?? null
  );

  const fetchLocationAndWeather = useCallback(async (latitude: number, longitude: number, saveLocation: boolean = true) => {
    const currentRequestId = ++requestIdRef.current;
    
    // Set location immediately with fallback name so weather query can start
    const initialLocation: GeoLocation = {
      id: 0,
      name: 'Current Location',
      latitude,
      longitude,
      country: '',
    };
    setLocation(initialLocation);
    setCityName('Current Location');
    setIsLoadingLocation(true);
    
    // Try reverse geocoding in background
    try {
      const name = await reverseGeocode(latitude, longitude);
      
      // Only update if this request is still current
      if (currentRequestId === requestIdRef.current) {
        const updatedLocation: GeoLocation = {
          id: 0,
          name,
          latitude,
          longitude,
          country: '',
        };
        setLocation(updatedLocation);
        setCityName(name);
        if (saveLocation) {
          setStoredLocation(latitude, longitude, name);
        }
      }
    } catch {
      // Keep using "Current Location" as fallback
      if (saveLocation && currentRequestId === requestIdRef.current) {
        setStoredLocation(latitude, longitude, 'Current Location');
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoadingLocation(false);
      }
    }
  }, []);

  const handleSelectLocation = useCallback((loc: GeoLocation) => {
    // Increment requestId to invalidate any pending reverse geocode
    ++requestIdRef.current;
    setLocation(loc);
    setCityName(loc.name);
    setStoredLocation(loc.latitude, loc.longitude, loc.name);
    setError('');
  }, []);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocationAndWeather(latitude, longitude);
      },
      (_err) => {
        setError('Unable to get your location. Please enable location access.');
        setIsLoadingLocation(false);
      }
    );
  }, [fetchLocationAndWeather]);

  const handleUnitChange = useCallback((newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    setStoredUnit(newUnit);
  }, []);

  useEffect(() => {
    const storedUnit = getStoredUnit();
    setUnit(storedUnit);
    
    const storedLoc = getStoredLocation();
    if (storedLoc) {
      setLocation({
        id: 0,
        name: storedLoc.name,
        latitude: storedLoc.lat,
        longitude: storedLoc.lon,
        country: '',
      });
      setCityName(storedLoc.name);
      setIsInitializing(false);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchLocationAndWeather(latitude, longitude);
            setIsInitializing(false);
          },
          () => {
            setIsInitializing(false);
          }
        );
      } else {
        setIsInitializing(false);
      }
    }
  }, [fetchLocationAndWeather]);

  const gradientClass = weatherData 
    ? getWeatherGradientClass(weatherData.current.weather_code, weatherData.current.is_day === 1)
    : 'from-blue-400 via-blue-500 to-blue-600';

  const isLoadingOrInitializing = isLoading || isLoadingLocation || isInitializing;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} transition-all duration-700`}>
      <div className="min-h-screen p-4 md:p-6 flex flex-col">
        <header className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <SearchBar 
            onSelect={handleSelectLocation}
            onUseCurrentLocation={handleUseCurrentLocation}
            currentName={cityName}
          />
          <UnitToggle unit={unit} onChange={handleUnitChange} />
        </header>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/80 text-white px-4 py-2 rounded-xl mt-2 text-center max-w-md mx-auto"
          >
            {error}
          </motion.div>
        )}

        <main className="flex-1 flex flex-col items-center justify-center mt-4">
          <AnimatePresence mode="wait">
            {isLoadingOrInitializing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-white text-xl"
              >
                <Loader2 className="w-8 h-8 animate-spin" />
                {isLoadingLocation ? 'Getting your location...' : 'Loading weather data...'}
              </motion.div>
            ) : weatherError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white text-xl text-center"
              >
                <p className="mb-2">Unable to load weather data</p>
                <p className="text-white/60 text-sm">Please try searching for a city or use your location</p>
              </motion.div>
            ) : weatherData && cityName ? (
              <motion.div
                key="weather"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <CurrentWeather 
                  data={weatherData} 
                  unit={unit} 
                  cityName={cityName}
                />
                <Forecast data={weatherData} unit={unit} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white text-xl text-center"
              >
                <p>Search for a city or use your location</p>
                <p className="text-white/60 text-sm mt-2">to see the weather</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
