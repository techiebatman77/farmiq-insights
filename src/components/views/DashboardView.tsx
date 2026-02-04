import { StatCard } from '@/components/dashboard/StatCard';
import { LiveWeatherWidget } from '@/components/dashboard/LiveWeatherWidget';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { KeralaMap } from '@/components/dashboard/KeralaMap';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SatelliteNDVI } from '@/components/dashboard/SatelliteNDVI';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Leaf, MapPin, TrendingUp, Droplets } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function DashboardView() {
  const { currentUser, fields } = useApp();
  
  // Calculate stats from fields
  const avgNDVI = fields.length > 0 
    ? (fields.reduce((sum, f) => sum + f.health, 0) / fields.length).toFixed(2)
    : '0.00';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
        <h1 className="text-3xl font-semibold mb-2">
          {getGreeting()}, {currentUser.name.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening on {currentUser.farm} today. Weather looks great for fieldwork!
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
          value={fields.length.toString()}
          icon={MapPin}
          iconColor="bg-forest"
          delay={100}
        />
        <StatCard
          title="Active Crops"
          value={new Set(fields.map(f => f.crop)).size.toString()}
          change={{ value: 50, type: 'increase' }}
          icon={Leaf}
          iconColor="bg-growth"
          delay={150}
        />
        <StatCard
          title="Avg. NDVI"
          value={avgNDVI}
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

        {/* Right Column - Weather, Activity & Alerts */}
        <div className="space-y-6">
          <LiveWeatherWidget />
          <RecentActivity />
          <AlertsPanel />
        </div>
      </div>
    </>
  );
}
