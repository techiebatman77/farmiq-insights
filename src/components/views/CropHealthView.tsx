import { useState } from 'react';
import { Satellite, Calendar, TrendingUp, Info, Leaf, AlertTriangle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const ndviTimeSeriesData = [
  { date: 'Jan', paddy: 0.45, coconut: 0.72, rubber: 0.68, cardamom: 0.71 },
  { date: 'Feb', paddy: 0.52, coconut: 0.74, rubber: 0.70, cardamom: 0.73 },
  { date: 'Mar', paddy: 0.61, coconut: 0.71, rubber: 0.72, cardamom: 0.75 },
  { date: 'Apr', paddy: 0.72, coconut: 0.69, rubber: 0.74, cardamom: 0.72 },
  { date: 'May', paddy: 0.78, coconut: 0.73, rubber: 0.71, cardamom: 0.70 },
  { date: 'Jun', paddy: 0.82, coconut: 0.76, rubber: 0.69, cardamom: 0.74 },
  { date: 'Jul', paddy: 0.79, coconut: 0.78, rubber: 0.72, cardamom: 0.77 },
  { date: 'Aug', paddy: 0.75, coconut: 0.80, rubber: 0.75, cardamom: 0.79 },
  { date: 'Sep', paddy: 0.68, coconut: 0.82, rubber: 0.78, cardamom: 0.81 },
  { date: 'Oct', paddy: 0.55, coconut: 0.79, rubber: 0.76, cardamom: 0.83 },
  { date: 'Nov', paddy: 0.48, coconut: 0.77, rubber: 0.74, cardamom: 0.80 },
  { date: 'Dec', paddy: 0.42, coconut: 0.75, rubber: 0.71, cardamom: 0.78 },
];

const crops = [
  { id: 'paddy', name: 'Paddy (Alappuzha)', color: '#22c55e', health: 0.82, trend: '+5%' },
  { id: 'coconut', name: 'Coconut (Thrissur)', color: '#3b82f6', health: 0.91, trend: '+3%' },
  { id: 'rubber', name: 'Rubber (Kottayam)', color: '#8b5cf6', health: 0.75, trend: '-2%' },
  { id: 'cardamom', name: 'Cardamom (Idukki)', color: '#f59e0b', health: 0.88, trend: '+7%' },
];

const healthComparison = [
  { name: 'Paddy', current: 0.82, previous: 0.78 },
  { name: 'Coconut', current: 0.91, previous: 0.88 },
  { name: 'Rubber', current: 0.75, previous: 0.77 },
  { name: 'Cardamom', current: 0.88, previous: 0.82 },
];

const satelliteInfo = {
  source: 'Sentinel-2 L2A',
  resolution: '10m',
  lastUpdate: '2 days ago',
  nextPass: 'Tomorrow 10:30 AM',
};

function getHealthColor(health: number): string {
  if (health >= 0.8) return '#22c55e';
  if (health >= 0.6) return '#eab308';
  return '#ef4444';
}

function getHealthLabel(health: number): string {
  if (health >= 0.8) return 'Healthy';
  if (health >= 0.6) return 'Fair';
  return 'Poor';
}

export function CropHealthView() {
  const { fields, searchQuery, setActiveTab, setSelectedFieldId } = useApp();
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['paddy', 'coconut', 'rubber', 'cardamom']);

  // Filter fields based on search
  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCrop = (cropId: string) => {
    setSelectedCrops(prev => 
      prev.includes(cropId) 
        ? prev.filter(id => id !== cropId)
        : [...prev, cropId]
    );
  };

  const handleViewDetails = (fieldId: number) => {
    setSelectedFieldId(fieldId);
    setActiveTab('field-detail');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Crop Health Monitor</h1>
          <p className="text-muted-foreground">NDVI analysis from Sentinel-2 satellite imagery</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
          <Satellite className="w-4 h-4" />
          <span>Last update: {satelliteInfo.lastUpdate}</span>
        </div>
      </div>

      {/* Health Overview Cards - Using actual fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredFields.map((field) => {
          const colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
          const color = colors[field.id % colors.length];
          
          return (
            <div key={field.id} className="stat-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium text-sm truncate">{field.crop}</span>
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  field.health >= 0.8 ? 'text-growth' : field.health >= 0.6 ? 'text-wheat' : 'text-danger'
                )}>
                  {(field.health * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2 truncate">{field.name}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-semibold">{getHealthLabel(field.health)}</p>
                  <p className="text-xs text-muted-foreground">{field.location}</p>
                </div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${getHealthColor(field.health)}20` }}
                >
                  <Leaf className="w-5 h-5" style={{ color: getHealthColor(field.health) }} />
                </div>
              </div>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${field.health * 100}%`,
                    backgroundColor: getHealthColor(field.health)
                  }}
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2 text-xs"
                onClick={() => handleViewDetails(field.id)}
              >
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </div>
          );
        })}
      </div>

      {/* NDVI Legend Banner */}
      <div className="stat-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h3 className="font-semibold">NDVI Health Scale</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#22c55e]" />
              <span>Healthy (&gt;0.8)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#eab308]" />
              <span>Fair (0.6-0.8)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#ef4444]" />
              <span>Poor (&lt;0.6)</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Data source: {satelliteInfo.source} • Resolution: {satelliteInfo.resolution}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NDVI Time Series Chart */}
        <div className="lg:col-span-2 stat-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-forest" />
              <h3 className="font-semibold">NDVI Trends (12 Months)</h3>
            </div>
          </div>

          {/* Crop Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {crops.map((crop) => (
              <button
                key={crop.id}
                onClick={() => toggleCrop(crop.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  selectedCrops.includes(crop.id)
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: crop.color }}
                />
                {crop.name.split(' (')[0]}
              </button>
            ))}
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ndviTimeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {crops.map((crop) => (
                    <linearGradient key={crop.id} id={`gradient-health-${crop.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={crop.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={crop.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11 }} 
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                />
                <YAxis 
                  domain={[0.3, 1]} 
                  tick={{ fontSize: 11 }} 
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number, name: string) => [value.toFixed(2), crops.find(c => c.id === name)?.name || name]}
                />
                {crops.map((crop) => (
                  selectedCrops.includes(crop.id) && (
                    <Area
                      key={crop.id}
                      type="monotone"
                      dataKey={crop.id}
                      stroke={crop.color}
                      strokeWidth={2}
                      fill={`url(#gradient-health-${crop.id})`}
                    />
                  )
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Comparison */}
        <div className="stat-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-sky" />
            <h3 className="font-semibold">Month-over-Month</h3>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthComparison} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={70} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [value.toFixed(2), 'NDVI']}
                />
                <Bar dataKey="previous" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} name="Previous" />
                <Bar dataKey="current" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Current" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-muted" />
              <span>Previous Month</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary" />
              <span>Current Month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="stat-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="font-semibold">Health Alerts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="font-medium text-sm">Rubber Plantation Stress</span>
            </div>
            <p className="text-xs text-muted-foreground">
              NDVI dropped 2% in the Kottayam rubber plantation. Possible water stress detected. 
              Consider inspecting irrigation systems.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-growth/10 border border-growth/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-growth" />
              <span className="font-medium text-sm">Cardamom Thriving</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Cardamom fields in Idukki showing excellent growth (+7% NDVI). 
              Current conditions optimal for continued development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
