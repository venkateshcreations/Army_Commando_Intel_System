import { useState, useRef, useEffect } from 'react';
import { Video, Eye, Thermometer, Sun, Camera, Circle, Square, Maximize2, Minimize2, Radio, Signal, Play, Pause, Volume2, VolumeX, Rewind, FastForward, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const feeds = [
  { id: 1, name: 'UAV-ALPHA', location: 'Sector 7', status: 'active', coords: [34.0522, -118.2437], videoUrl: 'https://assets.mixkit.co/videos/3223/3223-720.mp4' },
  { id: 2, name: 'UAV-BRAVO', location: 'Sector 12', status: 'active', coords: [34.0622, -118.2537], videoUrl: 'https://assets.mixkit.co/videos/42358/42358-720.mp4' },
  { id: 3, name: 'UAV-CHARLIE', location: 'Sector 4', status: 'standby', coords: [34.0422, -118.2337], videoUrl: 'https://assets.mixkit.co/videos/49796/49796-720.mp4' },
  { id: 4, name: 'DRONE-DELTA', location: 'Sector 9', status: 'active', coords: [34.0572, -118.2487], videoUrl: 'https://assets.mixkit.co/videos/30487/30487-720.mp4' },
];

const modes = [
  { id: 'day', label: 'DAY', icon: Sun, color: '#22c55e' },
  { id: 'night', label: 'NIGHT', icon: Eye, color: '#a855f7' },
  { id: 'ir', label: 'IR', icon: Thermometer, color: '#ef4444' },
  { id: 'thermal', label: 'THERMAL', icon: Video, color: '#f97316' },
];

export default function VideoFeedPage() {
  const [activeFeed, setActiveFeed] = useState(feeds[0]);
  const [activeMode, setActiveMode] = useState('thermal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [recording, setRecording] = useState(false);
  const [signalStrength, setSignalStrength] = useState(92);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [glitchActive, setGlitchActive] = useState(true);
  const [staticActive, setStaticActive] = useState(false);
  const [signalLoss, setSignalLoss] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (glitchActive && videoRef.current) {
      const interval = setInterval(() => {
        const shouldGlitch = Math.random() > 0.7;
        setStaticActive(shouldGlitch);
        if (shouldGlitch) {
          setTimeout(() => setStaticActive(false), 50 + Math.random() * 150);
        }
      }, 500 + Math.random() * 2000);
      return () => clearInterval(interval);
    }
  }, [glitchActive]);

  useEffect(() => {
    if (signalStrength < 60 && Math.random() > 0.5) {
      setSignalLoss(true);
      setTimeout(() => setSignalLoss(false), 100 + Math.random() * 300);
    }
  }, [signalStrength]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeFeed]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (activeMode === 'night') {
      document.body.style.filter = 'grayscale(100%) brightness(0.6) hue-rotate(240deg)';
    } else if (activeMode === 'ir') {
      document.body.style.filter = 'invert(1) hue-rotate(180deg) contrast(1.2)';
    } else if (activeMode === 'thermal') {
      document.body.style.filter = 'sepia(1) saturate(3) hue-rotate(-30deg) contrast(1.2)';
    } else {
      document.body.style.filter = 'none';
    }
    return () => { document.body.style.filter = 'none'; };
  }, [activeMode]);

  const currentMode = modes.find(m => m.id === activeMode);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Video className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono">VIDEO FEEDS</h1>
            <p className="text-xs text-gray-500 font-mono">UAV/AERIAL SURVEILLANCE</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-emerald-500/30">
            <Signal className={`w-4 h-4 ${signalStrength > 80 ? 'text-emerald-500' : signalStrength > 50 ? 'text-yellow-500' : 'text-red-500'}`} />
            <span className="text-sm text-gray-400 font-mono">{signalStrength}%</span>
          </div>
          <button
            onClick={() => setRecording(!recording)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono text-sm transition-all ${
              recording 
                ? 'bg-red-500/20 text-red-500 border border-red-500 animate-pulse' 
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-red-500/50'
            }`}
          >
            <Circle className={`w-3 h-3 ${recording ? 'fill-red-500' : ''}`} />
            {recording ? 'REC' : 'REC'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-64 flex flex-col gap-2 overflow-y-auto pr-2">
          <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Active Feeds</h3>
          {feeds.map(feed => (
            <motion.button
              key={feed.id}
              onClick={() => setActiveFeed(feed)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg border text-left transition-all ${
                activeFeed.id === feed.id
                  ? 'bg-emerald-500/10 border-emerald-500'
                  : 'bg-black/40 border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-mono text-white">{feed.name}</span>
                <span className={`w-2 h-2 rounded-full ${feed.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`} />
              </div>
              <div className="text-xs text-gray-500 font-mono">{feed.location}</div>
            </motion.button>
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 relative bg-black rounded-lg border border-gray-800 overflow-hidden">
            <video
              ref={videoRef}
              key={activeFeed.id}
              className={`absolute inset-0 w-full h-full object-cover ${staticActive ? 'opacity-50' : ''} ${signalLoss ? 'opacity-0' : ''}`}
              src={activeFeed.videoUrl}
              autoPlay
              loop
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              playsInline
            />
            
            {staticActive && (
              <div className="absolute inset-0 z-20">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-2 bg-white/80 w-full"
                    style={{ top: `${20 + i * 15}%` }}
                    animate={{ x: [-100, 100, -50] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                  />
                ))}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`rgb-${i}`}
                    className="absolute inset-0"
                    style={{ mixBlendMode: 'difference' }}
                    animate={{ opacity: [0, 1, 0], x: [Math.random() * 20 - 10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.05 + i * 0.02 }}
                  />
                ))}
              </div>
            )}

            {signalLoss && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-2">
                  <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
                  <span className="text-red-500 font-mono text-lg">SIGNAL LOST</span>
                </div>
              </div>
            )}

            {!signalLoss && (
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(34, 197, 94, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: showGrid ? 1 : 0
              }} />
            )}
            
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <div className="px-3 py-1.5 bg-black/70 backdrop-blur rounded border border-gray-700">
                <span className="text-sm font-mono text-emerald-500">{activeFeed.name}</span>
              </div>
              <div className="px-3 py-1.5 bg-black/70 backdrop-blur rounded border border-gray-700">
                <span className="text-xs font-mono text-gray-400">LAT: {activeFeed.coords[0].toFixed(4)}</span>
                <span className="text-xs font-mono text-gray-400 ml-3">LON: {activeFeed.coords[1].toFixed(4)}</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-10">
              <div 
                className="px-4 py-2 rounded-lg font-mono text-lg font-bold border"
                style={{ backgroundColor: `${currentMode.color}20`, borderColor: currentMode.color, color: currentMode.color }}
              >
                {currentMode.label}
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex gap-2">
                <button
                  onClick={() => setGlitchActive(!glitchActive)}
                  className={`p-2 rounded border transition-all ${glitchActive ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-black/70 border-gray-700 text-gray-400'}`}
                >
                  <Zap className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded border transition-all ${isPlaying ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-black/70 border-gray-700 text-gray-400'}`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded border transition-all ${!isMuted ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-black/70 border-gray-700 text-gray-400'}`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded border transition-all ${showGrid ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-black/70 border-gray-700 text-gray-400'}`}
                >
                  <Square className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded border bg-black/70 border-gray-700 text-gray-400 hover:text-white transition-all"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
              <div className="h-1 flex-1 mx-4 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : `${signalStrength}%` }}
                />
              </div>
              <div className="px-3 py-1.5 bg-black/70 backdrop-blur rounded border border-gray-700">
                <span className="text-xs font-mono text-gray-400">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
            </div>

            <div className="absolute bottom-20 left-4 right-4">
              <div className="flex items-center justify-center gap-1">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-500">LIVE</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {modes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                  activeMode === mode.id
                    ? 'bg-black/80 border-2'
                    : 'bg-black/40 border-gray-800 hover:border-gray-600'
                }`}
                style={{ 
                  borderColor: activeMode === mode.id ? mode.color : undefined,
                  boxShadow: activeMode === mode.id ? `0 0 20px ${mode.color}30` : undefined
                }}
              >
                <mode.icon className="w-4 h-4" style={{ color: mode.color }} />
                <span className="text-sm font-mono" style={{ color: activeMode === mode.id ? mode.color : '#9ca3af' }}>
                  {mode.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}