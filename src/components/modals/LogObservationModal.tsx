import { useState } from 'react';
import { BookOpen, Eye, AlertTriangle, Droplets, Wheat } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

interface LogObservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const observationTypes = [
  { value: 'observation', label: 'General Observation', icon: Eye },
  { value: 'issue', label: 'Issue/Problem', icon: AlertTriangle },
  { value: 'irrigation', label: 'Irrigation Activity', icon: Droplets },
  { value: 'harvest', label: 'Harvest Update', icon: Wheat },
] as const;

export function LogObservationModal({ open, onOpenChange }: LogObservationModalProps) {
  const { fields, addObservation } = useApp();
  const [formData, setFormData] = useState({
    fieldId: '',
    type: 'observation' as 'observation' | 'issue' | 'irrigation' | 'harvest',
    note: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fieldId || !formData.note.trim()) {
      toast.error('Please select a field and add a note');
      return;
    }

    const field = fields.find(f => f.id === parseInt(formData.fieldId));
    if (!field) return;

    addObservation({
      fieldId: field.id,
      fieldName: field.name,
      type: formData.type,
      note: formData.note.trim(),
    });

    toast.success('Observation logged successfully!');
    setFormData({ fieldId: '', type: 'observation', note: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky" />
            Log Field Observation
          </DialogTitle>
          <DialogDescription>
            Record observations, issues, or activities for your fields. These will appear in your activity feed.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="field">Select Field *</Label>
            <Select 
              value={formData.fieldId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, fieldId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map(field => (
                  <SelectItem key={field.id} value={field.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ 
                          backgroundColor: field.health >= 0.8 ? '#22c55e' : field.health >= 0.6 ? '#eab308' : '#ef4444' 
                        }} 
                      />
                      {field.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Observation Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {observationTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: value }))}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                    formData.type === value 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Notes *</Label>
            <Textarea
              id="note"
              placeholder="Describe what you observed, any issues found, or activities performed..."
              rows={4}
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-sky hover:bg-sky/90">
              Save Observation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
