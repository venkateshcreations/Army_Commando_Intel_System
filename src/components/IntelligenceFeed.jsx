import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Filter, Search, Clock, Activity, Zap, Shield, Crosshair, Info, MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';
import { useStore } from '../store/useStore';

const typeColors = {
  movement: '#00ff88',
  detection: '#00ccff',
  alert: '#ff3344',
  status: '#ffaa00',
  intel: '#9966ff',
  communication: '#ff66aa'
};

const typeIcons = {
  movement: ArrowUp,
  detection: Crosshair,
  alert: Zap,
  status: Activity,
  intel: Info,
  communication: MessageSquare,
};

export default function IntelligenceFeed() {
  const { feed } = useStore();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const listRef = useRef(null);

  const filteredFeed = useMemo(() => {
    return feed.filter(event => {
      if (filter !== 'all' && event.type !== filter) return false;
      if (searchQuery && !event.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [feed, filter, searchQuery]);

  const feedStats = useMemo(() => {
    const now = Date.now();
    const last5min = feed.filter(e => now - e.timestamp < 300000).length;
    const last15min = feed.filter(e => now - e.timestamp < 900000).length;
    const alerts = feed.filter(e => e.type === 'alert').length;
    return { last5min, last15min, alerts };
  }, [feed]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const getRelativeTime = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="bg-tactical-card border border-tactical-border rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-tactical-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-tactical-primary font-semibold flex items-center gap-2">
            <Radio className="w-4 h-4" />
            INTELLIGENCE FEED
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-tactical-muted">
              {feedStats.last5min} / 5m
            </span>
            <div className="w-2 h-2 bg-tactical-primary rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-1 mb-3">
          <div className="bg-tactical-dark border border-tactical-border rounded p-1.5 text-center">
            <p className="text-sm font-bold text-tactical-secondary">{feedStats.last5min}</p>
            <p className="text-[10px] text-tactical-muted">Last 5m</p>
          </div>
          <div className="bg-tactical-dark border border-tactical-border rounded p-1.5 text-center">
            <p className="text-sm font-bold text-tactical-primary">{feedStats.last15min}</p>
            <p className="text-[10px] text-tactical-muted">Last 15m</p>
          </div>
          <div className="bg-tactical-dark border border-tactical-border rounded p-1.5 text-center">
            <p className="text-sm font-bold text-tactical-danger">{feedStats.alerts}</p>
            <p className="text-[10px] text-tactical-muted">Alerts</p>
          </div>
        </div>
        
        <div className="relative mb-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-tactical-muted" />
          <input
            type="text"
            placeholder="Search feed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-tactical-dark border border-tactical-border rounded pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-tactical-primary"
          />
        </div>
        
        <div className="flex gap-1 flex-wrap">
          {['all', 'movement', 'detection', 'alert', 'status', 'intel'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                filter === type 
                  ? 'bg-tactical-primary/20 text-tactical-primary border border-tactical-primary' 
                  : 'bg-tactical-dark text-tactical-muted hover:text-white'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5" ref={listRef}>
        <AnimatePresence initial={false} limit={20}>
          {filteredFeed.map((event, index) => {
            const TypeIcon = typeIcons[event.type] || Info;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.2 }}
                className="p-2.5 bg-tactical-dark border border-tactical-border rounded hover:border-tactical-primary/50 transition-all"
              >
                <div className="flex items-start gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${typeColors[event.type]}20` }}
                  >
                    <TypeIcon className="w-4 h-4" style={{ color: typeColors[event.type] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-tactical-secondary text-xs font-semibold">{event.source}</span>
                      <span className="text-tactical-muted text-[10px]">{getRelativeTime(event.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-200 mt-0.5 leading-tight">{event.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${typeColors[event.type]}20`, color: typeColors[event.type] }}
                      >
                        {event.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredFeed.length === 0 && (
          <div className="text-center py-8 text-tactical-muted">
            <Radio className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No events</p>
            <p className="text-xs opacity-60">Feed is clear</p>
          </div>
        )}
      </div>
    </div>
  );
}
