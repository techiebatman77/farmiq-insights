import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, Layers, Satellite, TreeDeciduous } from 'lucide-react';
import { cn } from '@/lib/utils';

// Kerala bounds and center
const KERALA_CENTER: [number, number] = [10.8505, 76.2711];
const KERALA_BOUNDS: [[number, number], [number, number]] = [
  [8.2, 74.8], // Southwest
  [12.8, 77.5], // Northeast
];

// Sample field data for Kerala
const fields = [
  { 
    id: 1, 
    name: 'Paddy Field - Alappuzha', 
    crop: 'Rice', 
    health: 0.82,
    coords: [[9.4981, 76.3388], [9.5081, 76.3388], [9.5081, 76.3488], [9.4981, 76.3488]] as [number, number][]
  },
  { 
    id: 2, 
    name: 'Coconut Grove - Thrissur', 
    crop: 'Coconut', 
    health: 0.91,
    coords: [[10.5276, 76.2144], [10.5376, 76.2144], [10.5376, 76.2244], [10.5276, 76.2244]] as [number, number][]
  },
  { 
    id: 3, 
    name: 'Rubber Plantation - Kottayam', 
    crop: 'Rubber', 
    health: 0.75,
    coords: [[9.5916, 76.5222], [9.6016, 76.5222], [9.6016, 76.5322], [9.5916, 76.5322]] as [number, number][]
  },
  { 
    id: 4, 
    name: 'Spice Garden - Idukki', 
    crop: 'Cardamom', 
    health: 0.88,
    coords: [[9.9189, 77.1025], [9.9289, 77.1025], [9.9289, 77.1125], [9.9189, 77.1125]] as [number, number][]
  },
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
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerType>('satellite');
  const [selectedField, setSelectedField] = useState<typeof fields[0] | null>(null);

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

    // Add field polygons
    fields.forEach((field) => {
      const polygon = L.polygon(field.coords, {
        color: getHealthColor(field.health),
        fillColor: getHealthColor(field.health),
        fillOpacity: 0.4,
        weight: 2,
      }).addTo(map);

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
    });

    // Kerala state boundary (simplified)
    const keralaBoundary = L.polygon([
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
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-[1000] min-w-[200px]">
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
          </div>
        )}
      </div>
    </div>
  );
}
