import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, TrendingUp, Activity, Thermometer, Zap, Gauge, FileText, Download, Calendar, Clock, CheckCircle, Send } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

function ThreatHeatmap() {
  const { threats } = useStore();
  const threatList = threats || [];
  const critical = threatList.filter(t => t.severity === 'critical' && t.status === 'active').length;
  const high = threatList.filter(t => t.severity === 'high' && t.status === 'active').length;
  const medium = threatList.filter(t => t.severity === 'medium' && t.status === 'active').length;
  const low = threatList.filter(t => t.severity === 'low' && t.status === 'active').length;

  const data = [
    { name: 'Critical', value: critical, color: '#ff3344' },
    { name: 'High', value: high, color: '#ff6600' },
    { name: 'Medium', value: medium, color: '#ffaa00' },
    { name: 'Low', value: low, color: '#ffff00' },
  ];

  return (
    <div className="space-y-2">
      {data.map((item, idx) => (
        <motion.div 
          key={item.name}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center gap-2"
        >
          <span className="text-xs w-16 text-[#4a6660]">{item.name}</span>
          <div className="flex-1 h-3 bg-[#1a2924] rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(item.value * 30, 100)}%` }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="h-full rounded"
              style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
            />
          </div>
          <span className="text-xs w-6 text-right" style={{ color: item.color }}>{item.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

function TimelineChart() {
  const { analytics } = useStore();
  const data = analytics?.hourlyActivity || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <XAxis 
          dataKey="hour" 
          tick={{ fill: '#4a6660', fontSize: 10 }} 
          axisLine={{ stroke: '#1a2924' }}
          tickLine={{ stroke: '#1a2924' }}
        />
        <YAxis 
          tick={{ fill: '#4a6660', fontSize: 10 }}
          axisLine={{ stroke: '#1a2924' }}
          tickLine={{ stroke: '#1a2924' }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#0d1412', border: '1px solid #1a2924', borderRadius: 4 }}
          labelStyle={{ color: '#00ff88' }}
          itemStyle={{ color: '#00ccff' }}
        />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#00aa66" />
          </linearGradient>
        </defs>
        <Bar 
          dataKey="count" 
          fill="url(#barGradient)" 
          radius={[4, 4, 0, 0]}
          style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.4))' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RiskCurve() {
  const { analytics } = useStore();
  const data = analytics?.riskHistory || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <XAxis 
          dataKey="minute" 
          tick={{ fill: '#4a6660', fontSize: 10 }}
          axisLine={{ stroke: '#1a2924' }}
          tickLine={{ stroke: '#1a2924' }}
          tickFormatter={(v) => `${60 - v}m`}
        />
        <YAxis 
          tick={{ fill: '#4a6660', fontSize: 10 }}
          axisLine={{ stroke: '#1a2924' }}
          tickLine={{ stroke: '#1a2924' }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#0d1412', border: '1px solid #1a2924', borderRadius: 4 }}
          labelStyle={{ color: '#ff3344' }}
          itemStyle={{ color: '#ff3344' }}
        />
        <defs>
          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff3344" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#ff3344" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="score" 
          stroke="#ff3344" 
          strokeWidth={2}
          fill="url(#riskGradient)"
          style={{ filter: 'drop-shadow(0 0 6px rgba(255,51,68,0.6))' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function AnalyticsPage() {
  const { analytics, units, threats } = useStore();

  const riskScore = analytics?.riskScore ?? 0;
  const threatDensity = analytics?.threatDensity ?? 0;

  return (
    <div className="p-4 space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4"
      >
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-lg p-4"
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-[#ff3344]" />
            <span className="text-[#4a6660] text-xs uppercase tracking-wider">Risk Score</span>
          </div>
          <p className="text-4xl font-bold text-[#ff3344]">{riskScore}</p>
          <div className="mt-3 h-2 bg-[#1a2924] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${riskScore}%` }}
              className="h-full bg-gradient-to-r from-[#ffaa00] to-[#ff3344]"
            />
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-lg p-4"
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-[#ffaa00]" />
            <span className="text-[#4a6660] text-xs uppercase tracking-wider">Threat Density</span>
          </div>
          <p className="text-4xl font-bold text-[#ffaa00]">{threatDensity.toFixed(2)}</p>
          <p className="text-xs text-[#4a6660] mt-2">
            {(threats || []).filter(t => t.status === 'active').length} active threats
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-lg p-3"
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924'
          }}
        >
          <p className="text-[#00ff88] text-xs mb-3 flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            THREAT DISTRIBUTION
          </p>
          <div className="h-28">
            <ThreatHeatmap />
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-lg p-3"
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924'
          }}
        >
          <p className="text-[#00ff88] text-xs mb-2 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            ACTIVITY (24H)
          </p>
          <div className="h-32">
            <TimelineChart />
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-lg p-3"
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924'
          }}
        >
          <p className="text-[#00ff88] text-xs mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            RISK (60m)
          </p>
          <div className="h-32">
            <RiskCurve />
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-lg p-3"
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924'
          }}
        >
          <p className="text-[#00ff88] text-xs uppercase tracking-wider mb-2 pr-2">UNIT PERFORMANCE</p>
          <div className="space-y-1.5 pr-2">
            {(units || []).map(u => (
              <div key={u.id} className="flex items-center gap-2">
                <span className="text-xs text-white w-12 truncate">{u.name}</span>
                <div className="flex-1 h-2 bg-[#1a2924] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(u.health)}%` }}
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: u.health > 70 ? '#00ff88' : u.health > 30 ? '#ffaa00' : '#ff3344'
                    }}
                  />
                </div>
                <span className="text-xs text-[#4a6660] w-6 text-right">{Math.round(u.health)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-lg p-3"
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924'
          }}
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-[#0a0f0d]">
              <Zap className="w-4 h-4 text-[#00ccff] mx-auto mb-1" />
              <p className="text-lg font-bold text-[#00ccff]">87%</p>
              <p className="text-[8px] text-[#4a6660]">EFFICIENCY</p>
            </div>
            <div className="p-2 rounded bg-[#0a0f0d]">
              <Activity className="w-4 h-4 text-[#00ff88] mx-auto mb-1" />
              <p className="text-lg font-bold text-white">2.4s</p>
              <p className="text-[8px] text-[#4a6660]">RESPONSE</p>
            </div>
            <div className="p-2 rounded bg-[#0a0f0d]">
              <Gauge className="w-4 h-4 text-[#ffaa00] mx-auto mb-1" />
              <p className="text-lg font-bold text-[#ffaa00]">12</p>
              <p className="text-[8px] text-[#4a6660]">OPS/MIN</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-lg p-3"
          style={{ 
            backgroundColor: '#0d1412', 
            border: '1px solid #1a2924'
          }}
        >
          <p className="text-[#00ff88] text-xs uppercase tracking-wider mb-3">UNIT DETAILS</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#4a6660] border-b border-[#1a2924]">
                  <th className="text-left py-2 px-2">UNIT</th>
                  <th className="text-left py-2 px-2">ROLE</th>
                  <th className="text-left py-2 px-2">STATUS</th>
                  <th className="text-right py-2 px-2">HEALTH</th>
                  <th className="text-right py-2 px-2">LAT</th>
                  <th className="text-right py-2 px-2">LNG</th>
                </tr>
              </thead>
              <tbody>
                {(units || []).map(u => (
                  <tr key={u.id} className="border-b border-[#1a2924]/50 hover:bg-[#1a2924]/30">
                    <td className="py-2 px-2 text-white">{u.name}</td>
                    <td className="py-2 px-2 text-[#4a6660]">{u.role}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${u.status === 'active' ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-[#ffaa00]/20 text-[#ffaa00]'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right" style={{ color: u.health > 70 ? '#00ff88' : u.health > 30 ? '#ffaa00' : '#ff3344' }}>{Math.round(u.health)}%</td>
                    <td className="py-2 px-2 text-right text-[#4a6660]">{u.lat.toFixed(4)}</td>
                    <td className="py-2 px-2 text-right text-[#4a6660]">{u.lng.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4"
      >
        <motion.div className="bg-[#111916] border border-[#1a2924] rounded p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold text-white">AUTOMATED REPORTS</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/50 rounded text-blue-500 text-xs hover:bg-blue-500/30">
                <Download className="w-3 h-3" />
                PDF
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/50 rounded text-green-500 text-xs hover:bg-green-500/30">
                <Send className="w-3 h-3" />
                SEND TO COMMAND
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#0a0f0d] rounded border border-[#1a2924]">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-400">DAILY SITREP</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Last Generated</span>
                  <span className="text-white font-mono">14:00</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Next Generation</span>
                  <span className="text-white font-mono">tomorrow 14:00</span>
                </div>
                <button className="w-full mt-2 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded text-blue-500 text-xs">
                  GENERATE NOW
                </button>
              </div>
            </div>
            
            <div className="p-3 bg-[#0a0f0d] rounded border border-[#1a2924]">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-red-500" />
                <span className="text-xs text-gray-400">THREAT REPORT</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Format</span>
                  <span className="text-white font-mono">PDF</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Frequency</span>
                  <span className="text-white font-mono">6h</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] text-green-500">AUTO-SEND ENABLED</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-[#0a0f0d] rounded border border-[#1a2924]">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-400">UNIT STATUS</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Format</span>
                  <span className="text-white font-mono">PDF+JSON</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Frequency</span>
                  <span className="text-white font-mono">1h</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] text-green-500">AUTO-SEND ENABLED</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-[#0a0f0d] rounded border border-[#1a2924]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Available Templates</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-500 text-[10px] rounded">DAILY</span>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] rounded">WEEKLY</span>
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-500 text-[10px] rounded">MISSION</span>
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 text-[10px] rounded">BDA</span>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-[10px] rounded">INTEL</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
