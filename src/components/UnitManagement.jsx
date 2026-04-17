import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, ChevronDown, Shield, Crosshair, Heart, Zap, MapPin, Clock, Radio, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';

const roleIcons = {
  Assault: Zap,
  Recon: Crosshair,
  Support: Shield,
  Sniper: Crosshair,
  Medical: Heart,
};

const roleColors = {
  Assault: '#ff3344',
  Recon: '#00ccff',
  Support: '#ffaa00',
  Sniper: '#9966ff',
  Medical: '#00ff88',
};

const statusColors = {
  active: { text: 'text-tactical-primary', bg: 'bg-tactical-primary/20', border: 'border-tactical-primary/30' },
  idle: { text: 'text-tactical-warning', bg: 'bg-tactical-warning/20', border: 'border-tactical-warning/30' },
  injured: { text: 'text-tactical-danger', bg: 'bg-tactical-danger/20', border: 'border-tactical-danger/30' },
  compromised: { text: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
};

export default function UnitManagement() {
  const { units, selectedUnit, setSelectedUnit } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      if (roleFilter !== 'all' && unit.role !== roleFilter) return false;
      if (searchQuery && !unit.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [units, roleFilter, searchQuery]);

  const unitStats = useMemo(() => {
    return {
      active: units.filter(u => u.status === 'active').length,
      idle: units.filter(u => u.status === 'idle').length,
      injured: units.filter(u => u.status === 'injured' || u.health < 70).length,
      avgHealth: Math.round(units.reduce((sum, u) => sum + u.health, 0) / units.length),
    };
  }, [units]);

  return (
    <div className="bg-tactical-card border border-tactical-border rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-tactical-border">
        <h2 className="text-tactical-primary font-semibold flex items-center gap-2 mb-3">
          <Users className="w-4 h-4" />
          UNIT MANAGEMENT
        </h2>
        
        <div className="grid grid-cols-4 gap-1 mb-3">
          <div className="bg-tactical-primary/20 border border-tactical-primary/30 rounded p-1.5 text-center">
            <p className="text-lg font-bold text-tactical-primary">{unitStats.active}</p>
            <p className="text-[10px] text-tactical-muted">Active</p>
          </div>
          <div className="bg-tactical-warning/20 border border-tactical-warning/30 rounded p-1.5 text-center">
            <p className="text-lg font-bold text-tactical-warning">{unitStats.idle}</p>
            <p className="text-[10px] text-tactical-muted">Idle</p>
          </div>
          <div className="bg-tactical-danger/20 border border-tactical-danger/30 rounded p-1.5 text-center">
            <p className="text-lg font-bold text-tactical-danger">{unitStats.injured}</p>
            <p className="text-[10px] text-tactical-muted">Injured</p>
          </div>
          <div className="bg-tactical-secondary/20 border border-tactical-secondary/30 rounded p-1.5 text-center">
            <p className="text-lg font-bold text-tactical-secondary">{unitStats.avgHealth}%</p>
            <p className="text-[10px] text-tactical-muted">Health</p>
          </div>
        </div>
        
        <div className="relative mb-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-tactical-muted" />
          <input
            type="text"
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-tactical-dark border border-tactical-border rounded pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-tactical-primary"
          />
        </div>
        
        <div className="flex gap-1 flex-wrap">
          {['all', 'Assault', 'Recon', 'Support', 'Sniper', 'Medical'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                roleFilter === role 
                  ? 'bg-tactical-primary/20 text-tactical-primary border border-tactical-primary' 
                  : 'bg-tactical-dark text-tactical-muted hover:text-white'
              }`}
            >
              {role === 'all' ? 'All' : role}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence>
          {filteredUnits.map((unit) => {
            const RoleIcon = roleIcons[unit.role] || Shield;
            const statusStyle = statusColors[unit.status] || statusColors.active;
            
            return (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedUnit(unit.id)}
                className={`p-3 bg-tactical-dark border rounded-lg cursor-pointer transition-all hover:border-tactical-primary/50 ${
                  selectedUnit === unit.id ? 'border-tactical-primary bg-tactical-primary/5' : 'border-tactical-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${roleColors[unit.role]}20` }}
                    >
                      <RoleIcon className="w-5 h-5" style={{ color: roleColors[unit.role] }} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{unit.name}</p>
                      <p className="text-tactical-muted text-xs">{unit.role} • {unit.id}</p>
                    </div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                    {unit.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-tactical-muted">Health Status</span>
                    <span className={unit.health > 70 ? 'text-tactical-primary' : unit.health > 30 ? 'text-tactical-warning' : 'text-tactical-danger'}>
                      {unit.health}%
                    </span>
                  </div>
                  <div className="h-2 bg-tactical-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${unit.health}%` }}
                      className={`h-full ${
                        unit.health > 70 ? 'bg-tactical-primary' :
                        unit.health > 30 ? 'bg-tactical-warning' : 'bg-tactical-danger'
                      }`}
                    />
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between text-[10px] text-tactical-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {unit.lat.toFixed(4)}, {unit.lng.toFixed(4)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(unit.lastUpdate).toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredUnits.length === 0 && (
          <div className="text-center py-8 text-tactical-muted">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No units found</p>
          </div>
        )}
      </div>
    </div>
  );
}
