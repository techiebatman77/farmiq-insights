import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
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
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

const Index = () => {
  const { activeTab } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <main className={cn("transition-all duration-300", sidebarCollapsed ? "pl-20" : "pl-64")}>
        <Header />
        <div className="p-6 max-w-[1600px] mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default Index;
