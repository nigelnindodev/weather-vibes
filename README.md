# Weather Vibes

"Vibes" may be a misnormer here; effort has gone into creating a feasible local setup with open code. And additions here are being reviewed to a high degree (as of now, more autonomy with tests and CI/CD).

A beautiful, modern weather application built with Next.js, TypeScript, and Tailwind CSS. Uses the Open-Meteo API for free, no-API-key weather data.

## Features

- **Current Weather Display** - Temperature, weather conditions, humidity, wind speed, and feels-like temperature
- **5-Day Forecast** - Extended forecast with daily high/low temperatures
- **Location Search** - Search for any city worldwide with autocomplete
- **Geolocation Support** - Get weather for your current location
- **Unit Toggle** - Switch between Celsius and Fahrenheit (persisted)
- **Dynamic Backgrounds** - Background gradient changes based on weather conditions and time of day
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Smooth Animations** - Polished transitions using Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Weather API**: Open-Meteo (free, no API key required)
- **State Management**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main weather page
│   └── globals.css         # Global styles
├── components/
│   ├── Providers.tsx       # React Query provider
│   └── weather/
│       ├── WeatherApp.tsx      # Main app component
│       ├── CurrentWeather.tsx  # Current conditions display
│       ├── Forecast.tsx        # 5-day forecast
│       ├── SearchBar.tsx       # City search with autocomplete
│       ├── UnitToggle.tsx      # °C/°F toggle
│       └── WeatherIcon.tsx     # Weather condition icons
├── hooks/
│   └── useWeather.ts       # Weather data fetching hooks
├── lib/
│   ├── api.ts              # Open-Meteo API calls
│   └── utils.ts            # Helpers and constants
└── types/
    └── weather.ts          # TypeScript interfaces
```

## Setup

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

This app is ready for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## API

This project uses [Open-Meteo](https://open-meteo.com/), a free, open-source weather API that requires no API key.

## License

MIT
