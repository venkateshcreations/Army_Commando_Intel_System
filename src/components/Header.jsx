import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Play, Pause, Clock, RefreshCw, Wifi, Signal, Battery, MapPin, AlertTriangle, Users, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { simulationEngine } from '../systems/SimulationEngine';

export default function Header({ currentPage, onLogout }) {
  const { isSimulationRunning, units, threats, alerts } = useStore();
  const [time, setTime] = useState(new Date());
  const [blinkingAlert, setBlinkingAlert] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setBlinkingAlert(prev => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  const activeUnits = units.filter(u => u.status === 'active').length;
  const activeThreats = threats.filter(t => t.status === 'active').length;
  const unreadAlerts = alerts.filter(a => !a.acknowledged).length;

  const pageNames = {
    dashboard: 'OPERATIONAL DASHBOARD',
    map: 'TACTICAL MAP',
    feed: 'INTELLIGENCE FEED',
    surveillance: 'SURVEILLANCE',
    units: 'UNIT MANAGEMENT',
    comm: 'COMMUNICATIONS',
    alerts: 'ALERTS',
    analytics: 'ANALYTICS',
    settings: 'SETTINGS'
  };

  const getRiskColor = () => {
    const risk = (activeThreats * 15 + unreadAlerts * 10);
    if (risk > 70) return '#ff3344';
    if (risk > 40) return '#ffaa00';
    return '#00ff88';
  };

  return (
    <header 
      className="px-6 py-3 border-b flex items-center justify-between"
      style={{ 
        backgroundColor: '#0d1412', 
        borderColor: '#1a2924',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <motion.span 
            key={currentPage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-semibold text-lg tracking-wider"
          >
            {pageNames[currentPage] || 'DASHBOARD'}
          </motion.span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{ 
              backgroundColor: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.2)'
            }}
          >
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#4a6660]" />
              <span className="text-[#4a6660] text-sm">UNITS:</span>
              <motion.span 
                animate={{ color: '#00ff88' }}
                className="font-bold text-[#00ff88]"
              >
                {activeUnits}/{units.length}
              </motion.span>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{ 
              backgroundColor: activeThreats > 0 ? 'rgba(255,51,68,0.1)' : 'rgba(0,255,136,0.1)',
              border: `1px solid ${activeThreats > 0 ? 'rgba(255,51,68,0.2)' : 'rgba(0,255,136,0.2)'}`
            }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className={activeThreats > 0 ? "text-[#ff3344]" : "text-[#4a6660]"} />
              <span className="text-[#4a6660] text-sm">THREATS:</span>
              <motion.span 
                animate={{ color: activeThreats > 0 ? '#ff3344' : '#00ff88' }}
                className="font-bold"
              >
                {activeThreats}
              </motion.span>
            </div>
          </motion.div>

          {unreadAlerts > 0 && (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: 'rgba(255,51,68,0.15)',
                border: '1px solid rgba(255,51,68,0.3)'
              }}
            >
              <motion.div
                animate={{ opacity: blinkingAlert ? 1 : 0.3 }}
                className="w-2 h-2 rounded-full bg-[#ff3344]"
              />
              <span className="text-[#ff3344] font-bold text-sm">{unreadAlerts} ALERTS</span>
            </motion.div>
          )}
        </div>

        <div style={{ width: 1, height: 35, backgroundColor: '#1a2924' }} />

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => useStore.getState().toggleSimulation()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all"
            style={{ 
              backgroundColor: isSimulationRunning 
                ? 'rgba(255,170,0,0.15)' 
                : 'rgba(0,255,136,0.15)',
              border: `1px solid ${isSimulationRunning ? 'rgba(255,170,0,0.3)' : 'rgba(0,255,136,0.3)'}`,
              color: isSimulationRunning ? '#ffaa00' : '#00ff88'
            }}
          >
            {isSimulationRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span className="text-sm font-semibold">PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="text-sm font-semibold">RESUME</span>
              </>
            )}
          </motion.button>
        </div>

        <div style={{ width: 1, height: 35, backgroundColor: '#1a2924' }} />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: '#4a6660' }}>
            <Wifi className="w-4 h-4" />
            <span className="text-[#00ff88] font-medium">85%</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#4a6660' }}>
            <Signal className="w-4 h-4" />
            <span className="text-[#00ccff] font-medium">4G</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#4a6660' }}>
            <Battery className="w-4 h-4" />
            <span className="text-[#00ff88] font-medium">100%</span>
          </div>
        </div>

        <div style={{ width: 1, height: 35, backgroundColor: '#1a2924' }} />

        <motion.div 
          className="flex items-center gap-3 px-4 py-2 rounded-lg"
          style={{ 
            backgroundColor: '#0a0f0d',
            border: '1px solid #1a2924'
          }}
        >
          <Clock className="w-5 h-5 text-[#00ff88]" />
          <div className="flex flex-col">
            <span className="font-mono text-lg font-bold text-white tracking-wider">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span className="text-[10px] text-[#4a6660] tracking-widest">
              {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </span>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
          style={{ 
            backgroundColor: 'rgba(255,51,68,0.15)',
            border: '1px solid rgba(255,51,68,0.3)',
            color: '#ff3344'
          }}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold">LOGOUT</span>
        </motion.button>
      </div>
    </header>
  );
}
