import { useState } from 'react';
import { Sidebar, MobileBottomNav } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardView } from '@/components/views/DashboardView';
import { FieldMapView } from '@/components/views/FieldMapView';
import { CropHealthView } from '@/components/views/CropHealthView';
import { WeatherView } from '@/components/views/WeatherView';
import { MarketView } from '@/components/views/MarketView';
import { CalendarView } from '@/components/views/CalendarView';
import { AlertsView } from '@/components/views/AlertsView';
import { FieldDetailView } from '@/components/views/FieldDetailView';
import { DiseaseHistoryView } from '@/components/views/DiseaseHistoryView';
import { FarmDoctorView } from '@/components/views/FarmDoctorView';
import { TopographicOverlay } from '@/components/ui/TopographicOverlay';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

const Index = () => {
  const { activeTab } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'map': return <FieldMapView />;
      case 'health': return <CropHealthView />;
      case 'weather': return <WeatherView />;
      case 'market': return <MarketView />;
      case 'calendar': return <CalendarView />;
      case 'alerts': return <AlertsView />;
      case 'field-detail': return <FieldDetailView />;
      case 'disease': return <DiseaseHistoryView />;
      case 'farm-doctor': return <FarmDoctorView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Global topographic overlay */}
      <TopographicOverlay className="fixed inset-0 z-0 text-sage" opacity={0.06} />
      
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      </div>
      
      <main className={cn(
        "relative z-10 transition-all duration-300",
        "md:pl-16", // collapsed sidebar width on desktop
        sidebarCollapsed ? "md:pl-16" : "md:pl-56"
      )}>
        <Header />
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto pb-20 md:pb-6">
          {renderView()}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
};

export default Index;
