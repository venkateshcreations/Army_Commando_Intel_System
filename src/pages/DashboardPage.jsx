import React from 'react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { simulationEngine } from '../systems/SimulationEngine';
import { 
  Users, ShieldAlert, Target, Activity, TrendingUp, AlertTriangle,
  Heart, Crosshair, Zap, Clock, MapPin, Radio, Signal, Wifi, Battery, Thermometer, Wind, Compass, Map, Flag, Package, Radio as RadioComm, Shield, Eye, Cross, AlertCircle, Globe
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subValue, color, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -3, transition: { duration: 0.2 } }}
    className="rounded-lg p-5 card-hover"
    style={{ 
      backgroundColor: '#0d1412', 
      border: '1px solid #1a2924',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
    }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[#4a6660] text-xs uppercase font-semibold tracking-wider">{label}</p>
        <p className="text-3xl font-bold mt-2" style={{ color, textShadow: `0 0 20px ${color}40` }}>{value}</p>
        {subValue && <p className="text-xs text-[#4a6660] mt-2">{subValue}</p>}
        {trend && (
          <div style={{ color: trend > 0 ? '#00ff88' : '#ff3344' }} className="flex items-center gap-1 mt-2">
            <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span className="text-xs font-medium">{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="p-3 rounded-xl" 
        style={{ 
          backgroundColor: `${color}15`,
          border: `1px solid ${color}30`
        }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </motion.div>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const { units, threats, alerts, analytics, feed } = useStore();

  const stats = {
    activeUnits: units.filter(u => u.status === 'active').length,
    totalThreats: threats.filter(t => t.status === 'active').length,
    criticalThreats: threats.filter(t => t.severity === 'critical' && t.status === 'active').length,
    avgHealth: Math.round(units.reduce((sum, u) => sum + u.health, 0) / units.length),
    unacknowledged: alerts.filter(a => !a.acknowledged).length,
  };

  const riskLevel = analytics.riskScore >= 75 ? 'CRITICAL' : analytics.riskScore >= 50 ? 'HIGH' : analytics.riskScore >= 25 ? 'MODERATE' : 'LOW';
  const riskColor = analytics.riskScore >= 75 ? '#ff3344' : analytics.riskScore >= 50 ? '#ffaa00' : analytics.riskScore >= 25 ? '#ffff00' : '#00ff88';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ 
              backgroundColor: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.2)'
            }}
          >
            <Signal className="w-4 h-4 text-[#00ff88]" />
            <span className="text-xs text-[#4a6660]">SATELLITE</span>
            <span className="text-[#00ff88] text-xs font-bold">ONLINE</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2 rounded-lg"
            style={{ 
              backgroundColor: `${riskColor}15`, 
              border: `1px solid ${riskColor}40`,
              boxShadow: `0 0 20px ${riskColor}20`
            }}
          >
            <span style={{ color: riskColor, fontWeight: 'bold' }}>RISK: {riskLevel}</span>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-5"
      >
        <StatCard icon={Users} label="Active Units" value={`${stats.activeUnits}/${units.length}`} subValue="Deployed" color="#00ff88" trend={5} delay={0} />
        <StatCard icon={ShieldAlert} label="Active Threats" value={stats.totalThreats} subValue={`${stats.criticalThreats} critical`} color="#ff3344" trend={-12} delay={0.1} />
        <StatCard icon={Target} label="Avg Health" value={`${stats.avgHealth}%`} subValue="Unit status" color="#00ccff" delay={0.2} />
        <StatCard icon={AlertTriangle} label="Pending Alerts" value={stats.unacknowledged} subValue="Unacknowledged" color="#ffaa00" delay={0.3} />
      </motion.div>

      <div className="grid grid-cols-3 gap-5">
        <div className="grid grid-cols-2 gap-5 col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg p-5" 
            style={{ 
              backgroundColor: '#0d1412', 
              border: '1px solid #1a2924',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}
          >
            <h3 className="text-[#00ff88] font-semibold mb-5 flex items-center gap-2">
              <Users className="w-5 h-5" /> 
              UNIT COMPOSITION
              <span className="ml-auto text-xs text-[#4a6660]">{units.length} TOTAL</span>
            </h3>
            <div className="space-y-4">
              {['Assault', 'Recon', 'Support', 'Sniper', 'Medical'].map(role => {
                const count = units.filter(u => u.role === role).length;
                const percent = (count / units.length) * 100;
                const colors = { Assault: '#ff3344', Recon: '#00ccff', Support: '#ffaa00', Sniper: '#9966ff', Medical: '#00ff88' };
                return (
                  <div key={role}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-[#4a6660]">{role}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                    <div className="h-2.5 bg-[#1a2924] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: colors[role],
                          boxShadow: `0 0 10px ${colors[role]}40`
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg p-5" 
            style={{ 
              backgroundColor: '#0d1412', 
              border: '1px solid #1a2924',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}
          >
            <h3 className="text-[#00ff88] font-semibold mb-5 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> 
              THREAT ANALYSIS
              <span className="ml-auto text-xs text-[#4a6660]">BY SEVERITY</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['critical', 'high', 'medium', 'low'].map(severity => {
                const count = threats.filter(t => t.severity === severity && t.status === 'active').length;
                const colors = { critical: '#ff3344', high: '#ff6600', medium: '#ffaa00', low: '#ffff00' };
                return (
                  <motion.div 
                    key={severity}
                    whileHover={{ scale: 1.02 }}
                    className="text-center p-4 rounded-lg cursor-pointer"
                    style={{ 
                      backgroundColor: `${colors[severity]}10`, 
                      border: `1px solid ${colors[severity]}30`,
                      boxShadow: `0 0 15px ${colors[severity]}10`
                    }}
                  >
                    <p className="text-3xl font-bold" style={{ color: colors[severity], textShadow: `0 0 15px ${colors[severity]}40` }}>{count}</p>
                    <p className="text-[10px] text-[#4a6660] uppercase tracking-wider mt-1">{severity}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-lg p-5" 
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h3 className="text-[#00ff88] font-semibold mb-5 flex items-center gap-2">
            <RadioComm className="w-5 h-5" /> 
            COMMUNICATIONS
          </h3>
          <div className="space-y-3">
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center justify-between p-3 bg-[#111916] rounded-lg border border-[#1a2924]"
            >
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-[#00ff88]" />
                <span className="text-sm text-[#4a6660]">Primary Net</span>
              </div>
              <span className="text-xs text-[#00ff88] font-bold px-2 py-1 rounded bg-[#00ff88]/10">CONNECTED</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center justify-between p-3 bg-[#111916] rounded-lg border border-[#1a2924]"
            >
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-[#00ccff]" />
                <span className="text-sm text-[#4a6660]">Backup Net</span>
              </div>
              <span className="text-xs text-[#00ccff] font-bold px-2 py-1 rounded bg-[#00ccff]/10">STANDBY</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center justify-between p-3 bg-[#111916] rounded-lg border border-[#1a2924]"
            >
              <div className="flex items-center gap-3">
                <Signal className="w-5 h-5 text-[#ffaa00]" />
                <span className="text-sm text-[#4a6660]">Satellite</span>
              </div>
              <span className="text-xs text-[#ffaa00] font-bold">85%</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center justify-between p-3 bg-[#111916] rounded-lg border border-[#1a2924]"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#9966ff]" />
                <span className="text-sm text-[#4a6660]">Data Link</span>
              </div>
              <span className="text-xs text-[#00ff88] font-bold px-2 py-1 rounded bg-[#00ff88]/10">ACTIVE</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-4 gap-5"
      >
        <motion.div 
          whileHover={{ y: -3 }}
          className="rounded-lg p-5" 
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h3 className="text-[#00ff88] font-semibold mb-4 flex items-center gap-2">
            <Flag className="w-5 h-5" /> 
            MISSION STATUS
          </h3>
          <div className="space-y-3">
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center gap-3"
            >
              <motion.div 
                animate={{ pulse: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-3 h-3 rounded-full bg-[#00ff88]"
              />
              <span className="text-sm text-white">RECONNAISSANCE</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center gap-3"
            >
              <motion.div 
                animate={{ pulse: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                className="w-3 h-3 rounded-full bg-[#ffaa00]"
              />
              <span className="text-sm text-white">PERIMETER PATROL</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center gap-3"
            >
              <div className="w-3 h-3 rounded-full bg-[#4a6660]" />
              <span className="text-sm text-[#4a6660]">EXTRACTION</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          className="rounded-lg p-5" 
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h3 className="text-[#00ff88] font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" /> 
            SUPPLIES
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#4a6660]">Ammunition</span>
                <span className="text-[#00ff88] font-bold">78%</span>
              </div>
              <div className="h-2 bg-[#1a2924] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-full bg-[#00ff88] rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#4a6660]">Medical</span>
                <span className="text-[#00ccff] font-bold">92%</span>
              </div>
              <div className="h-2 bg-[#1a2924] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="h-full bg-[#00ccff] rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#4a6660]">Fuel</span>
                <span className="text-[#ffaa00] font-bold">45%</span>
              </div>
              <div className="h-2 bg-[#1a2924] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="h-full bg-[#ffaa00] rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          className="rounded-lg p-5" 
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h3 className="text-[#00ff88] font-semibold mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5" /> 
            ENVIRONMENT
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-[#111916] rounded">
              <span className="text-sm text-[#4a6660]">Temperature</span>
              <span className="text-sm text-white font-bold">28°C</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#111916] rounded">
              <span className="text-sm text-[#4a6660]">Wind</span>
              <span className="text-sm text-white font-bold">12 km/h NW</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#111916] rounded">
              <span className="text-sm text-[#4a6660]">Visibility</span>
              <span className="text-sm text-[#00ff88] font-bold">10 km</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#111916] rounded">
              <span className="text-sm text-[#4a6660]">Humidity</span>
              <span className="text-sm text-white font-bold">65%</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          className="rounded-lg p-5" 
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h3 className="text-[#00ff88] font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" /> 
            POWER STATUS
          </h3>
          <div className="space-y-3">
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center justify-between p-3 bg-[#111916] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Battery className="w-5 h-5 text-[#00ff88]" />
                <span className="text-xs text-[#4a6660]">Main Power</span>
              </div>
              <span className="text-xs text-[#00ff88] font-bold">100%</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center justify-between p-3 bg-[#111916] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#ffaa00]" />
                <span className="text-xs text-[#4a6660]">Backup</span>
              </div>
              <span className="text-xs text-[#ffaa00] font-bold">72%</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center justify-between p-3 bg-[#111916] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-[#00ccff]" />
                <span className="text-xs text-[#4a6660]">Generator</span>
              </div>
              <span className="text-xs text-[#00ccff] font-bold">IDLE</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-3 gap-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg p-5 col-span-2" 
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h3 className="text-[#00ff88] font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" /> 
            THREAT DENSITY OVERVIEW
          </h3>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-[#4a6660]">Density Level</span>
                <span className="text-[#ff3344] font-bold text-lg">{analytics.threatDensity.toFixed(2)}</span>
              </div>
              <div className="h-4 bg-[#1a2924] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(analytics.threatDensity * 30, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #ffaa00 0%, #ff3344 50%, #ff6600 100%)',
                    boxShadow: '0 0 15px rgba(255, 51, 68, 0.5)'
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-[#4a6660]">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Critical</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-lg p-5" 
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h3 className="text-[#00ff88] font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> 
            RECENT ALERTS
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <AnimatePresence>
              {alerts.slice(0, 4).map((alert, index) => (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 text-sm p-3 bg-[#111916] rounded-lg"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.3 }}
                    className={`w-2 h-2 rounded-full mt-1.5 ${alert.severity === 'critical' ? 'bg-[#ff3344]' : alert.severity === 'warning' ? 'bg-[#ffaa00]' : 'bg-[#00ccff]'}`}
                  />
                  <div>
                    <p className="text-white truncate">{alert.message}</p>
                    <p className="text-[10px] text-[#4a6660] mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-lg p-4" 
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h3 className="text-[#00ff88] font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" /> 
            UNIT STATUS
            <span className="ml-auto text-xs text-[#4a6660]">{units.length} UNITS</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#4a6660] border-b border-[#1a2924]">
                  <th className="text-left py-2 px-3">UNIT</th>
                  <th className="text-left py-2 px-3">ROLE</th>
                  <th className="text-left py-2 px-3">STATUS</th>
                  <th className="text-right py-2 px-3">HEALTH</th>
                  <th className="text-right py-2 px-3">LAT</th>
                  <th className="text-right py-2 px-3">LNG</th>
                </tr>
              </thead>
              <tbody>
                {units.map(u => (
                  <tr key={u.id} className="border-b border-[#1a2924]/50 hover:bg-[#1a2924]/30">
                    <td className="py-2 px-3 text-white">{u.name}</td>
                    <td className="py-2 px-3 text-[#4a6660]">{u.role}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${u.status === 'active' ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-[#ffaa00]/20 text-[#ffaa00]'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right" style={{ color: u.health > 70 ? '#00ff88' : u.health > 30 ? '#ffaa00' : '#ff3344' }}>{Math.round(u.health)}%</td>
                    <td className="py-2 px-3 text-right text-[#4a6660]">{u.lat.toFixed(4)}</td>
                    <td className="py-2 px-3 text-right text-[#4a6660]">{u.lng.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
