import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Sun, CloudRain, Thermometer, Eye, Gauge, Loader2, Umbrella, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
    humidity: number;
    precipitation_probability: number;
  }[];
  hourly: {
    dt: number;
    temp: number;
    humidity: number;
  }[];
}

const KERALA_CITIES = [
  { name: 'Kochi', lat: 9.9312, lon: 76.2673 },
  { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366 },
  { name: 'Kozhikode', lat: 11.2588, lon: 75.7804 },
  { name: 'Thrissur', lat: 10.5276, lon: 76.2144 },
  { name: 'Alappuzha', lat: 9.4981, lon: 76.3388 },
  { name: 'Kottayam', lat: 9.5916, lon: 76.5222 },
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
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function calculateIrrigationAdvice(humidity: number, temp: number, isRainy: boolean): { message: string; reduction: number; type: 'warning' | 'success' | 'info' } {
  if (isRainy) {
    return {
      message: "Rainfall expected. Skip irrigation today to prevent waterlogging and save resources.",
      reduction: 100,
      type: 'success'
    };
  }
  
  if (humidity > 80) {
    return {
      message: `High humidity detected (${humidity}%). Reduce irrigation by 30% to prevent root rot and fungal diseases.`,
      reduction: 30,
      type: 'warning'
    };
  }
  
  if (humidity > 65) {
    return {
      message: `Moderate humidity (${humidity}%). Reduce irrigation by 20% today for optimal soil moisture.`,
      reduction: 20,
      type: 'info'
    };
  }
  
  if (temp > 35) {
    return {
      message: `High temperature (${temp}°C). Consider morning irrigation to reduce evaporation loss.`,
      reduction: 0,
      type: 'warning'
    };
  }
  
  return {
    message: "Normal conditions. Proceed with standard irrigation schedule.",
    reduction: 0,
    type: 'success'
  };
}

export function WeatherView() {
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
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=temperature_2m,relative_humidity_2m&timezone=Asia/Kolkata&forecast_days=7`
        );
        
        if (!response.ok) throw new Error('Failed to fetch weather');
        
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
            }],
            humidity: 75,
            precipitation_probability: data.daily.precipitation_probability_max[i] || 0,
          })),
          hourly: data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
            dt: new Date(time).getTime() / 1000,
            temp: Math.round(data.hourly.temperature_2m[i]),
            humidity: data.hourly.relative_humidity_2m[i],
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
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sky" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="stat-card p-6">
        <p className="text-muted-foreground text-center">{error || 'No data available'}</p>
      </div>
    );
  }

  const CurrentIcon = getWeatherIcon(weather.current.weather[0].main);
  const isRainy = ['Rain', 'Drizzle', 'Thunderstorm'].includes(weather.current.weather[0].main);
  const irrigationAdvice = calculateIrrigationAdvice(weather.current.humidity, weather.current.temp, isRainy);

  const hourlyChartData = weather.hourly.map((hour) => ({
    time: new Date(hour.dt * 1000).getHours() + ':00',
    temp: hour.temp,
    humidity: hour.humidity,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Weather & Irrigation</h1>
          <p className="text-muted-foreground">Real-time weather data and smart irrigation recommendations</p>
        </div>
      </div>

      {/* City Selector */}
      <div className="flex gap-2 flex-wrap">
        {KERALA_CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() => setSelectedCity(city)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              selectedCity.name === city.name
                ? "bg-sky text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {city.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather Card */}
        <div className="stat-card p-0 overflow-hidden">
          <div className="bg-gradient-sky p-6 text-accent-foreground">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-80">{selectedCity.name}, Kerala</p>
                <p className="text-5xl font-semibold mt-2">{weather.current.temp}°C</p>
                <p className="text-sm mt-2 opacity-90 capitalize">{weather.current.weather[0].description}</p>
              </div>
              <CurrentIcon className="w-20 h-20 opacity-90" />
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky/10">
                <Droplets className="w-5 h-5 text-sky" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-semibold">{weather.current.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="font-semibold">{weather.current.wind_speed} km/h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pressure</p>
                <p className="font-semibold">{weather.current.pressure} hPa</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-wheat/10">
                <Thermometer className="w-5 h-5 text-wheat" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Feels Like</p>
                <p className="font-semibold">{weather.current.feels_like}°C</p>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Irrigation Advice */}
        <div className="lg:col-span-2">
          <div className={cn(
            "stat-card p-6 border-l-4",
            irrigationAdvice.type === 'warning' ? 'border-l-warning bg-warning/5' :
            irrigationAdvice.type === 'success' ? 'border-l-growth bg-growth/5' :
            'border-l-sky bg-sky/5'
          )}>
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                irrigationAdvice.type === 'warning' ? 'bg-warning/10' :
                irrigationAdvice.type === 'success' ? 'bg-growth/10' :
                'bg-sky/10'
              )}>
                <Umbrella className={cn(
                  "w-8 h-8",
                  irrigationAdvice.type === 'warning' ? 'text-warning' :
                  irrigationAdvice.type === 'success' ? 'text-growth' :
                  'text-sky'
                )} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Smart Irrigation Advice</h3>
                <p className="text-muted-foreground">{irrigationAdvice.message}</p>
                {irrigationAdvice.reduction > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm">Recommended reduction:</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-semibold",
                      irrigationAdvice.type === 'warning' ? 'bg-warning text-warning-foreground' :
                      'bg-growth text-white'
                    )}>
                      {irrigationAdvice.reduction}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Tips */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="stat-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-wheat" />
                <span className="font-medium text-sm">Best Irrigation Time</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Early morning (5-7 AM) for minimum evaporation loss
              </p>
            </div>
            <div className="stat-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="font-medium text-sm">Monsoon Alert</span>
              </div>
              <p className="text-xs text-muted-foreground">
                SW Monsoon active. Monitor drainage in paddy fields.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="stat-card p-6">
        <h3 className="font-semibold mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-7 gap-2">
          {weather.daily.slice(0, 7).map((day, i) => {
            const DayIcon = getWeatherIcon(day.weather[0].main);
            return (
              <div 
                key={day.dt}
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl transition-colors text-center",
                  i === 0 ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                )}
              >
                <span className="text-sm font-medium">{getDayName(day.dt)}</span>
                <DayIcon className={cn(
                  "w-8 h-8 my-3",
                  day.weather[0].main === 'Clear' ? 'text-wheat' : 
                  ['Rain', 'Drizzle', 'Thunderstorm'].includes(day.weather[0].main) ? 'text-sky' : 'text-muted-foreground'
                )} />
                <span className="text-lg font-semibold">{day.temp.max}°</span>
                <span className="text-sm text-muted-foreground">{day.temp.min}°</span>
                {day.precipitation_probability > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-sky">
                    <Droplets className="w-3 h-3" />
                    <span>{day.precipitation_probability}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 24-Hour Chart */}
      <div className="stat-card p-6">
        <h3 className="font-semibold mb-4">24-Hour Temperature & Humidity</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyChartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                interval={2}
              />
              <YAxis 
                yAxisId="temp"
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <YAxis 
                yAxisId="humidity"
                orientation="right"
                tick={{ fontSize: 11 }} 
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                yAxisId="temp"
                type="monotone" 
                dataKey="temp" 
                stroke="hsl(var(--wheat))" 
                strokeWidth={2}
                dot={false}
                name="Temperature (°C)"
              />
              <Line 
                yAxisId="humidity"
                type="monotone" 
                dataKey="humidity" 
                stroke="hsl(var(--sky))" 
                strokeWidth={2}
                dot={false}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-wheat rounded" />
            <span>Temperature (°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-sky rounded" />
            <span>Humidity (%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
