import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Sun, CloudRain, Thermometer, Eye, Gauge, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    visibility: number;
    pressure: number;
    weather: { main: string; description: string; icon: string }[];
  };
  daily: {
    dt: number;
    temp: { day: number; min: number; max: number };
    weather: { main: string; icon: string }[];
  }[];
}

// Kerala cities for weather
const KERALA_CITIES = [
  { name: 'Kochi', lat: 9.9312, lon: 76.2673 },
  { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366 },
  { name: 'Kozhikode', lat: 11.2588, lon: 75.7804 },
  { name: 'Thrissur', lat: 10.5276, lon: 76.2144 },
];

const weatherIcons: Record<string, typeof Sun> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudRain,
  Thunderstorm: CloudRain,
};

function getWeatherIcon(condition: string) {
  return weatherIcons[condition] || Cloud;
}

function getDayName(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function LiveWeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState(KERALA_CITIES[0]);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Using Open-Meteo API (completely free, no API key needed)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia/Kolkata&forecast_days=7`
        );
        
        if (!response.ok) throw new Error('Failed to fetch weather');
        
        const data = await response.json();
        
        // Transform Open-Meteo data to our format
        const weatherCodeMap: Record<number, string> = {
          0: 'Clear', 1: 'Clear', 2: 'Clouds', 3: 'Clouds',
          45: 'Clouds', 48: 'Clouds',
          51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
          61: 'Rain', 63: 'Rain', 65: 'Rain',
          80: 'Rain', 81: 'Rain', 82: 'Rain',
          95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
        };

        const transformedData: WeatherData = {
          current: {
            temp: Math.round(data.current.temperature_2m),
            feels_like: Math.round(data.current.temperature_2m - 2),
            humidity: data.current.relative_humidity_2m,
            wind_speed: Math.round(data.current.wind_speed_10m),
            visibility: 10,
            pressure: Math.round(data.current.surface_pressure),
            weather: [{
              main: weatherCodeMap[data.current.weather_code] || 'Clouds',
              description: weatherCodeMap[data.current.weather_code]?.toLowerCase() || 'cloudy',
              icon: '01d'
            }]
          },
          daily: data.daily.time.map((time: string, i: number) => ({
            dt: new Date(time).getTime() / 1000,
            temp: {
              day: Math.round((data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2),
              min: Math.round(data.daily.temperature_2m_min[i]),
              max: Math.round(data.daily.temperature_2m_max[i]),
            },
            weather: [{
              main: weatherCodeMap[data.daily.weather_code[i]] || 'Clouds',
              icon: '01d'
            }]
          }))
        };

        setWeather(transformedData);
      } catch (err) {
        setError('Failed to load weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  if (loading) {
    return (
      <div className="stat-card p-6 opacity-0 animate-slide-up flex items-center justify-center h-[300px]" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <Loader2 className="w-8 h-8 animate-spin text-sky" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="stat-card p-6 opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <p className="text-muted-foreground text-center">{error || 'No data available'}</p>
      </div>
    );
  }

  const CurrentIcon = getWeatherIcon(weather.current.weather[0].main);

  return (
    <div className="stat-card p-0 overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
      {/* City Selector */}
      <div className="p-3 border-b border-border">
        <div className="flex gap-1 overflow-x-auto">
          {KERALA_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => setSelectedCity(city)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all",
                selectedCity.name === city.name
                  ? "bg-sky text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current Weather */}
      <div className="bg-gradient-sky p-6 text-accent-foreground">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-80">{selectedCity.name}, Kerala</p>
            <p className="text-4xl font-semibold mt-1">{weather.current.temp}°C</p>
            <p className="text-sm mt-1 opacity-90 capitalize">{weather.current.weather[0].description}</p>
          </div>
          <CurrentIcon className="w-16 h-16 opacity-90" />
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col items-center gap-1">
            <Droplets className="w-4 h-4 opacity-80" />
            <span className="text-xs">{weather.current.humidity}%</span>
            <span className="text-[10px] opacity-70">Humidity</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Wind className="w-4 h-4 opacity-80" />
            <span className="text-xs">{weather.current.wind_speed} km/h</span>
            <span className="text-[10px] opacity-70">Wind</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Gauge className="w-4 h-4 opacity-80" />
            <span className="text-xs">{weather.current.pressure} hPa</span>
            <span className="text-[10px] opacity-70">Pressure</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Thermometer className="w-4 h-4 opacity-80" />
            <span className="text-xs">{weather.current.feels_like}°C</span>
            <span className="text-[10px] opacity-70">Feels like</span>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="p-4">
        <p className="text-sm font-medium mb-3">7-Day Forecast</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weather.daily.slice(0, 7).map((day, i) => {
            const DayIcon = getWeatherIcon(day.weather[0].main);
            return (
              <div 
                key={day.dt}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg min-w-[70px] transition-colors",
                  i === 0 ? "bg-primary/10" : "hover:bg-muted"
                )}
              >
                <span className="text-xs text-muted-foreground">{getDayName(day.dt)}</span>
                <DayIcon className={cn(
                  "w-6 h-6 my-2",
                  day.weather[0].main === 'Clear' ? 'text-wheat' : 
                  day.weather[0].main === 'Rain' || day.weather[0].main === 'Drizzle' ? 'text-sky' : 'text-muted-foreground'
                )} />
                <span className="text-sm font-medium">{day.temp.max}°</span>
                <span className="text-xs text-muted-foreground">{day.temp.min}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
