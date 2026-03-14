'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { GeoLocation, TemperatureUnit } from '@/types/weather';
import { SearchBar } from './SearchBar';
import { CurrentWeather } from './CurrentWeather';
import { Forecast } from './Forecast';
import { UnitToggle } from './UnitToggle';
import { getWeatherGradientClass, getStoredUnit, setStoredUnit, getStoredLocation, setStoredLocation } from '@/lib/utils';

export function WeatherApp() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [cityName, setCityName] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState('');

  const { data: weatherData, isLoading, error: weatherError } = useWeather(
    location?.latitude ?? null,
    location?.longitude ?? null
  );

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
    }
  }, []);

  const handleSelectLocation = useCallback((loc: GeoLocation) => {
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
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/geocode/reverse?latitude=${latitude}&longitude=${longitude}`
          );
          const data = await response.json();
          
          const newLocation: GeoLocation = {
            id: 0,
            name: data.results?.[0]?.name || 'Current Location',
            latitude,
            longitude,
            country: data.results?.[0]?.country || '',
            admin1: data.results?.[0]?.admin1,
          };
          
          setLocation(newLocation);
          setCityName(newLocation.name);
          setStoredLocation(latitude, longitude, newLocation.name);
          setError('');
        } catch {
          setError('Failed to get location name');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (err) => {
        setError('Unable to get your location. Please enable location access.');
        setIsLoadingLocation(false);
      }
    );
  }, []);

  const handleUnitChange = useCallback((newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    setStoredUnit(newUnit);
  }, []);

  const gradientClass = weatherData 
    ? getWeatherGradientClass(weatherData.current.weather_code, weatherData.current.is_day === 1)
    : 'from-blue-400 via-blue-500 to-blue-600';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} transition-all duration-700`}>
      <div className="min-h-screen p-4 md:p-8 flex flex-col">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Weather</h1>
          <UnitToggle unit={unit} onChange={handleUnitChange} />
        </header>

        <SearchBar 
          onSelect={handleSelectLocation}
          onUseCurrentLocation={handleUseCurrentLocation}
          currentName={cityName}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/80 text-white px-4 py-2 rounded-xl mt-4 text-center"
          >
            {error}
          </motion.div>
        )}

        <main className="flex-1 flex flex-col items-center justify-center mt-8">
          <AnimatePresence mode="wait">
            {isLoading || isLoadingLocation ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-white text-xl"
              >
                <Loader2 className="w-8 h-8 animate-spin" />
                Loading weather data...
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
