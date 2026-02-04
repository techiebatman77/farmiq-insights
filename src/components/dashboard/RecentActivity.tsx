import { Eye, AlertTriangle, Droplets, Wheat, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDistanceToNow } from 'date-fns';

const typeIcons = {
  observation: Eye,
  issue: AlertTriangle,
  irrigation: Droplets,
  harvest: Wheat,
};

const typeColors = {
  observation: 'bg-growth text-growth',
  issue: 'bg-danger text-danger',
  irrigation: 'bg-sky text-sky',
  harvest: 'bg-wheat text-wheat',
};

export function RecentActivity() {
  const { observations } = useApp();
  const recentObs = observations.slice(0, 5);

  return (
    <div className="stat-card p-4 opacity-0 animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-forest" />
          Recent Activity
        </h3>
        <span className="text-xs text-muted-foreground">{observations.length} total</span>
      </div>

      <div className="space-y-3">
        {recentObs.length > 0 ? (
          recentObs.map(obs => {
            const Icon = typeIcons[obs.type];
            const colorClass = typeColors[obs.type];
            
            return (
              <div key={obs.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className={`w-8 h-8 rounded-lg ${colorClass.split(' ')[0]}/20 flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${colorClass.split(' ')[1]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{obs.fieldName}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{obs.note}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(obs.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity yet. Log an observation to get started!
          </p>
        )}
      </div>
    </div>
  );
}
