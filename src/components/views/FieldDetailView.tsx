import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Leaf, Calendar, TrendingUp, Cloud, Droplets, Thermometer, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp, Field } from '@/context/AppContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// Simulated NDVI history data
function generateNDVIHistory(baseHealth: number) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    month,
    ndvi: Math.max(0.3, Math.min(0.95, baseHealth + (Math.random() - 0.5) * 0.2)),
  }));
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

export function FieldDetailView() {
  const { selectedFieldId, setSelectedFieldId, setActiveTab, fields, observations } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const field = fields.find(f => f.id === selectedFieldId);
  const fieldObservations = observations.filter(o => o.fieldId === selectedFieldId);

  useEffect(() => {
    if (!field) return;

    // Fetch weather for field location
    const fetchWeather = async () => {
      try {
        // Use Kerala coordinates
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=10.8505&longitude=76.2711&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );
        const data = await response.json();
        
        const weatherCodes: Record<number, string> = {
          0: 'Clear sky',
          1: 'Mainly clear',
          2: 'Partly cloudy',
          3: 'Overcast',
          45: 'Foggy',
          51: 'Light drizzle',
          61: 'Light rain',
          63: 'Moderate rain',
          65: 'Heavy rain',
          80: 'Rain showers',
          95: 'Thunderstorm',
        };

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          condition: weatherCodes[data.current.weather_code] || 'Unknown',
        });
      } catch (error) {
        console.error('Weather fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [field]);

  if (!field) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Field not found</p>
        <Button onClick={() => setActiveTab('map')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Map
        </Button>
      </div>
    );
  }

  const ndviHistory = generateNDVIHistory(field.health);
  const healthColor = field.health >= 0.8 ? 'text-growth' : field.health >= 0.6 ? 'text-wheat' : 'text-danger';
  const healthBg = field.health >= 0.8 ? 'bg-growth' : field.health >= 0.6 ? 'bg-wheat' : 'bg-danger';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => {
            setSelectedFieldId(null);
            setActiveTab('map');
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{field.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {field.location}
          </p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-lg ${healthBg} flex items-center justify-center`}>
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Health Score</p>
              <p className={`text-2xl font-bold ${healthColor}`}>
                {(field.health * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-forest flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Crop</p>
              <p className="text-2xl font-bold">{field.crop}</p>
            </div>
          </div>
        </div>

        <div className="stat-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-sky flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Area</p>
              <p className="text-2xl font-bold">{field.area || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="stat-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-wheat flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Planted</p>
              <p className="text-2xl font-bold">
                {field.plantedDate ? new Date(field.plantedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NDVI History Chart */}
        <div className="lg:col-span-2 stat-card p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-growth" />
            NDVI History (12 Months)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ndviHistory}>
                <defs>
                  <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--growth))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--growth))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[0, 1]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [value.toFixed(2), 'NDVI']}
                />
                <Area
                  type="monotone"
                  dataKey="ndvi"
                  stroke="hsl(var(--growth))"
                  fill="url(#ndviGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Local Weather */}
        <div className="stat-card p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-sky" />
            Local Weather
          </h3>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-muted rounded" />
              <div className="h-8 bg-muted rounded" />
              <div className="h-8 bg-muted rounded" />
            </div>
          ) : weather ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-4xl font-bold">{weather.temperature}°C</p>
                <p className="text-muted-foreground">{weather.condition}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Droplets className="w-4 h-4" />
                    Humidity
                  </span>
                  <span className="font-medium">{weather.humidity}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Wind className="w-4 h-4" />
                    Wind Speed
                  </span>
                  <span className="font-medium">{weather.windSpeed} km/h</span>
                </div>
              </div>

              {/* Smart Advice */}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">💡 Smart Advice</p>
                <p className="text-xs text-muted-foreground">
                  {weather.humidity > 70 
                    ? 'High humidity detected. Consider reducing irrigation by 20% today.'
                    : weather.temperature > 35
                    ? 'Hot conditions. Ensure adequate irrigation in the morning.'
                    : 'Conditions are optimal for field work.'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Weather data unavailable</p>
          )}
        </div>
      </div>

      {/* Recent Observations */}
      <div className="stat-card p-4">
        <h3 className="font-semibold mb-4">Recent Observations</h3>
        {fieldObservations.length > 0 ? (
          <div className="space-y-3">
            {fieldObservations.map(obs => (
              <div key={obs.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  obs.type === 'issue' ? 'bg-danger' : 
                  obs.type === 'irrigation' ? 'bg-sky' : 
                  obs.type === 'harvest' ? 'bg-wheat' : 'bg-growth'
                }`} />
                <div>
                  <p className="text-sm">{obs.note}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {obs.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No observations recorded for this field yet.</p>
        )}
      </div>
    </div>
  );
}
