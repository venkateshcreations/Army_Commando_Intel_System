import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, Maximize2, RefreshCw, Eye, EyeOff, Circle, Clock, MapPin, Radio, Signal, Square } from 'lucide-react';

const mockCameras = [
  { id: 'CAM-01', name: 'North Perimeter', location: 'Sector 1', status: 'active' },
  { id: 'CAM-02', name: 'East Gate', location: 'Sector 2', status: 'active' },
  { id: 'CAM-03', name: 'South Fence', location: 'Sector 3', status: 'active' },
  { id: 'CAM-04', name: 'West Entry', location: 'Sector 4', status: 'maintenance' },
];

export default function SurveillancePanel() {
  const [activeCamera, setActiveCamera] = useState(mockCameras[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let frame = 0;
    const objects = [
      { x: 50, y: 60, vx: 2, vy: 1, color: '#ffaa00', size: 6 },
      { x: 200, y: 100, vx: -1.5, vy: 0.5, color: '#ff66aa', size: 5 },
      { x: 150, y: 140, vx: 1, vy: -0.8, color: '#00ff88', size: 7 },
      { x: 80, y: 180, vx: 0.8, vy: 1.2, color: '#00ccff', size: 4 },
    ];
    
    const drawFrame = () => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(drawFrame);
        return;
      }
      
      ctx.fillStyle = '#0a0f0d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (showGrid) {
        ctx.strokeStyle = '#1a2924';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 30) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 30) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
      }
      
      ctx.fillStyle = '#111916';
      ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      
      if (frame % 60 < 10) {
        ctx.fillStyle = '#ff3344';
        ctx.beginPath();
        ctx.arc(35, 35, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('REC', 48, 38);
      }
      
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      ctx.fillStyle = '#00ff88';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(time, canvas.width - 90, 35);
      
      ctx.strokeStyle = '#00ccff';
      ctx.lineWidth = 1;
      ctx.strokeRect(25, 25, canvas.width - 50, 30);
      ctx.fillStyle = '#00ccff';
      ctx.font = '10px monospace';
      ctx.fillText(`CAM: ${activeCamera.id} | ${activeCamera.name.toUpperCase()}`, 30, 42);
      ctx.fillText(`LOC: ${activeCamera.location.toUpperCase()}`, canvas.width - 120, 42);
      
      objects.forEach(obj => {
        obj.x += obj.vx;
        obj.y += obj.vy;
        if (obj.x < 30 || obj.x > canvas.width - 30) obj.vx *= -1;
        if (obj.y < 60 || obj.y > canvas.height - 20) obj.vy *= -1;
        
        ctx.fillStyle = obj.color;
        ctx.shadowColor = obj.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
        ctx.shadowBlur = 0;
      });
      
      ctx.fillStyle = 'rgba(0, 255, 136, 0.03)';
      for (let i = 0; i < 3; i++) {
        const y = ((frame * 2 + i * 60) % canvas.height);
        ctx.fillRect(0, y, canvas.width, 2);
      }
      
      frame++;
      animationRef.current = requestAnimationFrame(drawFrame);
    };
    
    drawFrame();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeCamera, isPaused, showGrid]);

  return (
    <div className="bg-tactical-card border border-tactical-border rounded-lg h-full flex flex-col">
      <div className="p-2 border-b border-tactical-border flex items-center justify-between">
        <h2 className="text-tactical-primary font-semibold flex items-center gap-2 text-sm">
          <Video className="w-4 h-4" />
          SURVEILLANCE
        </h2>
        <div className="flex items-center gap-2">
          {isRecording && (
            <span className="flex items-center gap-1 text-xs text-tactical-danger">
              <span className="w-2 h-2 bg-tactical-danger rounded-full animate-pulse"></span>
              REC
            </span>
          )}
          <span className="text-xs text-tactical-muted">LIVE</span>
          <div className="w-2 h-2 bg-tactical-primary rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col p-2 space-y-2">
        <div className="relative flex-1 bg-tactical-dark border border-tactical-border rounded overflow-hidden">
          <canvas
            ref={canvasRef}
            width={320}
            height={200}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1 rounded text-xs ${showGrid ? 'bg-tactical-primary text-tactical-dark' : 'bg-tactical-dark/80 text-tactical-muted'}`}
            >
              GRID
            </button>
          </div>
          
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 bg-tactical-dark/80 rounded hover:bg-tactical-border"
            >
              {isPaused ? (
                <Eye className="w-4 h-4 text-tactical-primary" />
              ) : (
                <EyeOff className="w-4 h-4 text-tactical-muted" />
              )}
            </button>
            <button className="p-1.5 bg-tactical-dark/80 rounded hover:bg-tactical-border">
              <Maximize2 className="w-4 h-4 text-tactical-muted" />
            </button>
          </div>
          
          <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-tactical-muted">
              <Signal className="w-3 h-3" />
              {activeCamera.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="bg-tactical-dark border border-tactical-border rounded p-2">
          <div className="flex items-center justify-between mb-2">
            <select
              value={activeCamera.id}
              onChange={(e) => setActiveCamera(mockCameras.find(c => c.id === e.target.value))}
              className="bg-tactical-card border border-tactical-border rounded px-2 py-1 text-xs text-white flex-1"
            >
              {mockCameras.map(cam => (
                <option key={cam.id} value={cam.id}>{cam.name}</option>
              ))}
            </select>
            
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-1.5 rounded ${isRecording ? 'bg-tactical-danger text-white' : 'bg-tactical-border text-tactical-muted'}`}
              >
                <Square className="w-3 h-3" fill={isRecording ? "currentColor" : "none"} />
              </button>
              <button className="p-1.5 bg-tactical-border text-tactical-muted rounded">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1">
            {mockCameras.map(cam => (
              <button
                key={cam.id}
                onClick={() => setActiveCamera(cam)}
                className={`text-[10px] py-1.5 px-1 rounded transition-colors ${
                  activeCamera.id === cam.id
                    ? 'bg-tactical-primary/20 text-tactical-primary border border-tactical-primary'
                    : cam.status === 'maintenance'
                    ? 'bg-tactical-warning/10 text-tactical-warning/50'
                    : 'bg-tactical-card text-tactical-muted hover:text-white border border-transparent'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span>{cam.id}</span>
                  {cam.status === 'active' && <span className="w-1 h-1 bg-tactical-primary rounded-full mt-0.5"></span>}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="bg-tactical-dark border border-tactical-border rounded p-1.5 flex items-center justify-between">
            <span className="text-tactical-muted">Resolution</span>
            <span className="text-white">1920x1080</span>
          </div>
          <div className="bg-tactical-dark border border-tactical-border rounded p-1.5 flex items-center justify-between">
            <span className="text-tactical-muted">FPS</span>
            <span className="text-tactical-primary">30</span>
          </div>
        </div>
      </div>
    </div>
  );
}
