import { Calendar, ChevronLeft, ChevronRight, Droplets, Leaf, Sun, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const events = [
  { date: 15, type: 'irrigation', title: 'Irrigation - Field A', icon: Droplets },
  { date: 18, type: 'fertilize', title: 'Fertilization - Field B', icon: Leaf },
  { date: 22, type: 'sowing', title: 'Sowing Window Starts', icon: Sun },
  { date: 28, type: 'harvest', title: 'Harvest - Field C', icon: Scissors },
];

const eventColors = {
  irrigation: 'bg-sky/10 text-sky border-sky/20',
  fertilize: 'bg-growth/10 text-growth border-growth/20',
  sowing: 'bg-wheat/10 text-wheat border-wheat/20',
  harvest: 'bg-warning/10 text-warning border-warning/20',
};

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentDate = 12;

// Generate calendar days
const calendarDays = Array.from({ length: 35 }, (_, i) => {
  const day = i - 4; // Start from previous month
  if (day < 1) return { day: 28 + day, isCurrentMonth: false };
  if (day > 31) return { day: day - 31, isCurrentMonth: false };
  return { day, isCurrentMonth: true };
});

export function CropCalendar() {
  return (
    <div className="stat-card opacity-0 animate-slide-up" style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Crop Calendar</h3>
          <p className="text-sm text-muted-foreground">January 2025</p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mini calendar */}
      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((item, i) => {
            const event = events.find(e => e.date === item.day && item.isCurrentMonth);
            const isToday = item.day === currentDate && item.isCurrentMonth;
            
            return (
              <div
                key={i}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-lg text-sm relative transition-colors",
                  !item.isCurrentMonth && "text-muted-foreground/50",
                  isToday && "bg-primary text-primary-foreground font-medium",
                  event && !isToday && "bg-muted",
                  "hover:bg-muted cursor-pointer"
                )}
              >
                {item.day}
                {event && (
                  <span className={cn(
                    "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                    event.type === 'irrigation' && "bg-sky",
                    event.type === 'fertilize' && "bg-growth",
                    event.type === 'sowing' && "bg-wheat",
                    event.type === 'harvest' && "bg-warning"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming events */}
      <div className="border-t border-border/50 pt-4">
        <p className="text-sm font-medium mb-3">Upcoming Activities</p>
        <div className="space-y-2">
          {events.map((event) => {
            const Icon = event.icon;
            return (
              <div
                key={event.date}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border",
                  eventColors[event.type as keyof typeof eventColors]
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs opacity-70">Jan {event.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
