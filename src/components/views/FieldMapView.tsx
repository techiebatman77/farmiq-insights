import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, Layers, Satellite, TreeDeciduous, Plus, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { AddFieldModal } from '@/components/modals/AddFieldModal';

const KERALA_CENTER: [number, number] = [10.8505, 76.2711];
const KERALA_BOUNDS: [[number, number], [number, number]] = [
  [8.2, 74.8],
  [12.8, 77.5],
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

function getHealthLabel(health: number): string {
  if (health >= 0.8) return 'Healthy';
  if (health >= 0.6) return 'Fair';
  return 'Poor';
}

export function FieldMapView() {
  const { fields, searchQuery, setActiveTab, setSelectedFieldId } = useApp();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonsRef = useRef<L.Polygon[]>([]);
  const [activeLayer, setActiveLayer] = useState<LayerType>('satellite');
  const [selectedField, setSelectedField] = useState<typeof fields[0] | null>(null);
  const [showNDVIOverlay, setShowNDVIOverlay] = useState(true);
  const [addFieldOpen, setAddFieldOpen] = useState(false);

  // Filter fields based on search
  const filteredFields = fields.filter(field => 
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = L.map(mapContainer.current, {
      center: KERALA_CENTER,
      zoom: 8,
      maxBounds: L.latLngBounds(KERALA_BOUNDS[0], KERALA_BOUNDS[1]),
      minZoom: 7,
    });

    mapRef.current = map;

    const layer = tileLayers[activeLayer];
    tileLayerRef.current = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: 18,
    }).addTo(map);

    // Kerala state boundary
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

    // Add field polygons with NDVI coloring
    filteredFields.forEach((field) => {
      const polygon = L.polygon(field.coords, {
        color: showNDVIOverlay ? getHealthColor(field.health) : '#1b4332',
        fillColor: showNDVIOverlay ? getHealthColor(field.health) : '#1b4332',
        fillOpacity: showNDVIOverlay ? 0.5 : 0.3,
        weight: 2,
      }).addTo(mapRef.current!);

      polygon.bindPopup(`
        <div style="min-width: 180px;">
          <h3 style="font-weight: 600; margin-bottom: 8px;">${field.name}</h3>
          <p style="margin: 4px 0; font-size: 12px;">Crop: <strong>${field.crop}</strong></p>
          <p style="margin: 4px 0; font-size: 12px;">Area: <strong>${field.area || 'N/A'}</strong></p>
          <p style="margin: 4px 0; font-size: 12px;">NDVI: <strong>${field.health.toFixed(2)}</strong> (${getHealthLabel(field.health)})</p>
          <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; margin-top: 10px;">
            <div style="width: ${field.health * 100}%; height: 100%; background: ${getHealthColor(field.health)}; border-radius: 4px;"></div>
          </div>
        </div>
      `);

      polygon.on('click', () => setSelectedField(field));
      polygonsRef.current.push(polygon);
    });
  }, [filteredFields, showNDVIOverlay]);

  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    mapRef.current.removeLayer(tileLayerRef.current);
    const layer = tileLayers[activeLayer];
    tileLayerRef.current = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: 18,
    }).addTo(mapRef.current);
  }, [activeLayer]);

  const handleViewDetails = (field: typeof fields[0]) => {
    setSelectedFieldId(field.id);
    setActiveTab('field-detail');
  };

  const layerButtons = [
    { type: 'street' as LayerType, icon: Map, label: 'Street' },
    { type: 'satellite' as LayerType, icon: Satellite, label: 'Satellite' },
    { type: 'terrain' as LayerType, icon: TreeDeciduous, label: 'Terrain' },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Field Map</h1>
            <p className="text-muted-foreground">View and manage your farm boundaries in Kerala</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowNDVIOverlay(!showNDVIOverlay)}>
              <Layers className="w-4 h-4 mr-2" />
              {showNDVIOverlay ? 'Hide NDVI' : 'Show NDVI'}
            </Button>
            <Button size="sm" className="bg-forest hover:bg-forest/90" onClick={() => setAddFieldOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>
        </div>

        {/* Map Controls */}
        <div className="stat-card p-0 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-forest" />
              <h3 className="font-semibold">Kerala Farm Map</h3>
              <span className="text-xs text-muted-foreground ml-2">({filteredFields.length} fields)</span>
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

          <div className="relative h-[500px]">
            <div ref={mapContainer} className="absolute inset-0" />
            
            {/* NDVI Legend */}
            <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg z-[1000]">
              <p className="text-sm font-semibold mb-3">NDVI Health Legend</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#22c55e]" />
                  <span>Healthy (NDVI &gt; 0.8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#eab308]" />
                  <span>Fair (NDVI 0.6 - 0.8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#ef4444]" />
                  <span>Poor (NDVI &lt; 0.6)</span>
                </div>
              </div>
            </div>

            {/* Field Info Panel */}
            {selectedField && (
              <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg z-[1000] min-w-[250px]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{selectedField.name}</h4>
                  <button 
                    onClick={() => setSelectedField(null)}
                    className="text-muted-foreground hover:text-foreground text-lg"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Crop:</span>
                    <span className="font-medium">{selectedField.crop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area:</span>
                    <span className="font-medium">{selectedField.area || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Health:</span>
                    <span className="font-medium" style={{ color: getHealthColor(selectedField.health) }}>
                      {getHealthLabel(selectedField.health)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NDVI:</span>
                    <span className="font-medium">{selectedField.health.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${selectedField.health * 100}%`,
                      backgroundColor: getHealthColor(selectedField.health)
                    }}
                  />
                </div>
                <Button 
                  className="w-full mt-4 bg-forest hover:bg-forest/90" 
                  size="sm"
                  onClick={() => handleViewDetails(selectedField)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Field List */}
        <div className="stat-card">
          <h3 className="font-semibold mb-4">All Fields ({filteredFields.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredFields.map((field) => (
              <div 
                key={field.id}
                className="p-4 rounded-lg border border-border hover:border-forest/50 cursor-pointer transition-all"
                onClick={() => setSelectedField(field)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{field.name}</h4>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getHealthColor(field.health) }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-1">{field.crop} • {field.area || 'N/A'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${field.health * 100}%`,
                        backgroundColor: getHealthColor(field.health)
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium">{(field.health * 100).toFixed(0)}%</span>
                </div>
                <Button 
                  className="w-full mt-3" 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(field);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddFieldModal open={addFieldOpen} onOpenChange={setAddFieldOpen} />
    </>
  );
}
