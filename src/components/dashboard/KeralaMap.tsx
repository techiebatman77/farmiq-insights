import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, Layers, Satellite, TreeDeciduous, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

// Kerala bounds and center
const KERALA_CENTER: [number, number] = [10.8505, 76.2711];
const KERALA_BOUNDS: [[number, number], [number, number]] = [
  [8.2, 74.8], // Southwest
  [12.8, 77.5], // Northeast
];

type LayerType = 'street' | 'satellite' | 'terrain';

const tileLayers = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri, Maxar, Earthstar Geographics',
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
  },
};

function getHealthColor(health: number): string {
  if (health >= 0.8) return '#22c55e';
  if (health >= 0.6) return '#eab308';
  return '#ef4444';
}

export function KeralaMap() {
  const { fields, setActiveTab, setSelectedFieldId, searchQuery } = useApp();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonsRef = useRef<L.Polygon[]>([]);
  const [activeLayer, setActiveLayer] = useState<LayerType>('satellite');
  const [selectedField, setSelectedField] = useState<typeof fields[0] | null>(null);

  // Filter fields based on search
  const filteredFields = fields.filter(field => 
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainer.current, {
      center: KERALA_CENTER,
      zoom: 8,
      maxBounds: L.latLngBounds(KERALA_BOUNDS[0], KERALA_BOUNDS[1]),
      minZoom: 7,
    });

    mapRef.current = map;

    // Add initial tile layer
    const layer = tileLayers[activeLayer];
    tileLayerRef.current = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: 18,
    }).addTo(map);

    // Kerala state boundary (simplified)
    L.polygon([
      [8.4, 76.5], [8.8, 77.2], [9.5, 77.3], [10.2, 77.0],
      [10.8, 76.3], [11.5, 75.9], [12.2, 75.2], [12.0, 74.9],
      [11.0, 75.5], [10.0, 76.0], [9.0, 76.5], [8.4, 76.5]
    ], {
      color: '#1a5d1a',
      fillColor: 'transparent',
      weight: 3,
      dashArray: '10, 5',
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update polygons when fields change
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old polygons
    polygonsRef.current.forEach(p => p.remove());
    polygonsRef.current = [];

    // Add field polygons
    filteredFields.forEach((field) => {
      const polygon = L.polygon(field.coords, {
        color: getHealthColor(field.health),
        fillColor: getHealthColor(field.health),
        fillOpacity: 0.4,
        weight: 2,
      }).addTo(mapRef.current!);

      polygon.bindPopup(`
        <div style="min-width: 150px;">
          <h3 style="font-weight: 600; margin-bottom: 4px;">${field.name}</h3>
          <p style="color: #666; margin: 2px 0;">Crop: ${field.crop}</p>
          <p style="color: #666; margin: 2px 0;">NDVI: ${field.health.toFixed(2)}</p>
          <div style="width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; margin-top: 8px;">
            <div style="width: ${field.health * 100}%; height: 100%; background: ${getHealthColor(field.health)}; border-radius: 3px;"></div>
          </div>
        </div>
      `);

      polygon.on('click', () => setSelectedField(field));
      polygonsRef.current.push(polygon);
    });
  }, [filteredFields]);

  // Handle layer changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    mapRef.current.removeLayer(tileLayerRef.current);
    const layer = tileLayers[activeLayer];
    tileLayerRef.current = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: 18,
    }).addTo(mapRef.current);
  }, [activeLayer]);

  const handleViewDetails = () => {
    if (selectedField) {
      setSelectedFieldId(selectedField.id);
      setActiveTab('field-detail');
    }
  };

  const layerButtons = [
    { type: 'street' as LayerType, icon: Map, label: 'Street' },
    { type: 'satellite' as LayerType, icon: Satellite, label: 'Satellite' },
    { type: 'terrain' as LayerType, icon: TreeDeciduous, label: 'Terrain' },
  ];

  return (
    <div className="stat-card p-0 overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-forest" />
          <h3 className="font-semibold">Kerala Farm Map</h3>
          <span className="text-xs text-muted-foreground">({filteredFields.length} fields)</span>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {layerButtons.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setActiveLayer(type)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                activeLayer === type
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[400px]">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
          <p className="text-xs font-medium mb-2">Crop Health (NDVI)</p>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-growth" />
              <span>Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-wheat" />
              <span>Fair</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-danger" />
              <span>Poor</span>
            </div>
          </div>
        </div>

        {/* Field Info Card */}
        {selectedField && (
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-[1000] min-w-[220px]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">{selectedField.name}</h4>
              <button 
                onClick={() => setSelectedField(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Crop: <span className="text-foreground">{selectedField.crop}</span></p>
              <p>Health Score: <span className="text-foreground">{(selectedField.health * 100).toFixed(0)}%</span></p>
              {selectedField.area && <p>Area: <span className="text-foreground">{selectedField.area}</span></p>}
            </div>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${selectedField.health * 100}%`,
                  backgroundColor: getHealthColor(selectedField.health)
                }}
              />
            </div>
            <Button 
              size="sm" 
              className="w-full mt-3 bg-forest hover:bg-forest/90"
              onClick={handleViewDetails}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
