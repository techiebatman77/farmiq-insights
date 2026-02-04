import { useState } from 'react';
import { MapPin, Leaf, Ruler } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface AddFieldModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const cropTypes = ['Rice', 'Coconut', 'Rubber', 'Cardamom', 'Pepper', 'Tea', 'Coffee', 'Banana', 'Tapioca'];
const locations = ['Alappuzha', 'Thrissur', 'Kottayam', 'Idukki', 'Wayanad', 'Palakkad', 'Ernakulam', 'Kannur'];

// Generate random coordinates in Kerala
function generateKeralaCoords(location: string): [number, number][] {
  const locationCoords: Record<string, [number, number]> = {
    'Alappuzha': [9.4981, 76.3388],
    'Thrissur': [10.5276, 76.2144],
    'Kottayam': [9.5916, 76.5222],
    'Idukki': [9.9189, 77.1025],
    'Wayanad': [11.6854, 76.1320],
    'Palakkad': [10.7867, 76.6548],
    'Ernakulam': [9.9816, 76.2999],
    'Kannur': [11.8745, 75.3704],
  };
  
  const base = locationCoords[location] || [10.0, 76.5];
  const offset = 0.01;
  
  return [
    [base[0], base[1]],
    [base[0] + offset, base[1]],
    [base[0] + offset, base[1] + offset],
    [base[0], base[1] + offset],
  ];
}

export function AddFieldModal({ open, onOpenChange }: AddFieldModalProps) {
  const { addField } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    crop: '',
    location: '',
    area: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.crop || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newField = {
      name: `${formData.name} - ${formData.location}`,
      crop: formData.crop,
      health: 0.7 + Math.random() * 0.25, // Random health 0.7-0.95
      location: formData.location,
      area: formData.area || '1.0 hectares',
      plantedDate: new Date().toISOString().split('T')[0],
      coords: generateKeralaCoords(formData.location),
    };

    addField(newField);
    toast.success(`Field "${newField.name}" added successfully!`);
    setFormData({ name: '', crop: '', location: '', area: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-forest" />
            Add New Field
          </DialogTitle>
          <DialogDescription>
            Add a new field to your farm. It will appear on the map and in your field list.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Field Name *</Label>
            <Input
              id="name"
              placeholder="e.g., North Paddy Field"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crop">Crop Type *</Label>
            <Select 
              value={formData.crop} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, crop: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                {cropTypes.map(crop => (
                  <SelectItem key={crop} value={crop}>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-growth" />
                      {crop}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select 
              value={formData.location} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sky" />
                      {loc}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area (hectares)</Label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="area"
                placeholder="e.g., 2.5"
                className="pl-10"
                value={formData.area}
                onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-forest hover:bg-forest/90">
              Add Field
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
