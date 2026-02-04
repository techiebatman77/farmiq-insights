import { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowRight, IndianRupee, BarChart3, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Kerala crop prices in INR per quintal
const keralaCrops = [
  { 
    id: 'paddy', 
    name: 'Paddy (Rice)', 
    price: 2280, 
    change: 2.5, 
    unit: '₹/quintal', 
    trend: 'up',
    mandi: 'Alappuzha',
    msp: 2183,
    quality: 'Grade A'
  },
  { 
    id: 'coconut', 
    name: 'Coconut', 
    price: 2850, 
    change: -1.2, 
    unit: '₹/100 nuts', 
    trend: 'down',
    mandi: 'Thrissur',
    msp: null,
    quality: 'Medium'
  },
  { 
    id: 'rubber', 
    name: 'Rubber (RSS4)', 
    price: 16500, 
    change: 4.8, 
    unit: '₹/quintal', 
    trend: 'up',
    mandi: 'Kottayam',
    msp: null,
    quality: 'RSS4'
  },
  { 
    id: 'pepper', 
    name: 'Black Pepper', 
    price: 54000, 
    change: 3.2, 
    unit: '₹/quintal', 
    trend: 'up',
    mandi: 'Idukki',
    msp: null,
    quality: 'Ungarbled'
  },
  { 
    id: 'cardamom', 
    name: 'Cardamom', 
    price: 125000, 
    change: -2.1, 
    unit: '₹/quintal', 
    trend: 'down',
    mandi: 'Idukki',
    msp: null,
    quality: 'Bold'
  },
  { 
    id: 'banana', 
    name: 'Banana (Nendran)', 
    price: 4200, 
    change: 1.8, 
    unit: '₹/quintal', 
    trend: 'up',
    mandi: 'Wayanad',
    msp: null,
    quality: 'A Grade'
  },
];

// 7-day price trend data
const priceTrendData = [
  { day: 'Mon', paddy: 2220, coconut: 2900, rubber: 15800 },
  { day: 'Tue', paddy: 2235, coconut: 2880, rubber: 15950 },
  { day: 'Wed', paddy: 2250, coconut: 2850, rubber: 16100 },
  { day: 'Thu', paddy: 2240, coconut: 2870, rubber: 16200 },
  { day: 'Fri', paddy: 2260, coconut: 2860, rubber: 16350 },
  { day: 'Sat', paddy: 2275, coconut: 2855, rubber: 16450 },
  { day: 'Sun', paddy: 2280, coconut: 2850, rubber: 16500 },
];

const marketRecommendations = [
  {
    crop: 'Rubber',
    action: 'SELL',
    reason: 'Prices at 6-month high. Global demand strong. Good time to sell existing stock.',
    confidence: 85,
  },
  {
    crop: 'Paddy',
    action: 'HOLD',
    reason: 'Prices above MSP but expected to rise further during festival season.',
    confidence: 72,
  },
  {
    crop: 'Cardamom',
    action: 'WAIT',
    reason: 'Prices declining due to increased production. Wait for market stabilization.',
    confidence: 68,
  },
];

export function MarketView() {
  const { searchQuery } = useApp();
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  // Filter crops based on search
  const filteredCrops = keralaCrops.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.mandi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Market Intelligence</h1>
          <p className="text-muted-foreground">Kerala commodity prices and trading recommendations</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
          <Calendar className="w-4 h-4" />
          <span>Last updated: Today, 10:30 AM</span>
        </div>
      </div>

      {/* Price Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredCrops.slice(0, 3).map((crop) => (
          <div key={crop.id} className="stat-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{crop.name}</span>
              <span className={cn(
                "flex items-center gap-1 text-sm font-medium",
                crop.trend === 'up' ? 'text-growth' : 'text-danger'
              )}>
                {crop.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {crop.trend === 'up' ? '+' : ''}{crop.change}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">₹{crop.price.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">{crop.unit.replace('₹/', '/')}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Mandi: {crop.mandi}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Trend Chart */}
        <div className="lg:col-span-2 stat-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-forest" />
              <h3 className="font-semibold">7-Day Price Trend</h3>
            </div>
            <div className="flex gap-2">
              {['paddy', 'coconut', 'rubber'].map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(selectedCrop === crop ? null : crop)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all capitalize",
                    selectedCrop === crop || selectedCrop === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }} 
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11 }} 
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number, name: string) => [`₹${value.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Legend />
                {(selectedCrop === null || selectedCrop === 'paddy') && (
                  <Line 
                    type="monotone" 
                    dataKey="paddy" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', strokeWidth: 2 }}
                    name="Paddy"
                  />
                )}
                {(selectedCrop === null || selectedCrop === 'coconut') && (
                  <Line 
                    type="monotone" 
                    dataKey="coconut" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    name="Coconut"
                  />
                )}
                {(selectedCrop === null || selectedCrop === 'rubber') && (
                  <Line 
                    type="monotone" 
                    dataKey="rubber" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                    name="Rubber"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Recommendations */}
        <div className="stat-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-growth" />
            <h3 className="font-semibold">Trading Recommendations</h3>
          </div>
          <div className="space-y-4">
            {marketRecommendations.map((rec, i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{rec.crop}</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-semibold",
                    rec.action === 'SELL' ? 'bg-growth/10 text-growth' :
                    rec.action === 'HOLD' ? 'bg-wheat/10 text-wheat' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {rec.action}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{rec.reason}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${rec.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{rec.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Price Table */}
      <div className="stat-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Kerala Commodity Prices</h3>
          <Button variant="outline" size="sm">
            Export Data <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Change (7d)</TableHead>
                <TableHead>Mandi</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>MSP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCrops.map((crop) => (
                <TableRow key={crop.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{crop.name}</TableCell>
                  <TableCell className="font-semibold">₹{crop.price.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{crop.unit.replace('₹/', 'per ')}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "flex items-center gap-1",
                      crop.trend === 'up' ? 'text-growth' : 'text-danger'
                    )}>
                      {crop.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {crop.trend === 'up' ? '+' : ''}{crop.change}%
                    </span>
                  </TableCell>
                  <TableCell>{crop.mandi}</TableCell>
                  <TableCell>{crop.quality}</TableCell>
                  <TableCell>
                    {crop.msp ? `₹${crop.msp.toLocaleString()}` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
