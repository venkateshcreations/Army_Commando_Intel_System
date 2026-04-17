import { useState } from 'react';
import { User, Search, AlertTriangle, Eye, Shield, Fingerprint, MapPin, Clock, Target, Crosshair, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const combatants = [
  { id: 1, name: 'KHALID IBRAHIM', codename: 'SCORPION', threat: 'HIGH', status: 'active', lastSeen: '2 min ago', location: 'Sector 7', photo: 'K', confidence: 94, notes: 'Primary target - armed & dangerous' },
  { id: 2, name: 'AHMED FAROUK', codename: 'VIPER', threat: 'HIGH', status: 'active', lastSeen: '15 min ago', location: 'Sector 12', photo: 'A', confidence: 89, notes: 'Explosives specialist' },
  { id: 3, name: 'MOHAMED SALIM', codename: 'COBRA', threat: 'MEDIUM', status: 'unknown', lastSeen: '2 hours ago', location: 'Unknown', photo: 'M', confidence: 76, notes: 'Known associate' },
  { id: 4, name: 'YUSUF HASSAN', codename: 'SANDVIPER', threat: 'MEDIUM', status: 'in-custody', lastSeen: '1 day ago', location: 'HQ Detention', photo: 'Y', confidence: 98, notes: 'Apprehended' },
  { id: 5, name: 'IBRAHIM RASHID', codename: 'PYTHON', threat: 'LOW', status: 'unknown', lastSeen: '3 days ago', location: 'Unknown', photo: 'I', confidence: 65, notes: 'Peripheral contact' },
];

const recentAlerts = [
  { id: 1, time: '14:32:15', type: 'face-match', target: 'SCORPION', location: 'Sector 7', confidence: 94 },
  { id: 2, time: '14:28:42', type: 'face-match', target: 'VIPER', location: 'Sector 12', confidence: 89 },
  { id: 3, time: '14:15:33', type: 'new-entry', target: 'Unknown M', location: 'Sector 4', confidence: 72 },
];

export default function BiometricsPage() {
  const [search, setSearch] = useState('');
  const [selectedCombatant, setSelectedCombatant] = useState(null);
  const [threatFilter, setThreatFilter] = useState('all');
  const [detectionActive, setDetectionActive] = useState(true);

  const filteredCombatants = combatants.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.codename.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = threatFilter === 'all' || c.threat === threatFilter;
    return matchesSearch && matchesFilter;
  });

  const getThreatColor = (threat) => {
    if (threat === 'HIGH') return '#ef4444';
    if (threat === 'MEDIUM') return '#f97316';
    return '#22c55e';
  };

  const getStatusColor = (status) => {
    if (status === 'active') return '#ef4444';
    if (status === 'in-custody') return '#22c55e';
    return '#6b7280';
  };

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Fingerprint className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono">BIOMETRICS</h1>
            <p className="text-xs text-gray-500 font-mono">COMBATANT DATABASE</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDetectionActive(!detectionActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all ${
              detectionActive
                ? 'bg-purple-500/20 border border-purple-500 text-purple-500'
                : 'bg-gray-800/50 border border-gray-700 text-gray-400'
            }`}
          >
            <Eye className="w-4 h-4" />
            {detectionActive ? 'SCANNING' : 'IDLE'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or codename..."
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              {['all', 'HIGH', 'MEDIUM', 'LOW'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setThreatFilter(filter)}
                  className={`px-3 py-2 rounded-lg font-mono text-sm transition-all ${
                    threatFilter === filter
                      ? 'bg-purple-500/20 border border-purple-500 text-purple-500'
                      : 'bg-black/40 border border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {filter.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-black/40 rounded-lg border border-gray-800 overflow-y-auto">
            <div className="p-3 border-b border-gray-800">
              <div className="grid grid-cols-6 gap-2 text-xs font-mono text-gray-500 uppercase">
                <div>Photo</div>
                <div className="col-span-2">Name</div>
                <div>Threat</div>
                <div>Status</div>
                <div>Last Seen</div>
              </div>
            </div>
            <div className="p-2 space-y-2">
              <AnimatePresence>
                {filteredCombatants.map(combatant => (
                  <motion.div
                    key={combatant.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedCombatant(combatant)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCombatant?.id === combatant.id
                        ? 'bg-purple-500/10 border-purple-500'
                        : 'bg-gray-900/30 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="grid grid-cols-6 gap-2 items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-400">{combatant.photo}</span>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm font-mono text-white">{combatant.codename}</div>
                        <div className="text-xs text-gray-500 font-mono">{combatant.name}</div>
                      </div>
                      <div>
                        <span 
                          className="px-2 py-1 rounded text-xs font-mono"
                          style={{ backgroundColor: `${getThreatColor(combatant.threat)}20`, color: getThreatColor(combatant.threat) }}
                        >
                          {combatant.threat}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(combatant.status) }} />
                        <span className="text-xs font-mono text-gray-400">{combatant.status}</span>
                      </div>
                      <div className="text-xs font-mono text-gray-500">{combatant.lastSeen}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-80 flex flex-col gap-4">
          <div className="bg-black/40 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-mono text-white">RECENT ALERTS</span>
            </div>
            <div className="space-y-2">
              {recentAlerts.map(alert => (
                <div key={alert.id} className="p-2 rounded bg-gray-900/50 border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Crosshair className="w-3 h-3 text-red-500" />
                      <span className="text-xs font-mono text-white">{alert.target}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">{alert.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span>{alert.location}</span>
                    <span className={alert.confidence > 85 ? 'text-green-500' : 'text-yellow-500'}>{alert.confidence}% CONF</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedCombatant && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black/40 rounded-lg border border-gray-800 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-400">{selectedCombatant.photo}</span>
                  </div>
                  <div>
                    <div className="text-sm font-mono text-white">{selectedCombatant.codename}</div>
                    <div className="text-xs text-gray-500">{selectedCombatant.name}</div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-800 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2 bg-gray-900/50 rounded">
                  <div className="text-[10px] text-gray-500 font-mono mb-1">CONFIDENCE</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${selectedCombatant.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-400">{selectedCombatant.confidence}%</span>
                  </div>
                </div>
                <div className="p-2 bg-gray-900/50 rounded">
                  <div className="text-[10px] text-gray-500 font-mono mb-1">STATUS</div>
                  <div className="flex items-center gap-2">
                    {selectedCombatant.status === 'active' ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : selectedCombatant.status === 'in-custody' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-xs font-mono text-gray-400 uppercase">{selectedCombatant.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-mono">LOCATION</span>
                  <span className="text-gray-400 font-mono">{selectedCombatant.location}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-mono">LAST SEEN</span>
                  <span className="text-gray-400 font-mono">{selectedCombatant.lastSeen}</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500 font-mono block mb-1">NOTES</span>
                  <p className="text-gray-400">{selectedCombatant.notes}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-500 font-mono text-xs hover:bg-red-500/30">
                  <Target className="w-3 h-3" />
                  MARK TARGET
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 p-2 bg-purple-500/20 border border-purple-500/50 rounded text-purple-500 font-mono text-xs hover:bg-purple-500/30">
                  <MapPin className="w-3 h-3" />
                  TRACK
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}