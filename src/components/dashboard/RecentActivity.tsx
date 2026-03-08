import { Eye, AlertTriangle, Droplets, Wheat, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const typeIcons = {
  observation: Eye,
  issue: AlertTriangle,
  irrigation: Droplets,
  harvest: Wheat,
};

export function RecentActivity() {
  const { observations } = useApp();
  const recentObs = observations.slice(0, 5);

  return (
    <div className="stat-card p-4 tactical-corners opacity-0 animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm text-foreground tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-sage" strokeWidth={1.5} />
          ACTIVITY
        </h3>
        <span className="coord-text">{observations.length} total</span>
      </div>

      <div className="space-y-2">
        {recentObs.length > 0 ? (
          recentObs.map(obs => {
            const Icon = typeIcons[obs.type];
            return (
              <div key={obs.id} className="flex items-start gap-3 p-2.5 bg-muted/20 border border-border/20 hover:border-border/40 transition-colors">
                <Icon className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-foreground truncate">{obs.fieldName}</p>
                  <p className="text-[10px] font-mono text-muted-foreground line-clamp-1 mt-0.5">{obs.note}</p>
                  <p className="coord-text mt-1">
                    {formatDistanceToNow(obs.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs font-mono text-muted-foreground text-center py-4">
            No activity yet.
          </p>
        )}
      </div>
    </div>
  );
}
