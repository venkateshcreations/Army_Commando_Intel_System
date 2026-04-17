import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Radio, ChevronRight, AlertTriangle, Crosshair, Satellite, Zap } from 'lucide-react';

function RadarScanner() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 border border-orange-500/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-4 border border-orange-500/10 rounded-full"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(234,88,12,0.3) 30deg, transparent 60deg)',
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Crosshair className="w-64 h-64 text-orange-500/20" />
      </motion.div>
    </div>
  );
}

function DataStream({ delay }) {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: '120vw', opacity: [0, 1, 1, 0] }}
      transition={{ duration: 15, repeat: Infinity, delay, ease: 'linear' }}
      className="absolute top-1/4 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"
      style={{ width: '30vw' }}
    />
  );
}

function GridLines() {
  return (
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(234,88,12,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(234,88,12,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }} />
    </div>
  );
}

function PulseDot({ x, y, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 2, 2] }}
      transition={{ duration: 3, repeat: Infinity, delay }}
      className="absolute w-2 h-2 bg-orange-500 rounded-full"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
}

function SatelliteSignal({ delay }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0] }}
      transition={{ duration: 2, repeat: Infinity, delay }}
      className="absolute"
      style={{ top: '10%', right: '15%' }}
    >
      <Satellite className="w-8 h-8 text-orange-500/50" />
      <motion.div
        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 border border-orange-500 rounded-full"
      />
    </motion.div>
  );
}

function ScanLine() {
  return (
    <motion.div
      animate={{ top: ['-10%', '110%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent"
      style={{ filter: 'blur(2px)' }}
    />
  );
}

function WarningIndicator() {
  return (
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity }}
      className="absolute top-20 left-20 flex items-center gap-2"
    >
      <Zap className="w-4 h-4 text-yellow-500" />
      <span className="text-[10px] font-mono text-yellow-500/70">SCANNING...</span>
    </motion.div>
  );
}

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rank, setRank] = useState('');
  const [unit, setUnit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanLines, setScanLines] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLines(prev => [...prev.slice(-3), Math.random()]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (username && password) {
        onLogin({ username, rank, unit, time: new Date().toISOString() });
      } else {
        setError('INVALID CREDENTIALS');
        setIsLoading(false);
      }
    }, 1500);
  };

  const ranks = ['SELECT RANK', 'GEN', 'LT GEN', 'MAJ GEN', 'BRIG', 'COL', 'LT COL', 'MAJ', 'CAPT', 'LT', '2LT', 'SGT', 'CPL', 'PTE'];
  const units = ['SELECT UNIT', 'SPECIAL FORCES', 'PARA COMMANDO', 'ARMY AVIATION', 'ARMORED CORPS', 'INFANTRY', 'ARTILLERY', 'SIGNALS', 'ENGINEERS', 'MEDICAL', 'ORDNANCE'];

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <GridLines />
        <RadarScanner />
        <ScanLine />
        <SatelliteSignal />
        <WarningIndicator />
        
        <DataStream delay={0} />
        <DataStream delay={5} />
        <DataStream delay={10} />
        
        <PulseDot x={10} y={20} delay={0} />
        <PulseDot x={80} y={30} delay={1} />
        <PulseDot x={20} y={70} delay={2} />
        <PulseDot x={70} y={80} delay={3} />
        <PulseDot x={50} y={50} delay={4} />

        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.08)_0%,transparent_70%)]" />
        
        <motion.div
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-orange-500/5"
        />

        <div className="absolute bottom-10 left-10 flex items-center gap-4">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-[10px] font-mono text-green-500/70">SYSTEM ONLINE</span>
          </motion.div>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-[10px] font-mono text-green-500/70">SATELLITE CONNECTED</span>
          </motion.div>
        </div>

        <div className="absolute top-10 right-10 text-right">
          <div className="text-[10px] font-mono text-orange-500/50 mb-1">COORDINATES</div>
          <div className="text-xs font-mono text-orange-500/70">35.6762° N, 139.6503° E</div>
          <div className="text-[10px] font-mono text-orange-500/30 mt-2">ALT: 4,200 FT</div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-1/2 left-10 w-32"
        >
          <div className="text-[10px] font-mono text-orange-500/30 mb-2">SIGNAL STRENGTH</div>
          <div className="space-y-1">
            {[80, 65, 90, 45, 70].map((v, i) => (
              <motion.div
                key={i}
                animate={{ height: [`${v/3}px`, `${v/2}px`, `${v/3}px`] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 bg-orange-500/50 rounded-sm"
                style={{ height: '4px' }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-black/70 backdrop-blur-xl border border-orange-500/30 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(234,88,12,0.2)]">
          <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 p-4 border-b border-orange-500/20">
            <div className="flex items-center justify-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-8 h-8 text-orange-500" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-white font-mono tracking-wider">ARMED FORCES</h1>
                <p className="text-[10px] text-orange-500/70 font-mono tracking-[0.3em]">INTELLIGENCE SYSTEM</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-orange-500/70 mb-4"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-mono">SECURE CONNECTION ESTABLISHED</span>
              <span className="ml-auto text-xs font-mono text-green-500">ENCRYPTED</span>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="OPERATOR ID"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded px-10 py-3 text-white font-mono text-sm placeholder-gray-600 focus:border-orange-500/50 focus:outline-none transition-colors"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="SECURITY KEY"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded px-10 py-3 text-white font-mono text-sm placeholder-gray-600 focus:border-orange-500/50 focus:outline-none transition-colors"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-3"
              >
                <select
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="bg-gray-900/50 border border-gray-700 rounded px-3 py-3 text-white font-mono text-xs focus:border-orange-500/50 focus:outline-none"
                >
                  {ranks.map(r => (
                    <option key={r} value={r} className="bg-gray-900">{r}</option>
                  ))}
                </select>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="bg-gray-900/50 border border-gray-700 rounded px-3 py-3 text-white font-mono text-xs focus:border-orange-500/50 focus:outline-none"
                >
                  {units.map(u => (
                    <option key={u} value={u} className="bg-gray-900">{u}</option>
                  ))}
                </select>
              </motion.div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded"
                >
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-mono text-red-500">{error}</span>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-mono py-3 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-sm">AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">AUTHORIZE ACCESS</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-4 border-t border-gray-800"
            >
              <div className="flex items-center justify-between text-[10px] text-gray-600 font-mono">
                <span>CLASSIFICATION: RESTRICTED</span>
                <span>v2.4.1</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="text-center mt-4">
          <span className="text-[10px] text-gray-600 font-mono">AUTHORIZED PERSONNEL ONLY • UNAUTHORIZED ACCESS PROHIBITED</span>
        </div>
      </motion.div>
    </div>
  );
}