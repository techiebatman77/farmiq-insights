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
    { icon: Plus, label: 'Add Field', color: 'bg-forest', onClick: () => setAddFieldOpen(true) },
    { icon: Camera, label: 'Log Observation', color: 'bg-sky', onClick: () => setLogObservationOpen(true) },
    { icon: FileText, label: 'Generate Report', color: 'bg-wheat', onClick: () => toast.info('Report generation coming soon! This will export your farm data as PDF/CSV.') },
    { icon: MessageSquare, label: 'Ask Advisor', color: 'bg-growth', onClick: () => toast.info('AI Advisor coming soon! Get personalized farming recommendations.') },
  ];

  return (
    <>
      <div className="flex gap-3 flex-wrap">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="glass"
            className="flex-1 min-w-[140px] h-auto py-4 flex-col gap-2"
            onClick={action.onClick}
          >
            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
              <action.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </div>

      <AddFieldModal open={addFieldOpen} onOpenChange={setAddFieldOpen} />
      <LogObservationModal open={logObservationOpen} onOpenChange={setLogObservationOpen} />
    </>
  );
}
