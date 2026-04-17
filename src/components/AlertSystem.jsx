import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bell, X, Check, AlertCircle, Info, XCircle, Shield, Clock, MapPin, Users, Target } from 'lucide-react';
import { useStore } from '../store/useStore';

const severityConfig = {
  critical: { icon: XCircle, color: '#ff3344', bg: 'rgba(255,51,68,0.1)', border: '#ff3344' },
  warning: { icon: AlertTriangle, color: '#ffaa00', bg: 'rgba(255,170,0,0.1)', border: '#ffaa00' },
  info: { icon: Info, color: '#00ccff', bg: 'rgba(0,204,255,0.1)', border: '#00ccff' },
};

const typeIcons = {
  threat: Target,
  unit: Users,
  system: Shield,
  intel: Info,
};

export default function AlertSystem() {
  const { alerts, dismissAlert, acknowledgeAllAlerts } = useStore();
  
  const unacknowledged = useMemo(() => 
    alerts.filter(a => !a.acknowledged),
    [alerts]
  );

  const sortedAlerts = useMemo(() => 
    [...alerts].sort((a, b) => b.timestamp - a.timestamp).slice(0, 15),
    [alerts]
  );

  const alertStats = useMemo(() => {
    return {
      critical: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length,
      warning: alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length,
      info: alerts.filter(a => a.severity === 'info' && !a.acknowledged).length,
    };
  }, [alerts]);

  return (
    <div className="h-full flex flex-col rounded-lg" style={{ backgroundColor: '#111916', border: '1px solid #1a2924' }}>
      <div className="p-3 border-b" style={{ borderColor: '#1a2924' }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[#00ff88] font-semibold flex items-center gap-2">
            <Bell className="w-4 h-4" />
            ALERTS
          </h2>
          {unacknowledged.length > 0 && (
            <span className="bg-[#ff3344] text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              {unacknowledged.length}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-1 mt-2">
          <div className="bg-[#ff3344]/20 border border-[#ff3344]/30 rounded p-1.5 text-center">
            <p className="text-lg font-bold text-[#ff3344]">{alertStats.critical}</p>
            <p className="text-[10px] text-[#4a6660]">Critical</p>
          </div>
          <div className="bg-[#ffaa00]/20 border border-[#ffaa00]/30 rounded p-1.5 text-center">
            <p className="text-lg font-bold text-[#ffaa00]">{alertStats.warning}</p>
            <p className="text-[10px] text-[#4a6660]">Warning</p>
          </div>
          <div className="bg-[#00ccff]/20 border border-[#00ccff]/30 rounded p-1.5 text-center">
            <p className="text-lg font-bold text-[#00ccff]">{alertStats.info}</p>
            <p className="text-[10px] text-[#4a6660]">Info</p>
          </div>
        </div>
        
        {unacknowledged.length > 0 && (
          <button
            onClick={acknowledgeAllAlerts}
            className="w-full mt-2 text-xs text-[#00ccff] hover:text-[#00ff88] flex items-center justify-center gap-1 py-1.5 bg-[#0a0f0d] rounded border hover:border-[#00ff88]"
            style={{ borderColor: '#1a2924' }}
          >
            <Check className="w-3 h-3" />
            ACKNOWLEDGE ALL
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ maxHeight: 'calc(100% - 180px)' }}>
        <AnimatePresence>
          {sortedAlerts.map((alert) => {
            const config = severityConfig[alert.severity] || severityConfig.info;
            const Icon = config.icon;
            const TypeIcon = typeIcons[alert.type] || Shield;
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-3 rounded-lg border ${alert.acknowledged ? 'opacity-50' : ''}`}
                style={{ backgroundColor: 'rgba(10,15,13,0.8)', borderColor: config.border }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded" style={{ backgroundColor: config.bg }}>
                      <Icon className="w-4 h-4" style={{ color: config.color }} />
                    </div>
                    <div>
                      <p className="text-sm text-white leading-tight">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[10px] text-[#4a6660]">
                          <Clock className="w-3 h-3" />
                          {new Date(alert.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-[#4a6660]">
                          <TypeIcon className="w-3 h-3" />
                          {alert.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!alert.acknowledged && (
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="p-1 hover:bg-[#1a2924] rounded transition-colors"
                    >
                      <X className="w-3 h-3 text-[#4a6660]" />
                    </button>
                  )}
                </div>
                
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-[#4a6660]">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No alerts</p>
            <p className="text-xs opacity-60">System operating normally</p>
          </div>
        )}
      </div>
    </div>
  );
}
