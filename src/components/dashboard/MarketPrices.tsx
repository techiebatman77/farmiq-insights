import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const crops = [
  { name: 'Wheat', price: 245.50, change: 3.2, unit: '$/ton', trend: 'up' },
  { name: 'Corn', price: 198.75, change: -1.8, unit: '$/ton', trend: 'down' },
  { name: 'Soybeans', price: 425.30, change: 5.1, unit: '$/ton', trend: 'up' },
  { name: 'Rice', price: 315.00, change: 0.5, unit: '$/ton', trend: 'up' },
  { name: 'Cotton', price: 0.82, change: -2.3, unit: '$/lb', trend: 'down' },
];

export function MarketPrices() {
  return (
    <div className="stat-card opacity-0 animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Market Prices</h3>
          <p className="text-sm text-muted-foreground">Live commodity prices</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {crops.map((crop) => (
          <div 
            key={crop.name}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                crop.trend === 'up' ? 'bg-growth/10' : 'bg-danger/10'
              )}>
                {crop.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-growth" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-danger" />
                )}
              </div>
              <div>
                <p className="font-medium">{crop.name}</p>
                <p className="text-xs text-muted-foreground">{crop.unit}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${crop.price.toFixed(2)}</p>
              <p className={cn(
                "text-sm",
                crop.trend === 'up' ? 'text-growth' : 'text-danger'
              )}>
                {crop.trend === 'up' ? '+' : ''}{crop.change}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
