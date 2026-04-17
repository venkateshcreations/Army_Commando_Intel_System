import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { Crosshair, ZoomIn, ZoomOut, Target, Layers, MapPin, AlertTriangle, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import { eventBus, EVENTS } from '../systems/EventBus';

const createUnitIcon = (status, role) => {
  const colors = {
    active: '#00ff88',
    idle: '#ffaa00',
    injured: '#ff3344',
    compromised: '#ff6600'
  };
  const color = colors[status] || colors.active;
  
  return L.divIcon({
    className: 'unit-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 12px ${color}, 0 0 4px ${color};
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createThreatIcon = (severity) => {
  const colors = {
    critical: '#ff3344',
    high: '#ff6600',
    medium: '#ffaa00',
    low: '#ffff00'
  };
  const color = colors[severity] || colors.low;
  
  return L.divIcon({
    className: 'threat-marker',
    html: `<div style="
      width: 16px;
      height: 16px;
      background: ${color};
      border-radius: 3px;
      box-shadow: 0 0 8px ${color};
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

function MapEvents() {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e) => {
      eventBus.emit(EVENTS.MAP_CLICK, e.latlng);
    };
    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map]);
  
  return null;
}

function MapController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

export default function TacticalMap() {
  const { units, threats, selectedUnit, selectedThreat, setSelectedUnit, setSelectedThreat } = useStore();
  const [mapReady, setMapReady] = useState(false);
  const [showUnits, setShowUnits] = useState(true);
  const [showThreats, setShowThreats] = useState(true);

  const center = useMemo(() => [40.715, -74.005], []);

  const severityColors = {
    critical: '#ff3344',
    high: '#ff6600',
    medium: '#ffaa00',
    low: '#ffff00'
  };

  const mapStats = useMemo(() => {
    return {
      units: units.length,
      threats: threats.filter(t => t.status === 'active').length,
      critical: threats.filter(t => t.severity === 'critical' && t.status === 'active').length,
    };
  }, [units, threats]);

  return (
    <div className="bg-tactical-card border border-tactical-border rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-tactical-border flex items-center justify-between">
        <h2 className="text-tactical-primary font-semibold flex items-center gap-2">
          <Crosshair className="w-4 h-4" />
          TACTICAL MAP
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUnits(!showUnits)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              showUnits ? 'bg-tactical-primary/20 text-tactical-primary' : 'bg-tactical-dark text-tactical-muted'
            }`}
          >
            <Users className="w-3 h-3" />
            {mapStats.units}
          </button>
          <button
            onClick={() => setShowThreats(!showThreats)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              showThreats ? 'bg-tactical-danger/20 text-tactical-danger' : 'bg-tactical-dark text-tactical-muted'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            {mapStats.threats}
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={14}
          className="h-full w-full"
          style={{ background: '#0a0f0d' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy;'
          />
          <MapEvents />
          
          {showUnits && units.map((unit) => (
            <Marker
              key={unit.id}
              position={[unit.lat, unit.lng]}
              icon={createUnitIcon(unit.status, unit.role)}
              eventHandlers={{
                click: () => setSelectedUnit(unit.id)
              }}
            >
              <Popup>
                <div className="bg-tactical-dark text-white p-2 rounded min-w-[120px]">
                  <p className="font-bold text-sm">{unit.name}</p>
                  <p className="text-xs text-gray-400">Role: {unit.role}</p>
                  <p className="text-xs text-gray-400">Status: {unit.status}</p>
                  <p className="text-xs text-gray-400">Health: {unit.health}%</p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {showThreats && threats.filter(t => t.status === 'active').map((threat) => (
            <Circle
              key={threat.id}
              center={[threat.lat, threat.lng]}
              radius={threat.radius}
              pathOptions={{
                color: severityColors[threat.severity],
                fillColor: severityColors[threat.severity],
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '5, 5'
              }}
              eventHandlers={{
                click: () => setSelectedThreat(threat.id)
              }}
            />
          ))}
        </MapContainer>
        
        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
          <button className="p-2 bg-tactical-card border border-tactical-border rounded hover:bg-tactical-border shadow-lg">
            <ZoomIn className="w-4 h-4 text-tactical-primary" />
          </button>
          <button className="p-2 bg-tactical-card border border-tactical-border rounded hover:bg-tactical-border shadow-lg">
            <ZoomOut className="w-4 h-4 text-tactical-primary" />
          </button>
          <button className="p-2 bg-tactical-card border border-tactical-border rounded hover:bg-tactical-border shadow-lg">
            <Target className="w-4 h-4 text-tactical-primary" />
          </button>
          <button className="p-2 bg-tactical-card border border-tactical-border rounded hover:bg-tactical-border shadow-lg">
            <Layers className="w-4 h-4 text-tactical-primary" />
          </button>
        </div>

        <div className="absolute top-4 left-4 z-[1000] bg-tactical-card/90 border border-tactical-border rounded p-2 text-[10px] shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-tactical-muted" />
            <span className="text-tactical-muted">COORDINATES</span>
          </div>
          <p className="text-white font-mono">
            {center[0].toFixed(4)}°N, {Math.abs(center[1]).toFixed(4)}°W
          </p>
          <div className="mt-1 pt-1 border-t border-tactical-border">
            <p className="text-tactical-muted">Sector: ALPHA-7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
