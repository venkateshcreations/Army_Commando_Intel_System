import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bell, X, Check, AlertCircle, Info, XCircle, Shield, Clock, Target, Users } from 'lucide-react';
import { useStore } from '../store/useStore';

const severityConfig = {
  critical: { icon: XCircle, color: '#ff3344', bg: 'rgba(255,51,68,0.1)', border: '#ff3344' },
  warning: { icon: AlertTriangle, color: '#ffaa00', bg: 'rgba(255,170,0,0.1)', border: '#ffaa00' },
  info: { icon: Info, color: '#00ccff', bg: 'rgba(0,204,255,0.1)', border: '#00ccff' },
};
const typeIcons = { threat: Target, unit: Users, system: Shield, intel: Info };

export default function AlertsPage() {
  const { alerts, dismissAlert, acknowledgeAllAlerts } = useStore();
  
  const unack = useMemo(() => alerts.filter(a => !a.acknowledged), [alerts]);
  const sorted = useMemo(() => [...alerts].sort((a, b) => b.timestamp - a.timestamp), [alerts]);

  const stats = useMemo(() => ({
    critical: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length,
    warning: alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length,
    info: alerts.filter(a => a.severity === 'info' && !a.acknowledged).length,
  }), [alerts]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#1a2924]" style={{ backgroundColor: '#0a0f0d' }}>
        <div className="flex items-center justify-between mb-4">
          {unack.length > 0 && <span className="bg-[#ff3344] text-white text-xs px-3 py-1 rounded-full animate-pulse">{unack.length}</span>}
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#ff3344]/20 border border-[#ff3344]/30 rounded p-3 text-center">
            <p className="text-2xl font-bold text-[#ff3344]">{stats.critical}</p>
            <p className="text-[10px] text-[#4a6660]">Critical</p>
          </div>
          <div className="bg-[#ffaa00]/20 border border-[#ffaa00]/30 rounded p-3 text-center">
            <p className="text-2xl font-bold text-[#ffaa00]">{stats.warning}</p>
            <p className="text-[10px] text-[#4a6660]">Warning</p>
          </div>
          <div className="bg-[#00ccff]/20 border border-[#00ccff]/30 rounded p-3 text-center">
            <p className="text-2xl font-bold text-[#00ccff]">{stats.info}</p>
            <p className="text-[10px] text-[#4a6660]">Info</p>
          </div>
        </div>

        {unack.length > 0 && (
          <button onClick={acknowledgeAllAlerts} className="w-full py-2 rounded flex items-center justify-center gap-2 text-sm" style={{ backgroundColor: '#00ff8820', color: '#00ff88', border: '1px solid #00ff88' }}>
            <Check className="w-4 h-4" /> ACKNOWLEDGE ALL
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {sorted.map(alert => {
            const config = severityConfig[alert.severity] || severityConfig.info;
            const Icon = config.icon;
            const TypeIcon = typeIcons[alert.type] || Shield;
            
            return (
              <motion.div key={alert.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-4 rounded-lg border" style={{ backgroundColor: '#111916', borderColor: config.border, opacity: alert.acknowledged ? 0.5 : 1 }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded" style={{ backgroundColor: config.bg }}><Icon className="w-5 h-5" style={{ color: config.color }} /></div>
                    <div>
                      <p className="text-white font-medium">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[10px] text-[#4a6660]"><Clock className="w-3 h-3" />{new Date(alert.timestamp).toLocaleTimeString('en-US', { hour12: false })}</span>
                        <span className="flex items-center gap-1 text-[10px] text-[#4a6660]"><TypeIcon className="w-3 h-3" />{alert.type.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged && <button onClick={() => dismissAlert(alert.id)} className="p-1 hover:bg-[#1a2924] rounded"><X className="w-4 h-4 text-[#4a6660]" /></button>}
                </div>
                <div className="mt-2"><span className="text-[10px] px-2 py-1 rounded" style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.border}` }}>{alert.severity.toUpperCase()}</span></div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
