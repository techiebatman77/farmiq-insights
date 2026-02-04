import { Settings, Bell, Palette, Globe, Database, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-forest" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your AgriSmart application preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Bell className="w-4 h-4 text-sky" />
              Notifications
            </div>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="alerts" className="text-sm">Weather Alerts</Label>
                <Switch id="alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pest" className="text-sm">Pest Risk Warnings</Label>
                <Switch id="pest" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="market" className="text-sm">Market Price Updates</Label>
                <Switch id="market" defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          {/* Display */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Palette className="w-4 h-4 text-wheat" />
              Display
            </div>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode" className="text-sm">Dark Mode</Label>
                <Switch id="darkMode" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="animations" className="text-sm">Animations</Label>
                <Switch id="animations" defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          {/* Language */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="w-4 h-4 text-growth" />
              Language & Region
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              Currently set to: <span className="text-foreground">English (India)</span>
            </p>
          </div>

          <Separator />

          {/* Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="w-4 h-4 text-forest" />
              Data Management
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              Local storage: <span className="text-foreground">4 fields, 3 observations</span>
            </p>
          </div>

          <Separator />

          {/* Privacy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="w-4 h-4 text-danger" />
              Privacy & Security
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              All data is stored locally. Enable cloud sync in a future update.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
