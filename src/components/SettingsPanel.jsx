import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Sliders, Bell, Volume2, Monitor, Globe, Save, RotateCcw, Shield, Clock, Database, Cpu, Wifi, WifiOff } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function SettingsPanel() {
  const { settings, updateSettings } = useStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    const defaults = {
      simulationSpeed: 1,
      alertSound: true,
      theme: 'dark',
      mapStyle: 'default',
    };
    setLocalSettings(defaults);
    updateSettings(defaults);
  };

  return (
    <div className="bg-tactical-card border border-tactical-border rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-tactical-border">
        <h2 className="text-tactical-primary font-semibold flex items-center gap-2 text-sm">
          <Settings className="w-4 h-4" />
          SETTINGS
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="bg-tactical-dark border border-tactical-border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-tactical-secondary" />
            <span className="text-xs text-tactical-muted font-semibold">SIMULATION</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-tactical-muted">Simulation Speed</span>
                <span className="text-tactical-primary font-semibold">{localSettings.simulationSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={localSettings.simulationSpeed}
                onChange={(e) => handleChange('simulationSpeed', parseFloat(e.target.value))}
                className="w-full h-2 bg-tactical-border rounded-lg appearance-none cursor-pointer accent-tactical-primary"
              />
              <div className="flex justify-between text-[9px] text-tactical-muted mt-1">
                <span>0.5x</span>
                <span>1x</span>
                <span>2x</span>
                <span>3x</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-tactical-dark border border-tactical-border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-tactical-warning" />
            <span className="text-xs text-tactical-muted font-semibold">NOTIFICATIONS</span>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 bg-tactical-card rounded cursor-pointer border border-tactical-border hover:border-tactical-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-tactical-muted" />
                <span className="text-xs text-gray-300">Alert Sound</span>
              </div>
              <input
                type="checkbox"
                checked={localSettings.alertSound}
                onChange={(e) => handleChange('alertSound', e.target.checked)}
                className="w-4 h-4 accent-tactical-primary"
              />
            </label>
          </div>
        </div>

        <div className="bg-tactical-dark border border-tactical-border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="w-4 h-4 text-tactical-secondary" />
            <span className="text-xs text-tactical-muted font-semibold">DISPLAY</span>
          </div>
          
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-tactical-muted block mb-1">Theme</label>
              <select
                value={localSettings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full bg-tactical-card border border-tactical-border rounded px-3 py-2 text-xs text-white"
              >
                <option value="dark">Dark Tactical</option>
                <option value="night">Night Vision</option>
              </select>
            </div>
            
            <div>
              <label className="text-[10px] text-tactical-muted block mb-1">Map Style</label>
              <select
                value={localSettings.mapStyle}
                onChange={(e) => handleChange('mapStyle', e.target.value)}
                className="w-full bg-tactical-card border border-tactical-border rounded px-3 py-2 text-xs text-white"
              >
                <option value="default">Default Dark</option>
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSave}
            className={`flex items-center justify-center gap-2 py-2.5 rounded transition-all ${
              isSaved 
                ? 'bg-tactical-primary text-tactical-dark' 
                : 'bg-tactical-primary/20 text-tactical-primary hover:bg-tactical-primary/30'
            }`}
          >
            <Save className="w-4 h-4" />
            <span className="text-xs font-semibold">{isSaved ? 'SAVED!' : 'Save'}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 bg-tactical-dark border border-tactical-border text-tactical-muted py-2.5 rounded hover:bg-tactical-border hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-xs">Reset</span>
          </button>
        </div>

        <div className="bg-tactical-dark border border-tactical-border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-tactical-primary" />
            <span className="text-xs text-tactical-muted font-semibold">SYSTEM INFO</span>
          </div>
          
          <div className="space-y-2 text-[10px]">
            <div className="flex items-center justify-between p-2 bg-tactical-card rounded">
              <span className="text-tactical-muted flex items-center gap-2">
                <Database className="w-3 h-3" />
                Version
              </span>
              <span className="text-white font-semibold">1.0.0</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-tactical-card rounded">
              <span className="text-tactical-muted flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Build Date
              </span>
              <span className="text-white font-semibold">2024.01.15</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-tactical-card rounded">
              <span className="text-tactical-muted flex items-center gap-2">
                <Cpu className="w-3 h-3" />
                Status
              </span>
              <span className="text-tactical-primary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-tactical-primary rounded-full animate-pulse"></span>
                OPERATIONAL
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-tactical-card rounded">
              <span className="text-tactical-muted flex items-center gap-2">
                <Wifi className="w-3 h-3" />
                Connection
              </span>
              <span className="text-tactical-primary font-semibold flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                CONNECTED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
