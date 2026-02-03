import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, X, CloudRain, Bug, Droplets, Thermometer, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface WeatherData {
  temp: number;
  humidity: number;
  rainfall: boolean;
  windSpeed: number;
}

// Dynamic alerts based on weather conditions
function generateDynamicAlerts(weather: WeatherData) {
  const alerts = [];

  // Pest risk based on humidity and rainfall
  if (weather.humidity > 80 && weather.rainfall) {
    alerts.push({
      id: 'pest-high',
      type: 'warning',
      title: 'High Pest Risk Alert',
      message: `High humidity (${weather.humidity}%) combined with recent rainfall creates ideal conditions for pest infestation. Monitor paddy and vegetable crops closely.`,
      time: 'Now',
      field: 'All Fields',
      icon: Bug,
      priority: 'high',
    });
  } else if (weather.humidity > 70) {
    alerts.push({
      id: 'pest-moderate',
      type: 'info',
      title: 'Moderate Pest Risk',
      message: `Humidity at ${weather.humidity}%. Watch for early signs of fungal infections in cardamom and pepper crops.`,
      time: '2 hours ago',
      field: 'Spice Gardens',
      icon: Bug,
      priority: 'medium',
    });
  }

  // Disease risk during monsoon
  if (weather.rainfall && weather.humidity > 75) {
    alerts.push({
      id: 'disease-risk',
      type: 'warning',
      title: 'Fungal Disease Warning',
      message: 'Wet conditions favor rice blast and leaf blight. Consider preventive fungicide application within 24 hours.',
      time: '1 hour ago',
      field: 'Paddy Fields',
      icon: CloudRain,
      priority: 'high',
    });
  }

  // Irrigation advisory
  if (weather.humidity > 85) {
    alerts.push({
      id: 'irrigation-reduce',
      type: 'success',
      title: 'Irrigation Advisory',
      message: `Very high humidity (${weather.humidity}%). Skip today's irrigation to prevent waterlogging and root diseases.`,
      time: '3 hours ago',
      field: 'All Fields',
      icon: Droplets,
      priority: 'medium',
    });
  }

  // Heat stress
  if (weather.temp > 35) {
    alerts.push({
      id: 'heat-stress',
      type: 'warning',
      title: 'Heat Stress Alert',
      message: `High temperature (${weather.temp}°C) may cause heat stress in rubber trees. Ensure adequate mulching around base.`,
      time: '4 hours ago',
      field: 'Rubber Plantation',
      icon: Thermometer,
      priority: 'medium',
    });
  }

  // Wind damage risk
  if (weather.windSpeed > 40) {
    alerts.push({
      id: 'wind-damage',
      type: 'warning',
      title: 'Wind Damage Risk',
      message: `Strong winds (${weather.windSpeed} km/h) expected. Secure banana plants and check coconut tree stability.`,
      time: '30 minutes ago',
      field: 'Banana & Coconut',
      icon: Wind,
      priority: 'high',
    });
  }

  // Add some standard alerts
  alerts.push({
    id: 'harvest-optimal',
    type: 'success',
    title: 'Optimal Harvest Window',
    message: 'Black pepper in Idukki fields has reached optimal maturity. Best harvest window: next 7 days.',
    time: '6 hours ago',
    field: 'Pepper Garden',
    icon: CheckCircle,
    priority: 'low',
  });

  alerts.push({
    id: 'market-update',
    type: 'info',
    title: 'Market Price Update',
    message: 'Rubber prices increased 4.8% this week. Consider selling accumulated stock at current rates.',
    time: '1 day ago',
    field: 'Market',
    icon: Info,
    priority: 'low',
  });

  return alerts;
}

const alertStyles = {
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    iconColor: 'text-warning',
  },
  info: {
    bg: 'bg-sky/10',
    border: 'border-sky/20',
    iconColor: 'text-sky',
  },
  success: {
    bg: 'bg-growth/10',
    border: 'border-growth/20',
    iconColor: 'text-growth',
  },
};

export function AlertsView() {
  const [alerts, setAlerts] = useState<ReturnType<typeof generateDynamicAlerts>>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'warning' | 'info' | 'success'>('all');

  useEffect(() => {
    // Fetch real weather and generate dynamic alerts
    const fetchWeatherAndGenerateAlerts = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=9.9312&longitude=76.2673&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m'
        );
        const data = await response.json();
        
        const weatherData: WeatherData = {
          temp: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          rainfall: [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(data.current.weather_code),
          windSpeed: data.current.wind_speed_10m,
        };

        setAlerts(generateDynamicAlerts(weatherData));
      } catch (error) {
        // Fallback with simulated weather
        setAlerts(generateDynamicAlerts({
          temp: 32,
          humidity: 82,
          rainfall: true,
          windSpeed: 15,
        }));
      }
    };

    fetchWeatherAndGenerateAlerts();
  }, []);

  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
  };

  const filteredAlerts = alerts
    .filter(alert => !dismissedAlerts.includes(alert.id))
    .filter(alert => filter === 'all' || alert.type === filter);

  const highPriorityCount = alerts.filter(a => a.priority === 'high' && !dismissedAlerts.includes(a.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Smart Alerts</h1>
          <p className="text-muted-foreground">AI-powered notifications based on weather and crop conditions</p>
        </div>
        {highPriorityCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-danger/10 rounded-lg border border-danger/20">
            <AlertTriangle className="w-4 h-4 text-danger" />
            <span className="text-sm font-medium text-danger">{highPriorityCount} High Priority</span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'warning', 'info', 'success'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f === 'all' ? 'All Alerts' : f}
            {f !== 'all' && (
              <span className="ml-2 text-xs opacity-70">
                ({alerts.filter(a => a.type === f && !dismissedAlerts.includes(a.id)).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAlerts.map((alert) => {
          const style = alertStyles[alert.type as keyof typeof alertStyles];
          const Icon = alert.icon;
          
          return (
            <div 
              key={alert.id}
              className={cn(
                "stat-card p-5 border-l-4 transition-all hover:shadow-md",
                style.bg,
                alert.type === 'warning' ? 'border-l-warning' :
                alert.type === 'success' ? 'border-l-growth' : 'border-l-sky'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  alert.type === 'warning' ? 'bg-warning/20' :
                  alert.type === 'success' ? 'bg-growth/20' : 'bg-sky/20'
                )}>
                  <Icon className={cn("w-5 h-5", style.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{alert.title}</h4>
                        {alert.priority === 'high' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-danger text-white rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{alert.field}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 shrink-0"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  
                  {alert.type === 'warning' && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="text-xs">
                        View Details
                      </Button>
                      <Button size="sm" className="text-xs bg-forest hover:bg-forest/90">
                        Take Action
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="stat-card p-12 text-center">
          <CheckCircle className="w-12 h-12 text-growth mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">All Clear!</h3>
          <p className="text-muted-foreground">No {filter !== 'all' ? filter : ''} alerts at this time.</p>
        </div>
      )}

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-warning/10">
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-semibold">
              {alerts.filter(a => a.type === 'warning').length}
            </p>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </div>
        </div>
        <div className="stat-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky/10">
            <Info className="w-6 h-6 text-sky" />
          </div>
          <div>
            <p className="text-2xl font-semibold">
              {alerts.filter(a => a.type === 'info').length}
            </p>
            <p className="text-sm text-muted-foreground">Informational</p>
          </div>
        </div>
        <div className="stat-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-growth/10">
            <CheckCircle className="w-6 h-6 text-growth" />
          </div>
          <div>
            <p className="text-2xl font-semibold">
              {alerts.filter(a => a.type === 'success').length}
            </p>
            <p className="text-sm text-muted-foreground">Positive</p>
          </div>
        </div>
      </div>
    </div>
  );
}
