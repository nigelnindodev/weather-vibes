'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useLocationSearch } from '@/hooks/useWeather';
import { GeoLocation } from '@/types/weather';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSelect: (location: GeoLocation) => void;
  onUseCurrentLocation: () => void;
  currentName?: string;
}

export function SearchBar({ onSelect, onUseCurrentLocation, currentName }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { data: results, isLoading } = useLocationSearch(query);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location: GeoLocation) => {
    onSelect(location);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
        <input
          type="text"
          value={currentName && !query ? '' : query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-24 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        )}
        <button
          onClick={onUseCurrentLocation}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          title="Use current location"
        >
          <MapPin className="w-5 h-5 text-white" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden z-50"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-600">Searching...</div>
            ) : results && results.length > 0 ? (
              <ul>
                {results.map((location) => (
                  <li key={location.id}>
                    <button
                      onClick={() => handleSelect(location)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3"
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-800">
                        {location.name}
                        {location.admin1 && <span className="text-gray-500">, {location.admin1}</span>}
                        <span className="text-gray-400">, {location.country}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">No locations found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
