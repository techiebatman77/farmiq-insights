import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Droplets, Leaf, Sun, Scissors, Sprout, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Kerala crop calendar - sowing to harvest timeline
const keralaCropTimeline = [
  {
    crop: 'Paddy (Virippu)',
    sowingStart: 'May',
    sowingEnd: 'Jun',
    harvestStart: 'Sep',
    harvestEnd: 'Oct',
    color: '#22c55e',
    icon: Sprout,
  },
  {
    crop: 'Paddy (Mundakan)',
    sowingStart: 'Aug',
    sowingEnd: 'Sep',
    harvestStart: 'Dec',
    harvestEnd: 'Jan',
    color: '#16a34a',
    icon: Sprout,
  },
  {
    crop: 'Coconut',
    sowingStart: 'Jun',
    sowingEnd: 'Jul',
    harvestStart: 'Year-round',
    harvestEnd: '',
    color: '#3b82f6',
    icon: Leaf,
  },
  {
    crop: 'Rubber',
    sowingStart: 'Jun',
    sowingEnd: 'Aug',
    harvestStart: 'Year 7+',
    harvestEnd: '',
    color: '#8b5cf6',
    icon: Leaf,
  },
  {
    crop: 'Cardamom',
    sowingStart: 'Jun',
    sowingEnd: 'Jul',
    harvestStart: 'Oct',
    harvestEnd: 'Feb',
    color: '#f59e0b',
    icon: Leaf,
  },
  {
    crop: 'Black Pepper',
    sowingStart: 'May',
    sowingEnd: 'Jun',
    harvestStart: 'Dec',
    harvestEnd: 'Mar',
    color: '#0ea5e9',
    icon: Sprout,
  },
  {
    crop: 'Banana (Nendran)',
    sowingStart: 'Apr',
    sowingEnd: 'May',
    harvestStart: 'Year-round',
    harvestEnd: '',
    color: '#eab308',
    icon: Sprout,
  },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const upcomingEvents = [
  { date: 5, month: 'Feb', type: 'irrigation', title: 'Irrigation - Paddy Fields', icon: Droplets, color: 'bg-sky/10 text-sky border-sky/20' },
  { date: 10, month: 'Feb', type: 'fertilize', title: 'Fertilization - Coconut Grove', icon: Leaf, color: 'bg-growth/10 text-growth border-growth/20' },
  { date: 15, month: 'Feb', type: 'pest', title: 'Pest Control - Cardamom', icon: Bug, color: 'bg-warning/10 text-warning border-warning/20' },
  { date: 20, month: 'Feb', type: 'harvest', title: 'Harvest Window - Pepper', icon: Scissors, color: 'bg-wheat/10 text-wheat border-wheat/20' },
  { date: 25, month: 'Feb', type: 'sowing', title: 'Land Prep - Summer Paddy', icon: Sprout, color: 'bg-forest/10 text-forest border-forest/20' },
];

const currentMonth = 'February';
const currentYear = 2025;
const daysInMonth = 28;
const startDay = 6; // Saturday

export function CalendarView() {
  const [view, setView] = useState<'calendar' | 'timeline'>('calendar');

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = 3;

  // Generate calendar grid
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - startDay + 1;
    if (dayNum < 1) return { day: 31 + dayNum, isCurrentMonth: false };
    if (dayNum > daysInMonth) return { day: dayNum - daysInMonth, isCurrentMonth: false };
    return { day: dayNum, isCurrentMonth: true };
  });

  const getEventForDay = (day: number) => {
    return upcomingEvents.find(e => e.date === day);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Crop Calendar</h1>
          <p className="text-muted-foreground">Kerala crop seasons and farming activities</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={view === 'calendar' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('calendar')}
          >
            Calendar
          </Button>
          <Button 
            variant={view === 'timeline' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('timeline')}
          >
            Crop Timeline
          </Button>
        </div>
      </div>

      {view === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-2 stat-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-forest" />
                <h3 className="font-semibold text-lg">{currentMonth} {currentYear}</h3>
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

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {days.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((item, i) => {
                const event = item.isCurrentMonth ? getEventForDay(item.day) : null;
                const isToday = item.day === today && item.isCurrentMonth;
                
                return (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square p-2 rounded-lg text-center relative transition-colors cursor-pointer",
                      !item.isCurrentMonth && "text-muted-foreground/40",
                      isToday && "bg-primary text-primary-foreground",
                      event && !isToday && "bg-muted/50 hover:bg-muted",
                      item.isCurrentMonth && !event && !isToday && "hover:bg-muted/50"
                    )}
                  >
                    <span className="text-sm font-medium">{item.day}</span>
                    {event && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          event.type === 'irrigation' && "bg-sky",
                          event.type === 'fertilize' && "bg-growth",
                          event.type === 'pest' && "bg-warning",
                          event.type === 'harvest' && "bg-wheat",
                          event.type === 'sowing' && "bg-forest"
                        )} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-sky" />
                <span>Irrigation</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-growth" />
                <span>Fertilization</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span>Pest Control</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-wheat" />
                <span>Harvest</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-forest" />
                <span>Sowing</span>
              </div>
            </div>
          </div>

          {/* Upcoming Activities */}
          <div className="stat-card p-6">
            <h3 className="font-semibold mb-4">Upcoming Activities</h3>
            <div className="space-y-3">
              {upcomingEvents.map((event, i) => {
                const Icon = event.icon;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border",
                      event.color
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs opacity-70">{event.month} {event.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Crop Timeline View */
        <div className="stat-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sprout className="w-5 h-5 text-forest" />
            <h3 className="font-semibold">Kerala Crop Seasons (Sowing to Harvest)</h3>
          </div>

          {/* Month headers */}
          <div className="flex mb-4">
            <div className="w-40 shrink-0" />
            <div className="flex-1 grid grid-cols-12 gap-1">
              {months.map((month) => (
                <div key={month} className="text-center text-xs font-medium text-muted-foreground">
                  {month}
                </div>
              ))}
            </div>
          </div>

          {/* Crop rows */}
          <div className="space-y-3">
            {keralaCropTimeline.map((crop, i) => {
              const Icon = crop.icon;
              const sowingStartIdx = months.indexOf(crop.sowingStart);
              const sowingEndIdx = months.indexOf(crop.sowingEnd);
              const harvestStartIdx = crop.harvestStart.includes('-') ? -1 : months.indexOf(crop.harvestStart);
              const harvestEndIdx = crop.harvestEnd ? months.indexOf(crop.harvestEnd) : harvestStartIdx;

              return (
                <div key={i} className="flex items-center">
                  <div className="w-40 shrink-0 flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${crop.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: crop.color }} />
                    </div>
                    <span className="text-sm font-medium truncate">{crop.crop}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-1 h-8">
                    {months.map((month, idx) => {
                      const isSowing = idx >= sowingStartIdx && idx <= sowingEndIdx;
                      const isHarvest = harvestStartIdx >= 0 && (
                        harvestEndIdx >= harvestStartIdx 
                          ? (idx >= harvestStartIdx && idx <= harvestEndIdx)
                          : (idx >= harvestStartIdx || idx <= harvestEndIdx)
                      );
                      const isYearRound = crop.harvestStart === 'Year-round';

                      return (
                        <div 
                          key={month}
                          className={cn(
                            "rounded-sm h-full",
                            isSowing && "opacity-100",
                            isHarvest && !isSowing && "opacity-60",
                            isYearRound && !isSowing && "opacity-30",
                            !isSowing && !isHarvest && !isYearRound && "bg-muted/30"
                          )}
                          style={{
                            backgroundColor: (isSowing || isHarvest || isYearRound) ? crop.color : undefined
                          }}
                          title={isSowing ? 'Sowing' : isHarvest ? 'Harvest' : isYearRound ? 'Production' : ''}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline legend */}
          <div className="flex gap-6 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-growth" />
              <span>Sowing Period</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-growth/60" />
              <span>Harvest Period</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-growth/30" />
              <span>Year-round Production</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
