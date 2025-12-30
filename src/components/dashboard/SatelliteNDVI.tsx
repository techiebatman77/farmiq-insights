import { useState } from 'react';
import { Satellite, Calendar, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Simulated NDVI data for Kerala fields (would come from Sentinel-2 API)
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
  { id: 'paddy', name: 'Paddy (Alappuzha)', color: '#22c55e' },
  { id: 'coconut', name: 'Coconut (Thrissur)', color: '#3b82f6' },
  { id: 'rubber', name: 'Rubber (Kottayam)', color: '#8b5cf6' },
  { id: 'cardamom', name: 'Cardamom (Idukki)', color: '#f59e0b' },
];

const satelliteInfo = {
  source: 'Sentinel-2 L2A',
  resolution: '10m',
  lastUpdate: '2 days ago',
  nextPass: 'Tomorrow 10:30 AM',
};

export function SatelliteNDVI() {
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['paddy', 'coconut']);

  const toggleCrop = (cropId: string) => {
    setSelectedCrops(prev => 
      prev.includes(cropId) 
        ? prev.filter(id => id !== cropId)
        : [...prev, cropId]
    );
  };

  return (
    <div className="stat-card p-6 opacity-0 animate-slide-up" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-forest/10">
            <Satellite className="w-5 h-5 text-forest" />
          </div>
          <div>
            <h3 className="font-semibold">Satellite NDVI Analysis</h3>
            <p className="text-xs text-muted-foreground">Vegetation health from {satelliteInfo.source}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>Updated {satelliteInfo.lastUpdate}</span>
        </div>
      </div>

      {/* Satellite Info Banner */}
      <div className="bg-muted/50 rounded-lg p-3 mb-4 flex items-center gap-3">
        <Info className="w-4 h-4 text-sky shrink-0" />
        <div className="text-xs">
          <span className="font-medium">Sentinel-2 Satellite</span>
          <span className="text-muted-foreground"> • {satelliteInfo.resolution} resolution • Next pass: {satelliteInfo.nextPass}</span>
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
            {crop.name}
          </button>
        ))}
      </div>

      {/* NDVI Chart */}
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ndviTimeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {crops.map((crop) => (
                <linearGradient key={crop.id} id={`gradient-${crop.id}`} x1="0" y1="0" x2="0" y2="1">
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
                  fill={`url(#gradient-${crop.id})`}
                />
              )
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* NDVI Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-danger/80" />
              <span className="text-muted-foreground">Poor (&lt;0.4)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-wheat/80" />
              <span className="text-muted-foreground">Fair (0.4-0.6)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-growth/80" />
              <span className="text-muted-foreground">Good (&gt;0.6)</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-growth">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+5% avg growth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
