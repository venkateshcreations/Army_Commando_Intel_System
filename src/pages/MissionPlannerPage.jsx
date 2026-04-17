import { useState, useEffect } from 'react';
import { MapPin, Navigation, Target, Flag, Clock, Users, Trash2, Plus, Play, Save, Download, ChevronRight, AlertTriangle, Shield, Radio, Zap, Crosshair, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const waypointTypes = [
  { id: 'start', label: 'START', color: '#22c55e', icon: Flag },
  { id: 'waypoint', label: 'WAYPOINT', color: '#3b82f6', icon: MapPin },
  { id: 'objective', label: 'OBJECTIVE', color: '#ef4444', icon: Target },
  { id: 'extraction', label: 'EXTRACTION', color: '#f97316', icon: Navigation },
  { id: 'hazard', label: 'HAZARD', color: '#eab308', icon: AlertTriangle },
  { id: 'rally', label: 'RALLY', color: '#a855f7', icon: Shield },
];

const initialWaypoints = [
  { id: 1, type: 'start', name: 'INSERTION POINT', lat: 34.0522, lon: -118.2437, notes: 'Primary insertion', time: '02:00' },
  { id: 2, type: 'waypoint', name: 'CHECKPOINT ALPHA', lat: 34.0550, lon: -118.2500, notes: 'Easy bypass', time: '02:15' },
  { id: 3, type: 'objective', name: 'TARGET BUILDING', lat: 34.0600, lon: -118.2600, notes: 'High value target', time: '02:45' },
  { id: 4, type: 'extraction', name: 'EXTRACTION POINT', lat: 34.0480, lon: -118.2350, notes: 'Backup: Delta', time: '03:30' },
];

export default function MissionPlannerPage() {
  const [waypoints, setWaypoints] = useState(initialWaypoints);
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);
  const [newWaypointType, setNewWaypointType] = useState('waypoint');
  const [missionName, setMissionName] = useState('OPERATION SIREN');
  const [showHazards, setShowHazards] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [missionTime, setMissionTime] = useState(120);
  const [pulseActive, setPulseActive] = useState(true);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setMissionTime(prev => Math.max(0, prev - 1));
        setCurrentWaypointIndex(prev => {
          if (prev < waypoints.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return 0;
          }
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, waypoints.length]);

  useEffect(() => {
    const interval = setInterval(() => setPulseActive(p => !p), 1000);
    return () => clearInterval(interval);
  }, []);

  const totalDistance = waypoints.length > 1 ? (waypoints.length - 1) * 1.2 : 0;
  const estimatedTime = waypoints.reduce((acc, wp) => {
    const [h, m] = wp.time.split(':').map(Number);
    return Math.max(acc, h * 60 + m);
  }, 0);

  const addWaypoint = () => {
    const lastWp = waypoints[waypoints.length - 1];
    const newId = Math.max(...waypoints.map(w => w.id)) + 1;
    const newWp = {
      id: newId,
      type: newWaypointType,
      name: `WP-${newId}`,
      lat: lastWp ? lastWp.lat + 0.002 : 34.0522,
      lon: lastWp ? lastWp.lon + 0.002 : -118.2437,
      notes: '',
      time: '02:00',
    };
    setWaypoints([...waypoints, newWp]);
  };

  const removeWaypoint = (id) => {
    setWaypoints(waypoints.filter(w => w.id !== id));
    if (selectedWaypoint === id) setSelectedWaypoint(null);
  };

  const updateWaypoint = (id, field, value) => {
    setWaypoints(waypoints.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const getWaypointColor = (type) => waypointTypes.find(t => t.id === type)?.color || '#6b7280';

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono">MISSION PLANNER</h1>
            <p className="text-xs text-gray-500 font-mono">TACTICAL ROUTE EDITOR</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={missionName}
            onChange={(e) => setMissionName(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
          />
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-500 font-mono text-sm hover:bg-blue-500/30 transition-all">
            <Save className="w-4 h-4" />
            SAVE
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 font-mono text-sm hover:text-white transition-all">
            <Download className="w-4 h-4" />
            EXPORT
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-80 flex flex-col gap-4">
          <div className="bg-black/40 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider">Mission Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                <div className="text-xs text-gray-500 font-mono mb-1">WAYPOINTS</div>
                <div className="text-xl font-bold text-white font-mono">{waypoints.length}</div>
              </div>
              <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                <div className="text-xs text-gray-500 font-mono mb-1">DISTANCE</div>
                <div className="text-xl font-bold text-white font-mono">{totalDistance.toFixed(1)} KM</div>
              </div>
              <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                <div className="text-xs text-gray-500 font-mono mb-1">EST. TIME</div>
                <div className="text-xl font-bold text-white font-mono">{Math.floor(estimatedTime / 60)}:{String(estimatedTime % 60).padStart(2, '0')}</div>
              </div>
              <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                <div className="text-xs text-gray-500 font-mono mb-1">TEAM SIZE</div>
                <div className="text-xl font-bold text-white font-mono">4</div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-black/40 rounded-lg border border-gray-800 overflow-y-auto">
            <div className="p-3 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider">Route Waypoints</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={newWaypointType}
                    onChange={(e) => setNewWaypointType(e.target.value)}
                    className="px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs font-mono text-gray-400 focus:border-blue-500 focus:outline-none"
                  >
                    {waypointTypes.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={addWaypoint}
                    className="p-1 bg-blue-500/20 border border-blue-500/50 rounded text-blue-500 hover:bg-blue-500/30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-2 space-y-2">
              <AnimatePresence>
                {waypoints.map((wp, index) => (
                  <motion.div
                    key={wp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={() => setSelectedWaypoint(wp.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedWaypoint === wp.id
                        ? 'bg-blue-500/10 border-blue-500'
                        : 'bg-gray-900/30 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{ backgroundColor: `${getWaypointColor(wp.type)}20` }}
                      >
                        {index === 0 ? <Flag className="w-3 h-3" style={{ color: getWaypointColor(wp.type) }} /> :
                         index === waypoints.length - 1 ? <Navigation className="w-3 h-3" style={{ color: getWaypointColor(wp.type) }} /> :
                         <MapPin className="w-3 h-3" style={{ color: getWaypointColor(wp.type) }} />}
                      </div>
                      <span className="text-sm font-mono text-white flex-1">{wp.name}</span>
                      {index < waypoints.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {wp.lat.toFixed(4)}, {wp.lon.toFixed(4)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 relative bg-black rounded-lg border border-gray-800 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950/20 to-black" />
            
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrowheadBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {waypoints.length > 1 && (
                <motion.polyline
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  points={waypoints.map((_, i) => {
                    const x = 80 + (i * 140);
                    const y = 120 + Math.sin(i * 0.6) * 60;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  markerEnd="url(#arrowheadBlue)"
                  filter="url(#glow)"
                />
              )}
              {isPlaying && waypoints.map((wp, i) => {
                if (i <= currentWaypointIndex) return null;
                const x = 80 + (i * 140);
                const y = 120 + Math.sin(i * 0.6) * 60;
                return (
                  <motion.circle
                    key={`trail-${wp.id}`}
                    cx={x}
                    cy={y}
                    r="15"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1"
                    initial={{ opacity: 0.8, r: 8 }}
                    animate={{ opacity: 0, r: 25 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                );
              })}
            </svg>

            {waypoints.map((wp, index) => {
              const x = 80 + (index * 140);
              const y = 120 + Math.sin(index * 0.6) * 60;
              const isCurrent = isPlaying && currentWaypointIndex === index;
              const isComplete = isPlaying && currentWaypointIndex > index;
              
              return (
                <motion.div
                  key={wp.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer`}
                  style={{ left: x, top: y }}
                  onClick={() => setSelectedWaypoint(wp.id)}
                >
                  {isCurrent && (
                    <motion.div
                      className="absolute w-16 h-16 rounded-full border-2 border-blue-400"
                      animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      selectedWaypoint === wp.id 
                        ? 'border-white shadow-lg shadow-blue-500/70' 
                        : isCurrent
                          ? 'border-blue-400 shadow-lg shadow-blue-400'
                          : 'border-gray-500'
                    }`}
                    style={{ 
                      backgroundColor: getWaypointColor(wp.type),
                      boxShadow: isCurrent ? `0 0 20px ${getWaypointColor(wp.type)}` : undefined
                    }}
                  >
                    <span className="text-sm font-bold text-white">{index + 1}</span>
                  </div>
                  <div className="absolute top-full mt-1 text-[10px] font-mono text-gray-400 whitespace-nowrap bg-black/70 px-1 rounded">
                    {wp.name}
                  </div>
                </motion.div>
              );
            })}

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <motion.div 
                className="px-4 py-2 bg-black/70 backdrop-blur rounded-lg border border-blue-500/50"
                animate={isPlaying ? { borderColor: ['rgba(59,130,246,0.3)', 'rgba(59,130,246,0.8)', 'rgba(59,130,246,0.3)'] } : undefined}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="flex items-center gap-2">
                  {isPlaying && <Radio className="w-4 h-4 text-blue-400 animate-pulse" />}
                  <div className="text-sm font-bold font-mono text-blue-400">{missionName}</div>
                </div>
                <div className="text-xs text-gray-500 font-mono">{
                  isPlaying 
                    ? `WP-${currentWaypointIndex + 1}/${waypoints.length} ACTIVE` 
                    : 'READY FOR DEPLOYMENT'
                }</div>
              </motion.div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-black/70 rounded border border-gray-700">
                  <Timer className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-mono text-gray-400">
                    {isPlaying ? `${Math.floor(missionTime / 60)}:${String(missionTime % 60).padStart(2, '0')}` : '00:00'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHazards(!showHazards)}
                  className={`px-3 py-1.5 rounded border text-xs font-mono transition-all ${
                    showHazards ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-black/70 border-gray-700 text-gray-400'
                  }`}
                >
                  HAZARDS
                </button>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                  isPlaying 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <Play className="w-4 h-4" />
                {isPlaying ? 'ABORT' : 'EXECUTE'}
              </motion.button>
            </div>

            {isPlaying && (
              <div className="absolute bottom-4 left-4">
                <motion.div 
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 rounded-lg border border-red-500/50"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <Zap className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-red-500 font-mono">MISSION IN PROGRESS</span>
                </motion.div>
              </div>
            )}
          </div>

          {selectedWaypoint && (
            <div className="h-48 bg-black/40 rounded-lg border border-gray-800 p-4">
              {(() => {
                const wp = waypoints.find(w => w.id === selectedWaypoint);
                if (!wp) return null;
                return (
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 font-mono block mb-1">NAME</label>
                      <input
                        type="text"
                        value={wp.name}
                        onChange={(e) => updateWaypoint(wp.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-mono block mb-1">LATITUDE</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={wp.lat}
                        onChange={(e) => updateWaypoint(wp.id, 'lat', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-mono block mb-1">LONGITUDE</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={wp.lon}
                        onChange={(e) => updateWaypoint(wp.id, 'lon', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-mono block mb-1">ETA</label>
                      <input
                        type="time"
                        value={wp.time}
                        onChange={(e) => updateWaypoint(wp.id, 'time', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 font-mono block mb-1">NOTES</label>
                      <input
                        type="text"
                        value={wp.notes}
                        onChange={(e) => updateWaypoint(wp.id, 'notes', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-mono block mb-1">TYPE</label>
                      <select
                        value={wp.type}
                        onChange={(e) => updateWaypoint(wp.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                      >
                        {waypointTypes.map(t => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeWaypoint(wp.id)}
                        className="w-full px-3 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-500 font-mono text-sm hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        DELETE
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}