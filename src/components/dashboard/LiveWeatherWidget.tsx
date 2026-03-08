import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Sun, CloudRain, Thermometer, Gauge, Loader2 } from 'lucide-react';
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

const KERALA_CITIES = [
  { name: 'Kochi', lat: 9.9312, lon: 76.2673 },
  { name: 'Trivandrum', lat: 8.5241, lon: 76.9366 },
  { name: 'Kozhikode', lat: 11.2588, lon: 75.7804 },
  { name: 'Thrissur', lat: 10.5276, lon: 76.2144 },
];

const weatherIcons: Record<string, typeof Sun> = {
  Clear: Sun, Clouds: Cloud, Rain: CloudRain, Drizzle: CloudRain, Thunderstorm: CloudRain,
};

function getWeatherIcon(condition: string) {
  return weatherIcons[condition] || Cloud;
}

function getDayName(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
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
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia/Kolkata&forecast_days=7`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
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
        setError('Failed to load weather');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  if (loading) {
    return (
      <div className="stat-card flex items-center justify-center h-[260px] opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <Loader2 className="w-6 h-6 animate-spin text-sage" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="stat-card opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <p className="text-muted-foreground text-center font-mono text-xs">{error || 'No data'}</p>
      </div>
    );
  }

  const CurrentIcon = getWeatherIcon(weather.current.weather[0].main);

  return (
    <div className="stat-card p-0 overflow-hidden tactical-corners opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
      {/* City selector */}
      <div className="p-3 border-b border-border/30">
        <div className="flex gap-1 overflow-x-auto">
          {KERALA_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => setSelectedCity(city)}
              className={cn(
                "px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition-all",
                selectedCity.name === city.name
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current */}
      <div className="p-5 border-b border-border/30">
        <div className="flex items-start justify-between">
          <div>
            <p className="coord-text mb-1">{selectedCity.name}, Kerala</p>
            <p className="text-4xl font-display text-foreground">{weather.current.temp}°C</p>
            <p className="text-xs font-mono text-muted-foreground mt-1 capitalize">{weather.current.weather[0].description}</p>
          </div>
          <CurrentIcon className="w-10 h-10 text-sage opacity-60" strokeWidth={1} />
        </div>
        
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { icon: Droplets, val: `${weather.current.humidity}%`, label: 'Humid' },
            { icon: Wind, val: `${weather.current.wind_speed}km/h`, label: 'Wind' },
            { icon: Gauge, val: `${weather.current.pressure}`, label: 'hPa' },
            { icon: Thermometer, val: `${weather.current.feels_like}°`, label: 'Feels' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <item.icon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-[10px] font-mono text-foreground">{item.val}</span>
              <span className="text-[8px] font-mono text-muted-foreground uppercase">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day */}
      <div className="p-3">
        <p className="coord-text mb-2">7-Day Forecast</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {weather.daily.slice(0, 7).map((day, i) => {
            const DayIcon = getWeatherIcon(day.weather[0].main);
            return (
              <div 
                key={day.dt}
                className={cn(
                  "flex flex-col items-center p-2 min-w-[52px] transition-colors",
                  i === 0 ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/30"
                )}
              >
                <span className="text-[9px] font-mono text-muted-foreground">{getDayName(day.dt)}</span>
                <DayIcon className="w-4 h-4 my-1.5 text-sage" strokeWidth={1.5} />
                <span className="text-[10px] font-mono text-foreground">{day.temp.max}°</span>
                <span className="text-[9px] font-mono text-muted-foreground">{day.temp.min}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
