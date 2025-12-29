import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const alerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Pest Risk Alert',
    message: 'High aphid risk detected in Field B. Consider preventive spraying.',
    time: '2 hours ago',
    field: 'Field B',
  },
  {
    id: 2,
    type: 'info',
    title: 'Optimal Harvest Window',
    message: 'Wheat in Field A is ready for harvest. Best window: next 5 days.',
    time: '5 hours ago',
    field: 'Field A',
  },
  {
    id: 3,
    type: 'success',
    title: 'Irrigation Complete',
    message: 'Scheduled irrigation for Field C completed successfully.',
    time: '1 day ago',
    field: 'Field C',
  },
];

const alertStyles = {
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    icon: AlertTriangle,
    iconColor: 'text-warning',
  },
  info: {
    bg: 'bg-sky/10',
    border: 'border-sky/20',
    icon: Info,
    iconColor: 'text-sky',
  },
  success: {
    bg: 'bg-growth/10',
    border: 'border-growth/20',
    icon: CheckCircle,
    iconColor: 'text-growth',
  },
};

export function AlertsPanel() {
  return (
    <div className="stat-card opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Recent Alerts</h3>
          <p className="text-sm text-muted-foreground">Action items for your farm</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-danger text-primary-foreground font-medium">
          3 New
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const style = alertStyles[alert.type as keyof typeof alertStyles];
          const Icon = style.icon;
          
          return (
            <div 
              key={alert.id}
              className={cn(
                "p-4 rounded-lg border transition-all hover:shadow-soft",
                style.bg,
                style.border
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5", style.iconColor)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-1">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{alert.field}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="ghost" className="w-full mt-4">
        View All Alerts
      </Button>
    </div>
  );
}
