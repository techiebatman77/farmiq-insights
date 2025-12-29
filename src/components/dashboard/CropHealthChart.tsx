import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ndviData = [
  { date: 'Week 1', ndvi: 0.45, health: 'Moderate' },
  { date: 'Week 2', ndvi: 0.52, health: 'Good' },
  { date: 'Week 3', ndvi: 0.58, health: 'Good' },
  { date: 'Week 4', ndvi: 0.65, health: 'Very Good' },
  { date: 'Week 5', ndvi: 0.72, health: 'Excellent' },
  { date: 'Week 6', ndvi: 0.78, health: 'Excellent' },
  { date: 'Week 7', ndvi: 0.75, health: 'Excellent' },
  { date: 'Week 8', ndvi: 0.71, health: 'Very Good' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-medium">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-lg font-semibold text-growth">
          NDVI: {payload[0].value.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground">{payload[0].payload.health}</p>
      </div>
    );
  }
  return null;
};

export function CropHealthChart() {
  return (
    <div className="stat-card opacity-0 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Crop Health (NDVI)</h3>
          <p className="text-sm text-muted-foreground">Vegetation index over time</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-growth" />
          <span className="text-sm text-muted-foreground">Field A - Wheat</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ndviData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(120, 45%, 45%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(120, 45%, 45%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              domain={[0.3, 1]} 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="ndvi"
              stroke="hsl(120, 45%, 45%)"
              strokeWidth={3}
              fill="url(#ndviGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <div className="flex gap-4">
          {[
            { label: 'Current', value: '0.75', color: 'text-growth' },
            { label: 'Avg', value: '0.65', color: 'text-muted-foreground' },
            { label: 'Peak', value: '0.78', color: 'text-wheat' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-growth/10 text-growth font-medium">
          Healthy Growth
        </span>
      </div>
    </div>
  );
}
