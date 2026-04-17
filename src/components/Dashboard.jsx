import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShieldAlert, 
  Target, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Heart,
  Crosshair,
  Zap,
  Clock,
  MapPin,
  Radio,
  Signal,
  Shield
} from 'lucide-react';
import { useStore } from '../store/useStore';

const StatCard = ({ icon: Icon, label, value, subValue, color, bgColor, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`relative overflow-hidden rounded-lg ${bgColor} border border-tactical-border p-3`}
  >
    <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
      <Icon className="w-full h-full" />
    </div>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-tactical-muted text-[10px] uppercase tracking-wider font-semibold">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color} drop-shadow-lg`}>{value}</p>
        {subValue && <p className="text-xs text-tactical-muted mt-1">{subValue}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-1 ${trend > 0 ? 'text-tactical-primary' : 'text-tactical-danger'}`}>
            <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span className="text-xs">{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
      <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-')}/20 backdrop-blur`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
  </motion.div>
);

const MiniStat = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-2 bg-tactical-dark/50 rounded p-2">
    <Icon className={`w-4 h-4 ${color}`} />
    <div>
      <p className="text-tactical-muted text-[10px]">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { units, threats, alerts, analytics } = useStore();

  const stats = useMemo(() => {
    const activeUnits = units.filter(u => u.status === 'active').length;
    const criticalThreats = threats.filter(t => t.severity === 'critical' && t.status === 'active').length;
    const highThreats = threats.filter(t => t.severity === 'high' && t.status === 'active').length;
    const avgHealth = Math.round(units.reduce((sum, u) => sum + u.health, 0) / units.length);
    const unacknowledged = alerts.filter(a => !a.acknowledged).length;
    const totalThreats = threats.filter(t => t.status === 'active').length;
    
    const injuryCount = units.filter(u => u.health < 70).length;
    const idleCount = units.filter(u => u.status === 'idle').length;
    
    return { 
      activeUnits, 
      criticalThreats, 
      highThreats, 
      avgHealth, 
      unacknowledged,
      totalThreats,
      injuryCount,
      idleCount
    };
  }, [units, threats, alerts]);

  const riskLevel = useMemo(() => {
    const { riskScore } = analytics;
    if (riskScore >= 75) return { level: 'CRITICAL', color: 'text-tactical-danger', bg: 'bg-tactical-danger/20' };
    if (riskScore >= 50) return { level: 'HIGH', color: 'text-tactical-warning', bg: 'bg-tactical-warning/20' };
    if (riskScore >= 25) return { level: 'MODERATE', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    return { level: 'LOW', color: 'text-tactical-primary', bg: 'bg-tactical-primary/20' };
  }, [analytics.riskScore]);

  const unitsByRole = useMemo(() => {
    const roles = { Assault: 0, Recon: 0, Support: 0, Sniper: 0, Medical: 0 };
    units.forEach(u => { if (roles[u.role] !== undefined) roles[u.role]++; });
    return roles;
  }, [units]);

  const threatsBySeverity = useMemo(() => {
    const severity = { critical: 0, high: 0, medium: 0, low: 0 };
    threats.filter(t => t.status === 'active').forEach(t => { if (severity[t.severity] !== undefined) severity[t.severity]++; });
    return severity;
  }, [threats]);

  return (
    <div className="bg-tactical-card border border-tactical-border rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-tactical-border flex items-center justify-between">
        <h2 className="text-tactical-primary font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          OPERATIONAL DASHBOARD
        </h2>
        <div className={`flex items-center gap-2 px-3 py-1 rounded ${riskLevel.bg} border border-tactical-border`}>
          <Signal className={`w-3 h-3 ${riskLevel.color} animate-pulse`} />
          <span className={`text-xs font-bold ${riskLevel.color}`}>RISK: {riskLevel.level}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            icon={Users}
            label="Active Units"
            value={`${stats.activeUnits}/${units.length}`}
            subValue={`${stats.idleCount} idle`}
            color="text-tactical-primary"
            bgColor="bg-tactical-dark"
            trend={5}
            delay={0}
          />
          <StatCard
            icon={ShieldAlert}
            label="Active Threats"
            value={stats.totalThreats}
            subValue={`${stats.criticalThreats} critical`}
            color="text-tactical-danger"
            bgColor="bg-tactical-dark"
            trend={-12}
            delay={0.1}
          />
          <StatCard
            icon={Target}
            label="Avg Health"
            value={`${stats.avgHealth}%`}
            subValue={stats.injuryCount > 0 ? `${stats.injuryCount} need aid` : 'All units healthy'}
            color="text-tactical-secondary"
            bgColor="bg-tactical-dark"
            delay={0.2}
          />
          <StatCard
            icon={AlertTriangle}
            label="Pending Alerts"
            value={stats.unacknowledged}
            subValue="Unacknowledged"
            color="text-tactical-warning"
            bgColor="bg-tactical-dark"
            delay={0.3}
          />
        </div>

        <div className="bg-tactical-dark border border-tactical-border rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-tactical-muted font-semibold">UNIT COMPOSITION</span>
            <span className="text-xs text-tactical-primary">{units.length} total</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-tactical-danger" />
              <div className="flex-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-tactical-muted">Assault</span>
                  <span className="text-white">{unitsByRole.Assault}</span>
                </div>
                <div className="h-1.5 bg-tactical-border rounded-full overflow-hidden">
                  <div className="h-full bg-tactical-danger" style={{ width: `${(unitsByRole.Assault / units.length) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Crosshair className="w-3 h-3 text-tactical-secondary" />
              <div className="flex-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-tactical-muted">Recon</span>
                  <span className="text-white">{unitsByRole.Recon}</span>
                </div>
                <div className="h-1.5 bg-tactical-border rounded-full overflow-hidden">
                  <div className="h-full bg-tactical-secondary" style={{ width: `${(unitsByRole.Recon / units.length) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-tactical-warning" />
              <div className="flex-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-tactical-muted">Support</span>
                  <span className="text-white">{unitsByRole.Support}</span>
                </div>
                <div className="h-1.5 bg-tactical-border rounded-full overflow-hidden">
                  <div className="h-full bg-tactical-warning" style={{ width: `${(unitsByRole.Support / units.length) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-purple-500" />
              <div className="flex-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-tactical-muted">Sniper</span>
                  <span className="text-white">{unitsByRole.Sniper}</span>
                </div>
                <div className="h-1.5 bg-tactical-border rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${(unitsByRole.Sniper / units.length) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-tactical-primary" />
              <div className="flex-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-tactical-muted">Medical</span>
                  <span className="text-white">{unitsByRole.Medical}</span>
                </div>
                <div className="h-1.5 bg-tactical-border rounded-full overflow-hidden">
                  <div className="h-full bg-tactical-primary" style={{ width: `${(unitsByRole.Medical / units.length) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-tactical-dark border border-tactical-border rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-tactical-muted font-semibold">THREAT ANALYSIS</span>
            <span className="text-xs text-tactical-danger">{stats.totalThreats} active</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 bg-tactical-danger/20 rounded border border-tactical-danger/30">
              <p className="text-lg font-bold text-tactical-danger">{threatsBySeverity.critical}</p>
              <p className="text-[10px] text-tactical-muted">Critical</p>
            </div>
            <div className="text-center p-2 bg-orange-500/20 rounded border border-orange-500/30">
              <p className="text-lg font-bold text-orange-500">{threatsBySeverity.high}</p>
              <p className="text-[10px] text-tactical-muted">High</p>
            </div>
            <div className="text-center p-2 bg-tactical-warning/20 rounded border border-tactical-warning/30">
              <p className="text-lg font-bold text-tactical-warning">{threatsBySeverity.medium}</p>
              <p className="text-[10px] text-tactical-muted">Medium</p>
            </div>
            <div className="text-center p-2 bg-yellow-400/20 rounded border border-yellow-400/30">
              <p className="text-lg font-bold text-yellow-400">{threatsBySeverity.low}</p>
              <p className="text-[10px] text-tactical-muted">Low</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MiniStat icon={Radio} label="Intel Events" value={alerts.length} color="text-tactical-secondary" />
          <MiniStat icon={MapPin} label="Coverage" value="100%" color="text-tactical-primary" />
        </div>

        <div className="bg-tactical-dark border border-tactical-border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-tactical-muted text-xs">OVERALL THREAT DENSITY</span>
            <span className="text-tactical-danger font-bold">{analytics.threatDensity.toFixed(2)}</span>
          </div>
          <div className="h-3 bg-tactical-border rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(analytics.threatDensity * 30, 100)}%` }}
              className="h-full bg-gradient-to-r from-tactical-warning via-tactical-danger to-red-700 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </motion.div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-tactical-muted">Low</span>
            <span className="text-[10px] text-tactical-muted">Moderate</span>
            <span className="text-[10px] text-tactical-muted">High</span>
            <span className="text-[10px] text-tactical-danger">Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}
