import { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Search, Clock, ArrowUp, Crosshair, Zap, Activity, Info, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';

const typeColors = { movement: '#00ff88', detection: '#00ccff', alert: '#ff3344', status: '#ffaa00', intel: '#9966ff', communication: '#ff66aa' };
const typeIcons = { movement: ArrowUp, detection: Crosshair, alert: Zap, status: Activity, intel: Info, communication: MessageSquare };

export default function IntelFeedPage() {
  const { feed } = useStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredFeed = useMemo(() => feed.filter(e => (filter === 'all' || e.type === filter) && (!search || e.message.toLowerCase().includes(search.toLowerCase()))), [feed, filter, search]);

  const getRelativeTime = (ts) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#1a2924]" style={{ backgroundColor: '#0a0f0d' }}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6660]" />
            <input type="text" placeholder="Search feed..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#111916] border border-[#1a2924] rounded pl-10 pr-3 py-2 text-sm text-white" />
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['all', 'movement', 'detection', 'alert', 'status', 'intel'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className="px-3 py-1 text-xs rounded transition-colors" style={{ backgroundColor: filter === t ? '#00ff8820' : '#111916', color: filter === t ? '#00ff88' : '#4a6660', border: `1px solid ${filter === t ? '#00ff88' : '#1a2924'}` }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {filteredFeed.map(event => {
            const TypeIcon = typeIcons[event.type] || Info;
            return (
              <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-3 rounded-lg border" style={{ backgroundColor: '#111916', borderColor: '#1a2924' }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${typeColors[event.type]}20` }}>
                    <TypeIcon className="w-5 h-5" style={{ color: typeColors[event.type] }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[#00ccff] text-sm font-medium">{event.source}</span>
                      <span className="text-[#4a6660] text-xs">{getRelativeTime(event.timestamp)}</span>
                    </div>
                    <p className="text-white mt-1">{event.message}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded mt-2 inline-block" style={{ backgroundColor: `${typeColors[event.type]}20`, color: typeColors[event.type] }}>{event.type.toUpperCase()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
