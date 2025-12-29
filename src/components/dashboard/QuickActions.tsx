import { Plus, FileText, Camera, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  { icon: Plus, label: 'Add Field', color: 'bg-forest' },
  { icon: Camera, label: 'Log Observation', color: 'bg-sky' },
  { icon: FileText, label: 'Generate Report', color: 'bg-wheat' },
  { icon: MessageSquare, label: 'Ask Advisor', color: 'bg-growth' },
];

export function QuickActions() {
  return (
    <div className="flex gap-3 flex-wrap">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="glass"
          className="flex-1 min-w-[140px] h-auto py-4 flex-col gap-2"
        >
          <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
            <action.icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">{action.label}</span>
        </Button>
      ))}
    </div>
  );
}
