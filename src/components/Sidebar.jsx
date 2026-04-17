import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Map, 
  Radio, 
  Video, 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight,
  Camera,
  MapPin,
  Fingerprint,
  Cloud,
  Bomb,
  Crosshair,
  Shield
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'map', icon: Map, label: 'Tactical Map' },
  { id: 'feed', icon: Radio, label: 'Intel Feed' },
  { id: 'surveillance', icon: Video, label: 'Surveillance' },
  { id: 'video', icon: Camera, label: 'Video Feeds' },
  { id: 'planner', icon: MapPin, label: 'Mission Planner' },
  { id: 'biometrics', icon: Fingerprint, label: 'Biometrics' },
  { id: 'weather', icon: Cloud, label: 'Weather' },
  { id: 'bda', icon: Bomb, label: 'Battle Damage' },
  { id: 'units', icon: Users, label: 'Units' },
  { id: 'comm', icon: MessageSquare, label: 'Comms' },
  { id: 'alerts', icon: AlertTriangle, label: 'Alerts' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ currentPage = 'dashboard', onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: collapsed ? 70 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        minWidth: 70,
        backgroundColor: '#0d1412',
        borderRight: '1px solid #1a2924',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'relative',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #1a2924', background: 'linear-gradient(180deg, rgba(0,255,136,0.03) 0%, transparent 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            style={{ 
              width: 44, 
              height: 44, 
              background: 'linear-gradient(135deg, rgba(239,68,68,0.25) 0%, rgba(239,68,68,0.05) 100%)', 
              borderRadius: 10, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(239,68,68,0.3)',
              boxShadow: '0 0 20px rgba(239,68,68,0.15)'
            }}
          >
            <Crosshair size={26} color="#ef4444" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ color: '#ef4444', fontWeight: 800, fontSize: 15, letterSpacing: '0.5px' }}>ARMY COMMANDO</div>
                <div style={{ color: '#4a6660', fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase' }}>INTELLIGENCE SYSTEM</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          right: -12,
          top: 70,
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: '#1a2924',
          border: '2px solid #00ff88',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 0 10px rgba(0,255,136,0.3)'
        }}
      >
        {collapsed ? (
          <ChevronRight size={14} color="#00ff88" />
        ) : (
          <ChevronLeft size={14} color="#00ff88" />
        )}
      </motion.button>

      <div style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isHovered = hoveredItem === item.id;
          
          return (
            <motion.div
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              whileHover={{ x: 2 }}
            >
              <motion.button
                type="button"
                onClick={() => handleClick(item.id)}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: collapsed ? '14px 18px' : '14px',
                  borderRadius: 10,
                  backgroundColor: isActive 
                    ? 'linear-gradient(90deg, rgba(0,255,136,0.15) 0%, rgba(0,255,136,0.05) 100%)' 
                    : isHovered 
                      ? 'rgba(0,255,136,0.05)' 
                      : 'transparent',
                  color: isActive ? '#00ff88' : '#5a7670',
                  border: 'none',
                  borderLeft: isActive ? '3px solid #00ff88' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '6px',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isHovered && !isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      backgroundColor: '#00ff88',
                      borderRadius: '0 4px 4px 0'
                    }}
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon 
                    size={21} 
                    color={isActive ? '#00ff88' : isHovered ? '#7a9690' : '#5a7670'}
                    style={{
                      transition: 'color 0.2s ease'
                    }}
                  />
                </motion.div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      style={{ 
                        fontSize: 14, 
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#00ff88' : isHovered ? '#7a9690' : '#5a7670',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #1a2924' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '10px',
          borderRadius: 8,
          backgroundColor: 'rgba(239,68,68,0.05)',
          border: '1px solid rgba(239,68,68,0.1)'
        }}>
          <div style={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            backgroundColor: '#ef4444',
            boxShadow: '0 0 10px #ef4444'
          }} />
          {!collapsed && (
            <span style={{ fontSize: 11, color: '#ef4444', letterSpacing: '0.5px' }}>SYSTEM ACTIVE</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
