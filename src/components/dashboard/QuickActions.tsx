import { useState } from 'react';
import { Plus, FileText, Camera, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddFieldModal } from '@/components/modals/AddFieldModal';
import { LogObservationModal } from '@/components/modals/LogObservationModal';
import { toast } from 'sonner';

export function QuickActions() {
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [logObservationOpen, setLogObservationOpen] = useState(false);

  const actions = [
    { icon: Plus, label: 'Add Field', onClick: () => setAddFieldOpen(true) },
    { icon: Camera, label: 'Log Observation', onClick: () => setLogObservationOpen(true) },
    { icon: FileText, label: 'Generate Report', onClick: () => toast.info('Report generation coming soon!') },
    { icon: MessageSquare, label: 'Ask Advisor', onClick: () => toast.info('AI Advisor coming soon!') },
  ];

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="flex-1 min-w-[120px] h-auto py-3 flex-col gap-2 border-border/50 hover:border-primary/30 hover:bg-primary/5 font-mono text-xs uppercase tracking-wider"
            onClick={action.onClick}
          >
            <action.icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <span className="text-muted-foreground">{action.label}</span>
          </Button>
        ))}
      </div>

      <AddFieldModal open={addFieldOpen} onOpenChange={setAddFieldOpen} />
      <LogObservationModal open={logObservationOpen} onOpenChange={setLogObservationOpen} />
    </>
  );
}
