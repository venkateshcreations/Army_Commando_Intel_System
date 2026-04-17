import { useState } from 'react';
import { Bomb, Calendar, MapPin, Target, AlertTriangle, CheckCircle, XCircle, Plus, Minus, RotateCcw, Download, Sliders, Flame, Building, Car } from 'lucide-react';
import { motion } from 'framer-motion';

const assessments = [
  { id: 1, target: 'COMPOUND ALPHA', location: 'Sector 7', before: '2024-01-15', after: '2024-01-16', damage: 'DESTROYED', status: 'confirmed', hits: 3, beforeVideo: 'https://media.w3.org/2010/05/sintel/trailer.mp4', afterVideo: 'https://media.w3.org/2010/05/video/movie_300.mp4' },
  { id: 2, target: 'WEAPONS CACHE', location: 'Sector 12', before: '2024-01-14', after: '2024-01-15', damage: 'SEVERE', status: 'confirmed', hits: 2, beforeVideo: 'https://media.w3.org/2010/05/bunny/trailer.mp4', afterVideo: 'https://media.w3.org/2010/05/video/movie_300.mp4' },
  { id: 3, target: 'VEHICLE PARK', location: 'Sector 4', before: '2024-01-13', after: '2024-01-13', damage: 'MODERATE', status: 'pending', hits: 1, beforeVideo: 'https://media.w3.org/2010/05/sintel/trailer.mp4', afterVideo: 'https://media.w3.org/2010/05/bunny/trailer.mp4' },
  { id: 4, target: 'COMMS TOWER', location: 'Sector 9', before: '2024-01-12', after: '2024-01-12', damage: 'MINOR', status: 'confirmed', hits: 1, beforeVideo: 'https://media.w3.org/2010/05/bunny/trailer.mp4', afterVideo: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
];

export default function BattleDamagePage() {
  const [selectedAssessment, setSelectedAssessment] = useState(assessments[0]);
  const [viewMode, setViewMode] = useState('split');
  const [zoom, setZoom] = useState(100);
  const [filter, setFilter] = useState('all');

  const getDamageColor = (damage) => {
    if (damage === 'DESTROYED') return '#ef4444';
    if (damage === 'SEVERE') return '#f97316';
    if (damage === 'MODERATE') return '#eab308';
    return '#22c55e';
  };

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Bomb className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono">BATTLE DAMAGE</h1>
            <p className="text-xs text-gray-500 font-mono">ASSESSMENT (BDA)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded text-xs font-mono ${viewMode === 'split' ? 'bg-orange-500/20 text-orange-500' : 'text-gray-500'}`}
            >
              SPLIT
            </button>
            <button 
              onClick={() => setViewMode('before')}
              className={`px-3 py-1.5 rounded text-xs font-mono ${viewMode === 'before' ? 'bg-orange-500/20 text-orange-500' : 'text-gray-500'}`}
            >
              BEFORE
            </button>
            <button 
              onClick={() => setViewMode('after')}
              className={`px-3 py-1.5 rounded text-xs font-mono ${viewMode === 'after' ? 'bg-orange-500/20 text-orange-500' : 'text-gray-500'}`}
            >
              AFTER
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-72 flex flex-col gap-4">
          <div className="bg-black/40 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-mono text-white">TARGETS</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {['all', 'DESTROYED', 'SEVERE', 'MODERATE', 'MINOR'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap ${
                    filter === f 
                      ? 'bg-orange-500/20 text-orange-500' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {assessments.map(assessment => (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedAssessment(assessment)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedAssessment?.id === assessment.id
                      ? 'bg-orange-500/10 border-orange-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono text-white">{assessment.target}</span>
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-mono"
                      style={{ backgroundColor: `${getDamageColor(assessment.damage)}20`, color: getDamageColor(assessment.damage) }}
                    >
                      {assessment.damage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{assessment.location}</span>
                    <span className="ml-auto">{assessment.hits} HIT{assessment.hits > 1 ? 'S' : ''}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-black/40 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-mono">SUMMARY</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-gray-900/50 rounded">
                <div className="text-lg font-bold text-red-500 font-mono">12</div>
                <div className="text-[10px] text-gray-500">DESTROYED</div>
              </div>
              <div className="p-2 bg-gray-900/50 rounded">
                <div className="text-lg font-bold text-orange-500 font-mono">8</div>
                <div className="text-[10px] text-gray-500">SEVERE</div>
              </div>
              <div className="p-2 bg-gray-900/50 rounded">
                <div className="text-lg font-bold text-yellow-500 font-mono">15</div>
                <div className="text-[10px] text-gray-500">MODERATE</div>
              </div>
              <div className="p-2 bg-gray-900/50 rounded">
                <div className="text-lg font-bold text-green-500 font-mono">23</div>
                <div className="text-[10px] text-gray-500">MINOR</div>
              </div>
            </div>
          </div>
        </div>

<div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 relative bg-black rounded-lg border border-gray-800 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              {viewMode === 'split' ? (
                <>
                  <div className="flex-1 h-full relative border-r border-gray-700">
                    <div className="absolute top-4 left-4 px-2 py-1 bg-black/70 rounded z-10">
                      <span className="text-xs font-mono text-gray-400">BEFORE</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Building className="w-16 h-16 text-gray-600 opacity-40" />
                    </div>
                  </div>
                  <div className="flex-1 h-full relative">
                    <div className="absolute top-4 left-4 px-2 py-1 bg-black/70 rounded z-10">
                      <span className="text-xs font-mono text-gray-400">AFTER</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Flame className="w-16 h-16" style={{ color: selectedAssessment ? getDamageColor(selectedAssessment.damage) : '#ef4444', opacity: 0.5 }} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 h-full relative">
                  <div className="absolute top-4 left-4 px-2 py-1 bg-black/70 rounded z-10">
                    <span className="text-xs font-mono text-gray-400">{viewMode === 'before' ? 'BEFORE' : 'AFTER'}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {viewMode === 'before' ? (
                      <Building className="w-16 h-16 text-gray-600 opacity-40" />
                    ) : (
                      <Flame className="w-16 h-16" style={{ color: selectedAssessment ? getDamageColor(selectedAssessment.damage) : '#ef4444', opacity: 0.5 }} />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  className="p-2 bg-black/70 border border-gray-700 rounded text-gray-400 hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-gray-400">{zoom}%</span>
                <button 
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  className="p-2 bg-black/70 border border-gray-700 rounded text-gray-400 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-black/70 border border-gray-700 rounded text-gray-400 hover:text-white">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 border border-orange-500/50 rounded text-orange-500 text-xs hover:bg-orange-500/30">
                  <Download className="w-4 h-4" />
                  EXPORT
                </button>
              </div>
            </div>
          </div>

          {selectedAssessment && (
            <div className="h-24 bg-black/40 rounded-lg border border-gray-800 p-4">
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-mono block mb-1">TARGET</label>
                  <div className="text-sm text-white font-mono">{selectedAssessment.target}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-mono block mb-1">LOCATION</label>
                  <div className="text-sm text-white font-mono">{selectedAssessment.location}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-mono block mb-1">BEFORE</label>
                  <div className="text-sm text-white font-mono">{selectedAssessment.before}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-mono block mb-1">AFTER</label>
                  <div className="text-sm text-white font-mono">{selectedAssessment.after}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-mono block mb-1">DAMAGE</label>
                  <div className="text-sm font-mono" style={{ color: getDamageColor(selectedAssessment.damage) }}>
                    {selectedAssessment.damage}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}