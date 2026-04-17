import React from 'react';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, ZoomIn, ZoomOut, Target, Layers, MapPin, AlertTriangle, Users, Satellite } from 'lucide-react';
import { useStore } from '../store/useStore';

const createUnitIcon = (status) => {
  const colors = { active: '#00ff88', idle: '#ffaa00', injured: '#ff3344', compromised: '#ff6600' };
  const color = colors[status] || colors.active;
  return L.divIcon({
    className: 'unit-marker',
    html: `<div style="width: 24px; height: 24px; background: ${color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 12px ${color}; display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function TacticalMapPage() {
  const { units, threats } = useStore();
  const [showUnits, setShowUnits] = useState(true);
  const [showThreats, setShowThreats] = useState(true);
  const [satelliteMode, setSatelliteMode] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('street');
  const center = [40.715, -74.005];
  const severityColors = { critical: '#ff3344', high: '#ff6600', medium: '#ffaa00', low: '#ffff00' };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#1a2924] flex items-center justify-between" style={{ backgroundColor: '#0a0f0d' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowUnits(!showUnits)} className="px-3 py-1.5 rounded text-xs flex items-center gap-2" style={{ backgroundColor: showUnits ? '#00ff88/20' : '#0a0f0d', color: showUnits ? '#00ff88' : '#4a6660', border: '1px solid #1a2924' }}>
            <Users className="w-3 h-3" /> {units.length}
          </button>
          <button onClick={() => setShowThreats(!showThreats)} className="px-3 py-1.5 rounded text-xs flex items-center gap-2" style={{ backgroundColor: showThreats ? '#ff3344/20' : '#0a0f0d', color: showThreats ? '#ff3344' : '#4a6660', border: '1px solid #1a2924' }}>
            <AlertTriangle className="w-3 h-3" /> {threats.filter(t => t.status === 'active').length}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSatelliteMode(!satelliteMode)} 
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-2 transition-all ${satelliteMode ? 'bg-blue-500/20 text-blue-500 border border-blue-500' : 'bg-[#0a0f0d] text-[#4a6660] border border-[#1a2924]'}`}
          >
            <Satellite className="w-3 h-3" /> SATELLITE
          </button>
          {satelliteMode && (
            <div className="flex items-center gap-1">
              {['street', 'satellite', 'aerial'].map(layer => (
                <button
                  key={layer}
                  onClick={() => setSelectedLayer(layer)}
                  className={`px-2 py-1.5 rounded text-xs font-mono ${selectedLayer === layer ? 'bg-blue-500/20 text-blue-500' : 'text-[#4a6660] hover:text-white'}`}
                >
                  {layer.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 relative">
        <MapContainer center={center} zoom={14} className="h-full w-full" style={{ background: '#0a0f0d' }} zoomControl={false}>
          <TileLayer 
            url={satelliteMode 
              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            } 
            attribution="" />
          
          {showUnits && units.map(unit => (
            <Marker key={unit.id} position={[unit.lat, unit.lng]} icon={createUnitIcon(unit.status)}>
              <div style={{ background: '#111916', color: '#fff', padding: '10px', borderRadius: '4px' }}>
                <p className="font-bold">{unit.name}</p>
                <p className="text-xs">Role: {unit.role} | Status: {unit.status} | Health: {unit.health}%</p>
              </div>
            </Marker>
          ))}
          
          {showThreats && threats.filter(t => t.status === 'active').map(threat => (
            <Circle key={threat.id} center={[threat.lat, threat.lng]} radius={threat.radius} pathOptions={{ color: severityColors[threat.severity], fillColor: severityColors[threat.severity], fillOpacity: 0.2, weight: 2, dashArray: '5, 5' }} />
          ))}
        </MapContainer>
        
        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
          <button className="p-2 bg-[#111916] border border-[#1a2924] rounded hover:border-[#00ff88]"><ZoomIn className="w-4 h-4 text-[#00ff88]" /></button>
          <button className="p-2 bg-[#111916] border border-[#1a2924] rounded hover:border-[#00ff88]"><ZoomOut className="w-4 h-4 text-[#00ff88]" /></button>
          <button className="p-2 bg-[#111916] border border-[#1a2924] rounded hover:border-[#00ff88]"><Target className="w-4 h-4 text-[#00ff88]" /></button>
        </div>

        <div className="absolute top-4 left-4 z-[1000] bg-[#111916]/90 border border-[#1a2924] rounded p-3 text-xs">
          <div className="flex items-center gap-2 mb-2"><MapPin className="w-3 h-3 text-[#4a6660]" /> <span className="text-[#4a6660]">COORDINATES</span></div>
          <p className="text-white font-mono">40.7150°N, 74.0050°W</p>
          <p className="text-[#4a6660] mt-1">Sector: ALPHA-7</p>
        </div>
      </div>
    </div>
  );
}
