import { useState } from 'react';
import { Settings, Sliders, Bell, Volume2, Monitor, Globe, Save, RotateCcw, Shield, Clock, Database, Cpu, Wifi, Key, RefreshCw, Lock, Eye, EyeOff, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const [local, setLocal] = useState(settings);
  const [saved, setSaved] = useState(false);
  
  const [cryptoKeys, setCryptoKeys] = useState([
    { id: 1, name: 'PRIMARY KEY', key: 'a7f3c9d2e4b1f8a6c', status: 'active', rotation: '2024-01-20' },
    { id: 2, name: 'SECONDARY KEY', key: 'b8e4d1f7c3a9d5b', status: 'standby', rotation: '2024-01-25' },
    { id: 3, name: 'EMERGENCY KEY', key: 'c9f5e2a8d4b7e1c6', status: 'backup', rotation: '2024-01-30' },
  ]);
  const [showKeys, setShowKeys] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationInterval, setRotationInterval] = useState(24);

  const change = (k, v) => setLocal(p => ({ ...p, [k]: v }));

  const save = () => { updateSettings(local); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const reset = () => { const d = { simulationSpeed: 1, alertSound: true, theme: 'dark', mapStyle: 'default' }; setLocal(d); updateSettings(d); };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="bg-[#111916] border border-[#1a2924] rounded p-4 mb-4">
        <div className="flex items-center gap-2 mb-3"><Sliders className="w-4 h-4 text-[#00ccff]" /><span className="text-xs text-[#4a6660] font-semibold">SIMULATION</span></div>
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1"><span className="text-[#4a6660]">Speed</span><span className="text-[#00ff88]">{local.simulationSpeed}x</span></div>
          <input type="range" min="0.5" max="3" step="0.5" value={local.simulationSpeed} onChange={e => change('simulationSpeed', parseFloat(e.target.value))} className="w-full h-2 bg-[#1a2924] rounded-lg appearance-none cursor-pointer accent-[#00ff88]" />
          <div className="flex justify-between text-[9px] text-[#4a6660] mt-1"><span>0.5x</span><span>1x</span><span>2x</span><span>3x</span></div>
        </div>
      </div>

      <div className="bg-[#111916] border border-[#1a2924] rounded p-4 mb-4">
        <div className="flex items-center gap-2 mb-3"><Bell className="w-4 h-4 text-[#ffaa00]" /><span className="text-xs text-[#4a6660] font-semibold">NOTIFICATIONS</span></div>
        <label className="flex items-center justify-between p-2 bg-[#0a0f0d] rounded cursor-pointer border border-[#1a2924]">
          <span className="text-sm text-gray-300 flex items-center gap-2"><Volume2 className="w-4 h-4" /> Alert Sound</span>
          <input type="checkbox" checked={local.alertSound} onChange={e => change('alertSound', e.target.checked)} className="w-4 h-4 accent-[#00ff88]" />
        </label>
      </div>

      <div className="bg-[#111916] border border-[#1a2924] rounded p-4 mb-4">
        <div className="flex items-center gap-2 mb-3"><Monitor className="w-4 h-4 text-[#00ccff]" /><span className="text-xs text-[#4a6660] font-semibold">DISPLAY</span></div>
        <div className="space-y-3">
          <div><label className="text-[10px] text-[#4a6660] block mb-1">Theme</label><select value={local.theme} onChange={e => change('theme', e.target.value)} className="w-full bg-[#0a0f0d] border border-[#1a2924] rounded px-3 py-2 text-sm text-white">{['dark', 'night'].map(t => <option key={t} value={t}>{t === 'dark' ? 'Dark Tactical' : 'Night Vision'}</option>)}</select></div>
          <div><label className="text-[10px] text-[#4a6660] block mb-1">Map Style</label><select value={local.mapStyle} onChange={e => change('mapStyle', e.target.value)} className="w-full bg-[#0a0f0d] border border-[#1a2924] rounded px-3 py-2 text-sm text-white">{['default', 'satellite', 'terrain'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={save} className={`py-3 rounded flex items-center justify-center gap-2 transition-all ${saved ? 'bg-[#00ff88] text-[#0a0f0d]' : 'bg-[#00ff8820] text-[#00ff88] hover:bg-[#00ff88]/30'}`}><Save className="w-4 h-4" />{saved ? 'SAVED!' : 'Save'}</button>
        <button onClick={reset} className="py-3 bg-[#0a0f0d] border border-[#1a2924] text-[#4a6660] rounded flex items-center justify-center gap-2 hover:text-white hover:border-[#00ff88]"><RotateCcw className="w-4 h-4" />Reset</button>
      </div>

      <div className="bg-[#111916] border border-[#1a2924] rounded p-4">
        <div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-[#00ff88]" /><span className="text-xs text-[#4a6660] font-semibold">SYSTEM INFO</span></div>
        <div className="space-y-2 text-[10px]">
          <div className="flex items-center justify-between p-2 bg-[#0a0f0d] rounded"><span className="text-[#4a6660] flex items-center gap-2"><Database className="w-3 h-3" />Version</span><span className="text-white font-semibold">1.0.0</span></div>
          <div className="flex items-center justify-between p-2 bg-[#0a0f0d] rounded"><span className="text-[#4a6660] flex items-center gap-2"><Clock className="w-3 h-3" />Build Date</span><span className="text-white font-semibold">2024.01.15</span></div>
          <div className="flex items-center justify-between p-2 bg-[#0a0f0d] rounded"><span className="text-[#4a6660] flex items-center gap-2"><Cpu className="w-3 h-3" />Status</span><span className="text-[#00ff88] font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse"></span>OPERATIONAL</span></div>
          <div className="flex items-center justify-between p-2 bg-[#0a0f0d] rounded"><span className="text-[#4a6660] flex items-center gap-2"><Wifi className="w-3 h-3" />Connection</span><span className="text-[#00ff88] font-semibold flex items-center gap-1"><Wifi className="w-3 h-3" />CONNECTED</span></div>
        </div>
      </div>

      <div className="bg-[#111916] border border-[#1a2924] rounded p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-[#4a6660] font-semibold">CRYPTOGRAPHY MODULE</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/50 rounded text-purple-500 text-xs hover:bg-purple-500/30">
            <RefreshCw className="w-3 h-3" />
            ROTATE KEYS
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          {cryptoKeys.map(cryptoKey => (
            <div key={cryptoKey.id} className="p-3 bg-[#0a0f0d] rounded border border-[#1a2924]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-purple-500" />
                  <span className="text-xs font-mono text-white">{cryptoKey.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  cryptoKey.status === 'active' ? 'bg-green-500/20 text-green-500' :
                  cryptoKey.status === 'standby' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-gray-500/20 text-gray-500'
                }`}>
                  {cryptoKey.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-mono text-gray-500 bg-gray-900/50 p-1.5 rounded">
                  {showKeys[cryptoKey.id] ? cryptoKey.key : '••••••••••••••••'}
                </code>
                <button 
                  onClick={() => setShowKeys(prev => ({ ...prev, [cryptoKey.id]: !prev[cryptoKey.id] }))}
                  className="p-1.5 text-gray-500 hover:text-white"
                >
                  {showKeys[cryptoKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => { navigator.clipboard.writeText(cryptoKey.key); setCopiedKey(cryptoKey.id); setTimeout(() => setCopiedKey(null), 2000); }}
                  className="p-1.5 text-gray-500 hover:text-white"
                >
                  {copiedKey === cryptoKey.id ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#0a0f0d] rounded border border-[#1a2924]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">Auto Key Rotation</span>
            <button 
              onClick={() => setAutoRotate(!autoRotate)}
              className={`w-10 h-5 rounded-full transition-all ${autoRotate ? 'bg-purple-500' : 'bg-gray-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${autoRotate ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {autoRotate && (
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-500">Rotation Interval</span>
                <span className="text-purple-500 font-mono">{rotationInterval}h</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="72" 
                value={rotationInterval}
                onChange={(e) => setRotationInterval(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[9px] text-gray-600 mt-1">
                <span>1h</span><span>24h</span><span>48h</span><span>72h</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <span className="text-xs text-yellow-500">Keys rotated automatically every {rotationInterval} hours. Manual rotation requires command authorization.</span>
        </div>
      </div>
    </div>
  );
}
