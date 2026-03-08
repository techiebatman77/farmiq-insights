import { StatCard } from '@/components/dashboard/StatCard';
import { LiveWeatherWidget } from '@/components/dashboard/LiveWeatherWidget';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { KeralaMap } from '@/components/dashboard/KeralaMap';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SatelliteNDVI } from '@/components/dashboard/SatelliteNDVI';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { TacticalCorners, CoordinateMarker } from '@/components/ui/TopographicOverlay';
import { Sprout, MapPin, TrendingUp, Droplets } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

export function DashboardView() {
  const { fields } = useApp();
  const { user } = useAuth();
  
  const avgNDVI = fields.length > 0 
    ? (fields.reduce((sum, f) => sum + f.health, 0) / fields.length).toFixed(2)
    : '0.00';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'Farmer';

  return (
    <>
      {/* Hero Section */}
      <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
        <div className="flex items-end justify-between">
          <div>
            <CoordinateMarker lat="9.93" lon="76.26" className="mb-2 block" />
            <h1 className="text-4xl md:text-5xl font-display text-foreground leading-none">
              {getGreeting()},<br />{firstName}
            </h1>
            <p className="text-muted-foreground font-mono text-xs mt-3 uppercase tracking-wider">
              {user?.farm || 'Your farm'} — Kerala, India
            </p>
          </div>
          <div className="hidden md:block text-right">
            <span className="coord-text block">EST. 2024</span>
            <span className="coord-text block mt-1">FIELDS: {fields.length}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <QuickActions />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          title="Total Fields"
          value={fields.length.toString()}
          icon={MapPin}
          iconColor="text-sage"
          delay={100}
        />
        <StatCard
          title="Active Crops"
          value={new Set(fields.map(f => f.crop)).size.toString()}
          change={{ value: 50, type: 'increase' }}
          icon={Sprout}
          iconColor="text-primary"
          delay={150}
        />
        <StatCard
          title="Avg. NDVI"
          value={avgNDVI}
          change={{ value: 8, type: 'increase' }}
          icon={TrendingUp}
          iconColor="text-canyon"
          delay={200}
        />
        <StatCard
          title="Water Usage"
          value="2.4M L"
          change={{ value: 12, type: 'decrease' }}
          icon={Droplets}
          iconColor="text-sky"
          delay={250}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          <TacticalCorners>
            <KeralaMap />
          </TacticalCorners>
          <SatelliteNDVI />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <LiveWeatherWidget />
          <RecentActivity />
          <AlertsPanel />
        </div>
      </div>
    </>
  );
}
