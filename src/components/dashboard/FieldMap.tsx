import { MapPin, Layers, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fields = [
  { id: 'A', name: 'Field A', crop: 'Wheat', area: '45 ha', health: 'good', x: 25, y: 30 },
  { id: 'B', name: 'Field B', crop: 'Corn', area: '32 ha', health: 'warning', x: 55, y: 25 },
  { id: 'C', name: 'Field C', crop: 'Soybeans', area: '28 ha', health: 'good', x: 40, y: 55 },
  { id: 'D', name: 'Field D', crop: 'Rice', area: '20 ha', health: 'excellent', x: 70, y: 50 },
];

const healthColors = {
  excellent: 'bg-growth text-primary-foreground',
  good: 'bg-forest text-primary-foreground',
  warning: 'bg-warning text-foreground',
  poor: 'bg-danger text-primary-foreground',
};

export function FieldMap() {
  return (
    <div className="stat-card p-0 overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Farm Overview</h3>
          <p className="text-sm text-muted-foreground">4 fields • 125 hectares total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Layers className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map visualization */}
      <div className="relative h-80 bg-gradient-to-br from-forest/5 via-growth/10 to-forest/5 overflow-hidden">
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Field polygons */}
        {fields.map((field) => (
          <div
            key={field.id}
            className="absolute group cursor-pointer"
            style={{ left: `${field.x}%`, top: `${field.y}%` }}
          >
            {/* Field area representation */}
            <div className={`
              w-20 h-16 rounded-lg border-2 border-dashed transition-all duration-300
              ${field.health === 'excellent' ? 'border-growth bg-growth/20' : ''}
              ${field.health === 'good' ? 'border-forest bg-forest/20' : ''}
              ${field.health === 'warning' ? 'border-warning bg-warning/20' : ''}
              group-hover:scale-110 group-hover:shadow-lg
            `} />
            
            {/* Field label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className={`
                px-2 py-1 rounded-full text-xs font-medium shadow-soft
                ${healthColors[field.health as keyof typeof healthColors]}
              `}>
                {field.name}
              </div>
            </div>

            {/* Hover tooltip */}
            <div className="absolute left-24 top-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              <div className="bg-card border border-border rounded-lg p-3 shadow-medium whitespace-nowrap">
                <p className="font-medium">{field.name}</p>
                <p className="text-sm text-muted-foreground">{field.crop} • {field.area}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${
                    field.health === 'excellent' ? 'bg-growth' :
                    field.health === 'good' ? 'bg-forest' :
                    'bg-warning'
                  }`} />
                  <span className="text-xs capitalize">{field.health} health</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Map controls */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-2">
          <Button variant="glass" size="icon" className="h-8 w-8">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="icon" className="h-8 w-8">
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex gap-4 text-sm">
          {Object.entries({ excellent: 'Excellent', good: 'Good', warning: 'Needs Attention' }).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                key === 'excellent' ? 'bg-growth' :
                key === 'good' ? 'bg-forest' :
                'bg-warning'
              }`} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm">
          <MapPin className="w-4 h-4 mr-2" />
          Add Field
        </Button>
      </div>
    </div>
  );
}
