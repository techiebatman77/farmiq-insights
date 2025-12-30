import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { LiveWeatherWidget } from '@/components/dashboard/LiveWeatherWidget';
import { CropHealthChart } from '@/components/dashboard/CropHealthChart';
import { MarketPrices } from '@/components/dashboard/MarketPrices';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { KeralaMap } from '@/components/dashboard/KeralaMap';
import { CropCalendar } from '@/components/dashboard/CropCalendar';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SatelliteNDVI } from '@/components/dashboard/SatelliteNDVI';
import { Leaf, MapPin, TrendingUp, Droplets } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pl-64 transition-all duration-300">
        <Header />
        
        <div className="p-6 max-w-[1600px] mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
            <h1 className="text-3xl font-semibold mb-2">
              Good morning, John 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening on your farm today. Weather looks great for fieldwork!
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <QuickActions />
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Fields"
              value="4"
              icon={MapPin}
              iconColor="bg-forest"
              delay={100}
            />
            <StatCard
              title="Active Crops"
              value="3"
              change={{ value: 50, type: 'increase' }}
              icon={Leaf}
              iconColor="bg-growth"
              delay={150}
            />
            <StatCard
              title="Avg. NDVI"
              value="0.75"
              change={{ value: 8, type: 'increase' }}
              icon={TrendingUp}
              iconColor="bg-wheat"
              delay={200}
            />
            <StatCard
              title="Water Usage"
              value="2.4M L"
              change={{ value: 12, type: 'decrease' }}
              icon={Droplets}
              iconColor="bg-sky"
              delay={250}
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Map & Satellite */}
            <div className="lg:col-span-2 space-y-6">
              <KeralaMap />
              <SatelliteNDVI />
            </div>

            {/* Right Column - Weather & Alerts */}
            <div className="space-y-6">
              <LiveWeatherWidget />
              <AlertsPanel />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <MarketPrices />
            <CropCalendar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
