import { Cloud, Droplets, Wind, Sun, CloudRain } from 'lucide-react';
import { cn } from '@/lib/utils';

const forecast = [
  { day: 'Today', icon: Sun, temp: 28, condition: 'Sunny' },
  { day: 'Tue', icon: Cloud, temp: 25, condition: 'Cloudy' },
  { day: 'Wed', icon: CloudRain, temp: 22, condition: 'Rain' },
  { day: 'Thu', icon: CloudRain, temp: 20, condition: 'Rain' },
  { day: 'Fri', icon: Sun, temp: 26, condition: 'Sunny' },
  { day: 'Sat', icon: Cloud, temp: 24, condition: 'Cloudy' },
  { day: 'Sun', icon: Sun, temp: 27, condition: 'Sunny' },
];

export function WeatherWidget() {
  return (
    <div className="stat-card p-0 overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
      {/* Current Weather */}
      <div className="bg-gradient-sky p-6 text-accent-foreground">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-80">Current Weather</p>
            <p className="text-4xl font-semibold mt-1">28°C</p>
            <p className="text-sm mt-1 opacity-90">Sunny, Clear skies</p>
          </div>
          <Sun className="w-16 h-16 opacity-90" />
        </div>
        
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 opacity-80" />
            <span className="text-sm">45%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 opacity-80" />
            <span className="text-sm">12 km/h</span>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="p-4">
        <p className="text-sm font-medium mb-3">7-Day Forecast</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {forecast.map((day, i) => (
            <div 
              key={day.day}
              className={cn(
                "flex flex-col items-center p-3 rounded-lg min-w-[70px] transition-colors",
                i === 0 ? "bg-primary/10" : "hover:bg-muted"
              )}
            >
              <span className="text-xs text-muted-foreground">{day.day}</span>
              <day.icon className={cn(
                "w-6 h-6 my-2",
                day.condition === 'Sunny' ? 'text-wheat' : 
                day.condition === 'Rain' ? 'text-sky' : 'text-muted-foreground'
              )} />
              <span className="text-sm font-medium">{day.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
