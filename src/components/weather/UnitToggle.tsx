'use client';

import { TemperatureUnit } from '@/types/weather';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className="flex bg-white/20 backdrop-blur-md rounded-xl p-1">
      <button
        onClick={() => onChange('celsius')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          unit === 'celsius'
            ? 'bg-white text-blue-600'
            : 'text-white hover:bg-white/10'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => onChange('fahrenheit')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          unit === 'fahrenheit'
            ? 'bg-white text-blue-600'
            : 'text-white hover:bg-white/10'
        }`}
      >
        °F
      </button>
    </div>
  );
}
