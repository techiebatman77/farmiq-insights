import { useState } from 'react';
import { Bell, Search, User, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { DiseaseDetectionModal } from '@/components/disease/DiseaseDetectionModal';

export function Header() {
  const { searchQuery, setSearchQuery, setActiveTab, addDiseaseResult } = useApp();
  const { user } = useAuth();
  const [diseaseModalOpen, setDiseaseModalOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search fields, crops, markets..." 
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="forest" size="sm" onClick={() => setDiseaseModalOpen(true)} className="hidden sm:flex">
            <Stethoscope className="w-4 h-4 mr-1" />
            🚨 AI Doctor
          </Button>
          <Button variant="forest" size="icon" onClick={() => setDiseaseModalOpen(true)} className="sm:hidden">
            <Stethoscope className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="icon" className="relative" onClick={() => setActiveTab('alerts')}>
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-primary-foreground text-xs rounded-full flex items-center justify-center">3</span>
          </Button>

          <div className="w-px h-8 bg-border" />

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-hero flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium">{user?.name || 'Farmer'}</p>
              <p className="text-xs text-muted-foreground">{user?.farm || 'My Farm'}</p>
            </div>
          </div>
        </div>
      </header>

      <DiseaseDetectionModal open={diseaseModalOpen} onOpenChange={setDiseaseModalOpen} onResultSaved={addDiseaseResult} />
    </>
  );
}
