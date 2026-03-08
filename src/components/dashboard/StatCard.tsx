import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor = 'text-primary',
  className,
  delay = 0 
}: StatCardProps) {
  return (
    <div 
      className={cn(
        "stat-card tactical-corners opacity-0 animate-slide-up",
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">{title}</p>
          <p className="text-2xl font-display text-foreground">{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-mono mt-2 flex items-center gap-1",
              change.type === 'increase' ? 'text-primary' : 'text-danger'
            )}>
              <span>{change.type === 'increase' ? '▲' : '▼'}</span>
              {Math.abs(change.value)}%
              <span className="text-muted-foreground ml-1">vs last</span>
            </p>
          )}
        </div>
        <Icon className={cn("w-5 h-5 opacity-60", iconColor)} strokeWidth={1.5} />
      </div>
    </div>
  );
}
