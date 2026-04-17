import { useState, useEffect, useRef } from 'react';
import { Video, Maximize2, RefreshCw, Eye, EyeOff, Square, Clock, MapPin, Radio, Signal, AlertTriangle, Shield, Brain, AlertCircle, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockCameras = [
  { id: 'CAM-01', name: 'North Perimeter', location: 'Sector 1', status: 'active' },
  { id: 'CAM-02', name: 'East Gate', location: 'Sector 2', status: 'active' },
  { id: 'CAM-03', name: 'South Fence', location: 'Sector 3', status: 'active' },
  { id: 'CAM-04', name: 'West Entry', location: 'Sector 4', status: 'maintenance' },
];

function createNoisePattern(width, height) {
  const pattern = [];
  for (let i = 0; i < width * height; i += 4) {
    if (Math.random() > 0.97) pattern.push(i);
  }
  return pattern;
}

const threats = [
  { id: 1, type: 'person-armed', confidence: 94, bbox: { x: 80, y: 120, w: 24, h: 48 }, time: '14:32:15', status: 'active' },
  { id: 2, type: 'vehicle', confidence: 87, bbox: { x: 350, y: 200, w: 60, h: 30 }, time: '14:32:18', status: 'tracking' },
  { id: 3, type: 'person', confidence: 78, bbox: { x: 200, y: 300, w: 20, h: 45 }, time: '14:32:22', status: 'confirmed' },
];

export default function SurveillancePage() {
  const [camera, setCamera] = useState(mockCameras[0]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [grid, setGrid] = useState(true);
  const [motionDetected, setMotionDetected] = useState(false);
  const [aiDetection, setAiDetection] = useState(true);
  const [detectedThreats, setDetectedThreats] = useState(threats);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const noiseRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let noiseFrame = 0;
    
    const objs = [
      { x: 80, y: 120, vx: 1.8, vy: 0.7, color: '#ffaa00', size: 8, type: 'person' },
      { x: 350, y: 200, vx: -1.2, vy: 0.4, color: '#ff66aa', size: 7, type: 'person' },
      { x: 200, y: 300, vx: 0.8, vy: -0.6, color: '#00ff88', size: 9, type: 'person' },
      { x: 500, y: 150, vx: -0.5, vy: 1.2, color: '#00ccff', size: 6, type: 'vehicle' },
      { x: 150, y: 380, vx: 1.5, vy: -0.3, color: '#ff3344', size: 10, type: 'person' },
    ];

    const drawPerson = (ctx, x, y, size, color) => {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y - size * 0.3, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x - size * 0.3, y - size * 0.1, size * 0.6, size * 0.8);
      ctx.shadowBlur = 0;
    };

    const drawVehicle = (ctx, x, y, size, color) => {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.fillRect(x - size, y - size * 0.4, size * 2.5, size * 0.8);
      ctx.fillRect(x - size * 0.5, y - size * 0.8, size * 1.5, size * 0.5);
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      if (paused) { frameRef.current = requestAnimationFrame(draw); return; }
      
      ctx.fillStyle = '#0a0f0d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width * 0.7);
      gradient.addColorStop(0, '#0f1412');
      gradient.addColorStop(1, '#0a0f0d');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (grid) {
        ctx.strokeStyle = 'rgba(26, 41, 36, 0.6)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 80) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 80) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
        
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        for (let i = 0; i <= canvas.width; i += 240) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i <= canvas.height; i += 240) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
      
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
      
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      
      if (frame % 60 < 15) {
        ctx.fillStyle = '#ff3344';
        ctx.shadowColor = '#ff3344';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(35, 35, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('REC', 52, 40);
      }
      
      const scanLine = (frame % 200) / 200;
      ctx.fillStyle = `rgba(0, 255, 136, ${0.03 + Math.random() * 0.02})`;
      ctx.fillRect(0, scanLine * canvas.height, canvas.width, 3);
      
      if (noiseFrame % 3 === 0) {
        noiseRef.current = createNoisePattern(canvas.width, canvas.height);
      }
      noiseFrame++;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      noiseRef.current.forEach(idx => {
        const x = idx % canvas.width;
        const y = Math.floor(idx / canvas.width);
        ctx.fillRect(x, y, 2, 2);
      });
      
      ctx.fillStyle = '#00ff88';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(new Date().toLocaleTimeString('en-US', { hour12: false }), canvas.width - 110, 38);
      
      ctx.strokeStyle = '#00ccff';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, canvas.width - 40, 35);
      ctx.fillStyle = '#00ccff';
      ctx.font = '11px monospace';
      ctx.fillText(`CAM: ${camera.id}`, 28, 38);
      ctx.fillText(`| ${camera.name.toUpperCase()}`, 100, 38);
      ctx.fillText(`LOC: ${camera.location.toUpperCase()}`, canvas.width - 130, 38);
      
      ctx.strokeStyle = 'rgba(0, 204, 255, 0.2)';
      ctx.strokeRect(canvas.width - 180, 20, 160, 35);
      
      let hasMotion = false;
      objs.forEach(obj => {
        obj.x += obj.vx;
        obj.y += obj.vy;
        
        const padding = 40;
        if (obj.x < padding || obj.x > canvas.width - padding) {
          obj.vx *= -1;
          obj.x = Math.max(padding, Math.min(canvas.width - padding, obj.x));
        }
        if (obj.y < 70 || obj.y > canvas.height - 30) {
          obj.vy *= -1;
          obj.y = Math.max(70, Math.min(canvas.height - 30, obj.y));
        }
        
        if (Math.random() > 0.7) hasMotion = true;
        
        if (obj.type === 'person') {
          drawPerson(ctx, obj.x, obj.y, obj.size, obj.color);
        } else {
          drawVehicle(ctx, obj.x, obj.y, obj.size, obj.color);
        }
        
        const trailLength = 8;
        ctx.strokeStyle = obj.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(obj.x - obj.vx * trailLength, obj.y - obj.vy * trailLength);
        ctx.lineTo(obj.x, obj.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
      
      setMotionDetected(hasMotion);
      
      if (aiDetection && hasMotion && frame % 60 === 0) {
        setDetectedThreats(prev => {
          const newThreat = {
            id: Date.now(),
            type: Math.random() > 0.5 ? 'person-armed' : 'person',
            confidence: Math.floor(70 + Math.random() * 28),
            bbox: { x: Math.random() * 600 + 50, y: Math.random() * 300 + 80, w: 20 + Math.random() * 40, h: 40 + Math.random() * 30 },
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
            status: 'detected'
          };
          return [...prev.slice(-5), newThreat];
        });
      }
      
      if (frame % 30 === 0) {
        ctx.fillStyle = 'rgba(0, 255, 136, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const x = 50 + i * 200;
        const y = canvas.height - 50;
        ctx.strokeRect(x, y, 80, 20);
      }
      
      ctx.fillStyle = '#1a2924';
      ctx.fillRect(0, canvas.height - 25, canvas.width, 25);
      ctx.fillStyle = '#4a6660';
      ctx.font = '10px monospace';
      ctx.fillText('SIGNAL: ████████ 80% | TEMP: 32°C | ZOOM: 1.0x', 20, canvas.height - 8);
      
      frame++;
      frameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [camera, paused, grid]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#1a2924] flex items-center justify-between" style={{ backgroundColor: '#0a0f0d' }}>
        <div className="flex items-center gap-2">
          {recording && <span className="flex items-center gap-1 text-xs text-[#ff3344]"><span className="w-2 h-2 bg-[#ff3344] rounded-full animate-pulse"></span> REC</span>}
          <span className="text-xs text-[#4a6660]">LIVE</span>
          <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="relative flex-1 bg-[#111916] border border-[#1a2924] rounded overflow-hidden">
          <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
          
          <div className="absolute top-2 left-2 flex gap-1">
            <button onClick={() => setGrid(!grid)} className={`px-2 py-1 rounded text-xs ${grid ? 'bg-[#00ff88] text-[#0a0f0d]' : 'bg-[#111916] text-[#4a6660]'}`}>GRID</button>
          </div>
          
          <div className="absolute top-2 right-2 flex gap-1">
            <button onClick={() => setPaused(!paused)} className="p-1.5 bg-[#111916] rounded">{paused ? <Eye className="w-4 h-4 text-[#00ff88]" /> : <EyeOff className="w-4 h-4 text-[#4a6660]" />}</button>
            <button className="p-1.5 bg-[#111916] rounded"><Maximize2 className="w-4 h-4 text-[#4a6660]" /></button>
          </div>
          
          {motionDetected && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-[#ffaa00]/20 rounded">
              <AlertTriangle className="w-3 h-3 text-[#ffaa00]" />
              <span className="text-[10px] text-[#ffaa00]">MOTION DETECTED</span>
            </div>
          )}
        </div>
        
        <div className="bg-[#111916] border border-[#1a2924] rounded p-3">
          <div className="flex items-center justify-between mb-3">
            <select value={camera.id} onChange={e => setCamera(mockCameras.find(c => c.id === e.target.value))} className="bg-[#0a0f0d] border border-[#1a2924] rounded px-3 py-2 text-sm text-white">
              {mockCameras.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setRecording(!recording)} className={`p-2 rounded ${recording ? 'bg-[#ff3344] text-white' : 'bg-[#1a2924] text-[#4a6660]'}`}><Square className="w-4 h-4" fill={recording ? "currentColor" : "none"} /></button>
              <button className="p-2 bg-[#1a2924] text-[#4a6660] rounded"><RefreshCw className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mockCameras.map(c => (
              <button key={c.id} onClick={() => setCamera(c)} className={`py-2 px-1 rounded text-xs ${camera.id === c.id ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]' : c.status === 'maintenance' ? 'bg-[#ffaa00]/10 text-[#ffaa00]/50' : 'bg-[#0a0f0d] text-[#4a6660]'}`}>{c.id}</button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-[#111916] border border-[#1a2924] rounded p-2 flex justify-between"><span className="text-[#4a6660]">Resolution</span><span className="text-white">1920x1080</span></div>
          <div className="bg-[#111916] border border-[#1a2924] rounded p-2 flex justify-between"><span className="text-[#4a6660]">FPS</span><span className="text-[#00ff88]">30</span></div>
          <div className="bg-[#111916] border border-[#1a2924] rounded p-2 flex justify-between"><span className="text-[#4a6660]">Quality</span><span className="text-[#00ccff]">HIGH</span></div>
        </div>
        
        <div className="bg-[#111916] border border-[#1a2924] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#a855f7]" />
              <span className="text-sm font-mono text-white">AI THREAT DETECTION</span>
              <button
                onClick={() => setAiDetection(!aiDetection)}
                className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                  aiDetection ? 'bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]' : 'bg-[#1a2924] text-[#4a6660]'
                }`}
              >
                {aiDetection ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
            <span className="text-xs font-mono text-[#4a6660]">{detectedThreats.length} THREATS DETECTED</span>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <AnimatePresence>
              {detectedThreats.map(threat => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedThreat(threat.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedThreat === threat.id
                      ? 'bg-red-500/10 border-red-500'
                      : threat.type === 'person-armed'
                        ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
                        : 'bg-[#0a0f0d] border-[#1a2924] hover:border-[#4a6660]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crosshair className={`w-4 h-4 ${threat.type === 'person-armed' ? 'text-red-500' : 'text-yellow-500'}`} />
                      <span className="text-xs font-mono text-white uppercase">{threat.type.replace('-', ' ')}</span>
                      <span className="text-xs font-mono text-gray-500">{threat.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-1.5 bg-[#1a2924] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${threat.confidence > 90 ? 'bg-red-500' : threat.confidence > 75 ? 'bg-yellow-500' : 'bg-gray-500'}`}
                            style={{ width: `${threat.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-gray-400">{threat.confidence}%</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        threat.status === 'active' ? 'bg-red-500/20 text-red-500' :
                        threat.status === 'tracking' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {threat.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
