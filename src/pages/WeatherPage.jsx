import { useState, useEffect } from 'react';
import { Cloud, Wind, Thermometer, Sun, Moon, CloudRain, Eye, Crosshair, Clock, Sunset, Sunrise, Gauge, Compass, CloudLightning, CloudFog, CloudSnow, CloudSun, Zap, Siren } from 'lucide-react';
import { motion } from 'framer-motion';

const weatherTypes = {
  clear: { name: 'CLEAR', icon: Sun, color: '#fbbf24', bg: 'from-amber-500/20 to-yellow-500/10' },
  cloudy: { name: 'CLOUDY', icon: Cloud, color: '#9ca3af', bg: 'from-gray-500/20 to-slate-500/10' },
  fog: { name: 'FOG', icon: CloudFog, color: '#94a3b8', bg: 'from-slate-400/20 to-gray-400/10' },
  rain: { name: 'RAIN', icon: CloudRain, color: '#3b82f6', bg: 'from-blue-500/20 to-cyan-500/10' },
  storm: { name: 'STORM', icon: CloudLightning, color: '#a855f7', bg: 'from-purple-500/20 to-violet-500/10' },
  snow: { name: 'SNOW', icon: CloudSnow, color: '#e2e8f0', bg: 'from-slate-200/20 to-blue-100/10' },
  night: { name: 'NIGHT', icon: Moon, color: '#6366f1', bg: 'from-indigo-500/20 to-purple-500/10' },
};

const sectors = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO'];

function WeatherEffect({ type }) {
  const particles = [...Array(20)].map((_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 1 + Math.random() * 2,
    left: Math.random() * 100,
  }));

  if (type === 'rain') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute w-0.5 h-6 bg-blue-400 rounded-full opacity-60"
            style={{ left: `${p.left}%` }}
            animate={{ y: [0, 400], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: 'linear' }}
          />
        ))}
      </div>
    );
  }

  if (type === 'storm') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.slice(10).map(p => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-8 bg-purple-400 rounded-full opacity-80"
            style={{ left: `${p.left}%` }}
            animate={{ y: [0, 400], opacity: [0.8, 0] }}
            transition={{ repeat: Infinity, duration: p.duration * 0.5, delay: p.delay, ease: 'linear' }}
          />
        ))}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-purple-300 opacity-30"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 0.15, delay: 2 }}
        />
      </div>
    );
  }

  if (type === 'fog') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-20 w-full bg-gray-300/30 rounded-full blur-xl"
            style={{ top: `${20 + i * 15}%` }}
            animate={{ x: ['-20%', '120%'] }}
            transition={{ repeat: Infinity, duration: 8 + i * 2, delay: i * 1.5, ease: 'linear' }}
          />
        ))}
      </div>
    );
  }

  if (type === 'snow') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 bg-white rounded-full opacity-80"
            style={{ left: `${p.left}%` }}
            animate={{ 
              y: [0, 400],
              x: [0, Math.sin(p.id) * 30],
            }}
            transition={{ repeat: Infinity, duration: p.duration * 3, delay: p.delay, ease: 'linear' }}
          />
        ))}
      </div>
    );
  }

  if (type === 'clear') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{ 
              left: `${10 + i * 12}%`, 
              top: `${15 + (i % 3) * 10}%`,
              boxShadow: '0 0 10px 2px rgba(251, 191, 36, 0.5)',
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.5, delay: i * 0.3 }}
          />
        ))}
      </div>
    );
  }

  return null;
}

function LightningFlash({ active }) {
  if (!active) return null;
  return (
    <motion.div
      className="absolute inset-0 bg-purple-500/30"
      animate={{ opacity: [0, 0.8, 0, 0.9, 0] }}
      transition={{ duration: 0.3 }}
    />
  );
}

export default function WeatherPage() {
  const [selectedSector, setSelectedSector] = useState('ALPHA');
  const [weatherType, setWeatherType] = useState('clear');
  const [lightningActive, setLightningActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (weatherType === 'storm') {
      const interval = setInterval(() => {
        setLightningActive(true);
        setTimeout(() => setLightningActive(false), 300);
      }, 3000 + Math.random() * 4000);
      return () => clearInterval(interval);
    }
  }, [weatherType]);

  const current = {
    temp: Math.floor(20 + Math.random() * 15),
    feelsLike: Math.floor(18 + Math.random() * 18),
    humidity: Math.floor(40 + Math.random() * 40),
    windSpeed: Math.floor(5 + Math.random() * 25),
    windDirection: Math.floor(Math.random() * 360),
    visibility: Math.floor(2 + Math.random() * 10),
    pressure: Math.floor(1005 + Math.random() * 20),
    uv: Math.floor(1 + Math.random() * 11),
    moonPhase: 'Waxing Gibbous',
    moonIllumination: 75,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherType(prev => {
        const types = Object.keys(weatherTypes);
        const randomIdx = Math.floor(Math.random() * types.length);
        return types[randomIdx];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const hourlyForecast = [
    { hour: '14:00', temp: current.temp, wind: current.windSpeed, conditions: weatherTypes[weatherType].name },
    { hour: '15:00', temp: current.temp - 1, wind: current.windSpeed + 2, conditions: 'CLOUDY' },
    { hour: '16:00', temp: current.temp - 2, wind: current.windSpeed + 3, conditions: 'CLOUDY' },
    { hour: '17:00', temp: current.temp - 3, wind: current.windSpeed + 5, conditions: 'FOG' },
    { hour: '18:00', temp: current.temp - 5, wind: current.windSpeed + 8, conditions: 'RAIN' },
    { hour: '19:00', temp: current.temp - 7, wind: current.windSpeed + 10, conditions: 'STORM' },
    { hour: '20:00', temp: current.temp - 8, wind: current.windSpeed + 12, conditions: 'STORM' },
    { hour: '21:00', temp: current.temp - 6, wind: current.windSpeed + 8, conditions: 'RAIN' },
  ];

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const getVisibilityRating = (km) => {
    if (km >= 8) return { label: 'EXCELLENT', color: '#22c55e' };
    if (km >= 5) return { label: 'GOOD', color: '#22c55e' };
    if (km >= 3) return { label: 'MODERATE', color: '#f97316' };
    return { label: 'POOR', color: '#ef4444' };
  };

  const visibilityRating = getVisibilityRating(current.visibility);
  const weatherInfo = weatherTypes[weatherType];
  const WeatherIcon = weatherInfo.icon;

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${weatherInfo.bg}`}>
            <WeatherIcon className="w-5 h-5" style={{ color: weatherInfo.color }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono">WEATHER INTEL</h1>
            <p className="text-xs text-gray-500 font-mono">ENVIRONMENTAL CONDITIONS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sectors.map(sector => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                selectedSector === sector
                  ? 'bg-sky-500/20 border border-sky-500 text-sky-500'
                  : 'bg-black/40 border border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 flex flex-col gap-4">
          <div className={`relative flex-1 rounded-xl border border-gray-800 overflow-hidden bg-gradient-to-br ${weatherInfo.bg}`}>
            <WeatherEffect type={weatherType} />
            <LightningFlash active={lightningActive} />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                key={weatherType}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                  <WeatherIcon className="w-24 h-24 mx-auto" style={{ color: weatherInfo.color }} />
                </motion.div>
                <motion.div 
                  className="text-6xl font-bold text-white font-mono mt-4"
                  key={current.temp}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  {current.temp}°
                </motion.div>
                <div className="text-xl font-mono mt-2" style={{ color: weatherInfo.color }}>
                  {weatherInfo.name}
                </div>
                <div className="text-sm text-gray-400 font-mono mt-1">
                  FEELS LIKE {current.feelsLike}°C
                </div>
              </motion.div>
            </div>

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="px-3 py-2 bg-black/50 backdrop-blur rounded-lg border border-gray-700">
                <span className="text-sm font-mono text-white">{selectedSector} SECTOR</span>
              </div>
              <div className="px-3 py-2 bg-black/50 backdrop-blur rounded-lg border border-gray-700">
                <span className="text-sm font-mono text-white">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2">
              <div className="p-2 bg-black/50 backdrop-blur rounded-lg border border-gray-700 text-center">
                <Wind className="w-4 h-4 mx-auto text-sky-400" />
                <div className="text-sm font-mono text-white">{current.windSpeed} km/h</div>
                <div className="text-[10px] text-gray-500">{getWindDirection(current.windDirection)}</div>
              </div>
              <div className="p-2 bg-black/50 backdrop-blur rounded-lg border border-gray-700 text-center">
                <CloudRain className="w-4 h-4 mx-auto text-blue-400" />
                <div className="text-sm font-mono text-white">{current.humidity}%</div>
                <div className="text-[10px] text-gray-500">HUMIDITY</div>
              </div>
              <div className="p-2 bg-black/50 backdrop-blur rounded-lg border border-gray-700 text-center">
                <Eye className="w-4 h-4 mx-auto text-green-400" />
                <div className="text-sm font-mono text-white">{current.visibility} km</div>
                <div className="text-[10px] text-gray-500" style={{ color: visibilityRating.color }}>{visibilityRating.label}</div>
              </div>
              <div className="p-2 bg-black/50 backdrop-blur rounded-lg border border-gray-700 text-center">
                <Gauge className="w-4 h-4 mx-auto text-purple-400" />
                <div className="text-sm font-mono text-white">{current.pressure}</div>
                <div className="text-[10px] text-gray-500">hPa</div>
              </div>
            </div>
          </div>

          <div className="bg-black/40 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-mono text-white">24-HOUR FORECAST</span>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Sunrise className="w-3 h-3 text-amber-400" />
                  <span>06:30</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sunset className="w-3 h-3 text-orange-400" />
                  <span>18:45</span>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between gap-1 h-36">
              {hourlyForecast.map((hour, idx) => {
                const heightPct = Math.max(20, Math.min(100, ((hour.temp + 5) / 40) * 100));
                const color = weatherTypes[hour.conditions.toLowerCase()]?.color || '#6b7280';
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full">
                    <div className="text-[10px] font-mono text-white">{hour.temp}°</div>
                    <div 
                      className="w-full rounded-t"
                      style={{ 
                        height: `${heightPct}%`, 
                        backgroundColor: color,
                        opacity: 0.8,
                        minHeight: 4
                      }}
                    />
                    <div className="text-[10px] font-mono text-gray-500">{hour.hour}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {Object.entries(weatherTypes).map(([key, info]) => (
                <div key={key} className="flex items-center gap-1 text-[10px]">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                  <span className="text-gray-500 font-mono">{info.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-72 flex flex-col gap-4">
          <div className="bg-black/40 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-500" />
                <span className="text-sm font-mono text-white">WIND COMPASS</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-red-500 animate-pulse" />
                <span className="text-xs font-mono text-red-500">{current.windDirection}°</span>
              </div>
            </div>
            <div className="relative w-36 h-36 mx-auto rounded-full bg-gray-900 border-2 border-gray-700">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-2 bg-gray-600"
                  style={{
                    left: 'calc(50% - 2px)',
                    top: 4,
                    transform: `rotate(${i * 30}deg)`,
                    transformOrigin: 'center 64px',
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute top-3 text-xs font-bold text-red-500">N</div>
                <div className="absolute bottom-3 text-xs font-bold text-gray-500">S</div>
                <div className="absolute right-3 text-xs font-bold text-gray-500">E</div>
                <div className="absolute left-3 text-xs font-bold text-gray-500">W</div>
              </div>
              <motion.div
                className="absolute left-1/2 top-1/2 w-1 h-14 -mt-14 bg-gradient-to-t from-red-600 to-red-400 rounded-full"
                style={{
                  transformOrigin: 'center 100%',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
                }}
                animate={{ 
                  rotate: [current.windDirection - 10, current.windDirection + 10, current.windDirection - 5, current.windDirection + 3, current.windDirection],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: 'easeInOut',
                }}
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-800 border-2 border-red-500 shadow-lg shadow-red-500/50 z-10" />
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs text-gray-400 font-mono">Direction: {getWindDirection(current.windDirection)} @ {current.windDirection}°</span>
            </div>
          </div>

          <div className="bg-black/40 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-mono text-white">MOON PHASE</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="relative w-16 h-16 rounded-full bg-gray-800 overflow-hidden">
                <div className="absolute inset-0 bg-gray-900" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }} />
                <div className="absolute inset-0 bg-yellow-500" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)', opacity: 0.75 }} />
              </div>
              <div>
                <div className="text-sm font-mono text-white">{current.moonPhase}</div>
                <div className="text-xs text-gray-500 font-mono">{current.moonIllumination}% illuminated</div>
              </div>
            </div>
          </div>

          <div className="bg-black/40 rounded-lg border border-gray-800 p-4">
            <div className="text-xs font-mono text-gray-500 mb-3">IMPACT ASSESSMENT</div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400 font-mono">SNIPER OPS</span>
                  <span className="text-green-500 font-mono">OPTIMAL</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400 font-mono">AERIAL OPS</span>
                  <span className={weatherType === 'storm' ? 'text-red-500 font-mono' : 'text-green-500 font-mono'}>
                    {weatherType === 'storm' ? 'HAZARDOUS' : 'OPTIMAL'}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: weatherType === 'storm' ? '#ef4444' : '#22c55e' }}
                    animate={{ width: weatherType === 'storm' ? '30%' : '90%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400 font-mono">GROUND OPS</span>
                  <span className="text-green-500 font-mono">OPTIMAL</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400 font-mono">DRONE FLIGHT</span>
                  <span className={weatherType === 'storm' || weatherType === 'rain' ? 'text-yellow-500 font-mono' : 'text-green-500 font-mono'}>
                    {weatherType === 'storm' ? 'DANGEROUS' : weatherType === 'rain' ? 'CAUTION' : 'OPTIMAL'}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: weatherType === 'storm' ? '#ef4444' : weatherType === 'rain' ? '#f97316' : '#22c55e',
                      width: weatherType === 'storm' ? '20%' : weatherType === 'rain' ? '50%' : '85%'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}