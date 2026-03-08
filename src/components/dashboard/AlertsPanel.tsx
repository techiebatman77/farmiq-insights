import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const alerts = [
  { id: 1, type: 'warning', title: 'Pest Risk Alert', message: 'High aphid risk in Field B. Consider preventive spraying.', time: '2h ago', field: 'Field B' },
  { id: 2, type: 'info', title: 'Harvest Window', message: 'Wheat in Field A ready. Best window: next 5 days.', time: '5h ago', field: 'Field A' },
  { id: 3, type: 'success', title: 'Irrigation Done', message: 'Field C irrigation completed successfully.', time: '1d ago', field: 'Field C' },
];

const alertStyles = {
  warning: { icon: AlertTriangle, color: 'text-warning', border: 'border-warning/20' },
  info: { icon: Info, color: 'text-sky', border: 'border-sky/20' },
  success: { icon: CheckCircle, color: 'text-primary', border: 'border-primary/20' },
};

export function AlertsPanel() {
  return (
    <div className="stat-card tactical-corners opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm text-foreground tracking-wider">ALERTS</h3>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-danger/20 text-danger">3 NEW</span>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => {
          const style = alertStyles[alert.type as keyof typeof alertStyles];
          const Icon = style.icon;
          return (
            <div key={alert.id} className={cn("p-3 border bg-muted/10 transition-all hover:bg-muted/20", style.border)}>
              <div className="flex items-start gap-2.5">
                <Icon className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", style.color)} strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-mono text-foreground">{alert.title}</h4>
                    <Button variant="ghost" size="icon" className="h-5 w-5 -mr-1 -mt-0.5">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mt-1">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="coord-text">{alert.time}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-muted/30 text-muted-foreground">{alert.field}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="ghost" className="w-full mt-3 h-8 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        View All Alerts
      </Button>
    </div>
  );
}
