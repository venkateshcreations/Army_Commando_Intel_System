import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield, Crosshair, Heart, Zap, MapPin, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

const roleIcons = { Assault: Zap, Recon: Crosshair, Support: Shield, Sniper: Crosshair, Medical: Heart };
const roleColors = { Assault: '#ff3344', Recon: '#00ccff', Support: '#ffaa00', Sniper: '#9966ff', Medical: '#00ff88' };
const statusColors = { active: '#00ff88', idle: '#ffaa00', injured: '#ff3344', compromised: '#ff6600' };

export default function UnitsPage() {
  const { units } = useStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = useMemo(() => units.filter(u => (roleFilter === 'all' || u.role === roleFilter) && (!search || u.name.toLowerCase().includes(search.toLowerCase()))), [units, search, roleFilter]);

  const stats = useMemo(() => ({
    active: units.filter(u => u.status === 'active').length,
    idle: units.filter(u => u.status === 'idle').length,
    injured: units.filter(u => u.status === 'injured' || u.health < 70).length,
    avgHealth: Math.round(units.reduce((s, u) => s + u.health, 0) / units.length)
  }), [units]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#1a2924]" style={{ backgroundColor: '#0a0f0d' }}>
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-[#00ff88]/20 border border-[#00ff88]/30 rounded p-3 text-center">
            <p className="text-2xl font-bold text-[#00ff88]">{stats.active}</p>
            <p className="text-[10px] text-[#4a6660]">Active</p>
          </div>
          <div className="bg-[#ffaa00]/20 border border-[#ffaa00]/30 rounded p-3 text-center">
            <p className="text-2xl font-bold text-[#ffaa00]">{stats.idle}</p>
            <p className="text-[10px] text-[#4a6660]">Idle</p>
          </div>
          <div className="bg-[#ff3344]/20 border border-[#ff3344]/30 rounded p-3 text-center">
            <p className="text-2xl font-bold text-[#ff3344]">{stats.injured}</p>
            <p className="text-[10px] text-[#4a6660]">Injured</p>
          </div>
          <div className="bg-[#00ccff]/20 border border-[#00ccff]/30 rounded p-3 text-center">
            <p className="text-2xl font-bold text-[#00ccff]">{stats.avgHealth}%</p>
            <p className="text-[10px] text-[#4a6660]">Avg Health</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6660]" />
            <input type="text" placeholder="Search units..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#111916] border border-[#1a2924] rounded pl-10 pr-3 py-2 text-sm text-white" />
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['all', 'Assault', 'Recon', 'Support', 'Sniper', 'Medical'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} className="px-3 py-1 text-xs rounded" style={{ backgroundColor: roleFilter === r ? '#00ff8820' : '#111916', color: roleFilter === r ? '#00ff88' : '#4a6660', border: `1px solid ${roleFilter === r ? '#00ff88' : '#1a2924'}` }}>{r === 'all' ? 'All' : r}</button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(unit => {
            const Icon = roleIcons[unit.role] || Shield;
            return (
              <motion.div key={unit.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg border" style={{ backgroundColor: '#111916', borderColor: '#1a2924' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${roleColors[unit.role]}20` }}>
                      <Icon className="w-6 h-6" style={{ color: roleColors[unit.role] }} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{unit.name}</p>
                      <p className="text-[#4a6660] text-xs">{unit.role} • {unit.id}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded text-[10px] font-medium" style={{ backgroundColor: `${statusColors[unit.status]}20`, color: statusColors[unit.status], border: `1px solid ${statusColors[unit.status]}30` }}>{unit.status.toUpperCase()}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1"><span className="text-[#4a6660]">Health</span><span style={{ color: unit.health > 70 ? '#00ff88' : unit.health > 30 ? '#ffaa00' : '#ff3344' }}>{unit.health}%</span></div>
                  <div className="h-2 bg-[#1a2924] rounded-full overflow-hidden">
                    <div className="h-full transition-all" style={{ width: `${unit.health}%`, backgroundColor: unit.health > 70 ? '#00ff88' : unit.health > 30 ? '#ffaa00' : '#ff3344' }} />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-[#4a6660]">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {unit.lat.toFixed(4)}, {unit.lng.toFixed(4)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(unit.lastUpdate).toLocaleTimeString('en-US', { hour12: false })}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
