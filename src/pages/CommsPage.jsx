import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Hash, Lock, Volume2, VolumeX, Users, Mic, MicOff, Radio, Wifi, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const channels = [
  { id: 'general', name: 'General', type: 'public', unread: 3 },
  { id: 'tactical', name: 'Tactical Ops', type: 'public', unread: 0 },
  { id: 'alpha', name: 'Alpha Team', type: 'private', unread: 1 },
  { id: 'bravo', name: 'Bravo Team', type: 'private', unread: 0 },
];

const messages = [
  { id: 1, channel: 'tactical', user: 'Commander', message: 'All teams maintain position and await further orders', time: Date.now() - 60000 },
  { id: 2, channel: 'tactical', user: 'Alpha-1', message: 'Visual confirmed on target, holding position', time: Date.now() - 45000 },
  { id: 3, channel: 'general', user: 'Bravo-2', message: 'Supply drop received at waypoint Alpha-7', time: Date.now() - 30000 },
  { id: 4, channel: 'tactical', user: 'Delta-1', message: 'Perimeter secure, all clear', time: Date.now() - 15000 },
  { id: 5, channel: 'tactical', user: 'Echo-MED', message: 'Medical team ready for extraction', time: Date.now() - 10000 },
];

const onlineUsers = [
  { id: 1, name: 'Commander', status: 'online' },
  { id: 2, name: 'Alpha-1', status: 'online' },
  { id: 3, name: 'Bravo-2', status: 'away' },
  { id: 4, name: 'Delta-1', status: 'online' },
  { id: 5, name: 'Echo-MED', status: 'online' },
];

export default function CommsPage() {
  const [activeChannel, setActiveChannel] = useState(channels[1]);
  const [msgs, setMsgs] = useState(messages);
  const [newMsg, setNewMsg] = useState('');
  const [muted, setMuted] = useState(false);
  const [pttActive, setPttActive] = useState(false);
  const [transmitting, setTransmitting] = useState(false);
  const [signalStrength] = useState(87);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = () => {
    if (!newMsg.trim()) return;
    setMsgs([...msgs, { id: Date.now(), channel: activeChannel.id, user: 'You', message: newMsg, time: Date.now() }]);
    setNewMsg('');
  };

  const channelMsgs = msgs.filter(m => m.channel === activeChannel.id);
  const online = onlineUsers.filter(u => u.status === 'online').length;

  const getColor = (type) => {
    if (type === 'command') return '#ff3344';
    if (type === 'response') return '#00ff88';
    if (type === 'info') return '#00ccff';
    if (type === 'system') return '#ffaa00';
    return '#fff';
  };

  useEffect(() => {
    let interval;
    if (pttActive) {
      setTransmitting(true);
      interval = setInterval(() => setTransmitting(prev => !prev), 100);
    } else {
      setTransmitting(false);
    }
    return () => clearInterval(interval);
  }, [pttActive]);

  return (
    <div className="h-full flex relative">
      <div className="w-20 border-r border-[#1a2924] p-2 flex-shrink-0" style={{ backgroundColor: '#0a0f0d' }}>
        {channels.map(c => (
          <button key={c.id} onClick={() => setActiveChannel(c)} className="w-full p-3 rounded mb-1 flex flex-col items-center gap-1" style={{ backgroundColor: activeChannel.id === c.id ? '#00ff8820' : 'transparent', color: activeChannel.id === c.id ? '#00ff88' : '#4a6660' }}>
            {c.type === 'private' ? <Lock className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
            <span className="text-[9px] truncate w-full text-center">{c.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[#1a2924] flex items-center justify-between" style={{ backgroundColor: '#0a0f0d' }}>
          <div className="flex items-center gap-2">
            {activeChannel.type === 'private' && <Lock className="w-4 h-4 text-[#4a6660]" />}
            <span className="text-white font-medium">{activeChannel.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#4a6660]">{online} online</span>
            <button onClick={() => setMuted(!muted)} className={`p-2 rounded ${muted ? 'bg-[#ff3344]/20 text-[#ff3344]' : 'bg-[#111916] text-[#4a6660]'}`}>{muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {channelMsgs.map(msg => (
            <div key={msg.id}>
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold" style={{ color: getColor(msg.type === 'command' ? 'command' : msg.type === 'info' ? 'info' : 'response') }}>{msg.user}</span>
                <span className="text-[10px] text-[#4a6660]">{new Date(msg.time).toLocaleTimeString('en-US', { hour12: false })}</span>
              </div>
              <p className="text-sm text-gray-300 ml-0 mt-0.5">{msg.message}</p>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="p-4 border-t border-[#1a2924]" style={{ backgroundColor: '#0a0f0d' }}>
          <div className="flex gap-2">
            <input type="text" value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} placeholder="Type message..." className="flex-1 bg-[#111916] border border-[#1a2924] rounded px-4 py-2 text-sm text-white" />
            <button onClick={send} className="px-4 bg-[#00ff88]/20 text-[#00ff88] rounded hover:bg-[#00ff88]/30"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="w-48 border-l border-[#1a2924] p-3 hidden xl:block" style={{ backgroundColor: '#0a0f0d' }}>
        <p className="text-[10px] text-[#4a6660] mb-2">ONLINE ({online})</p>
        <div className="space-y-2">
          {onlineUsers.map(u => (
            <div key={u.id} className="flex items-center gap-2 p-1 rounded">
              <div className={`w-2 h-2 rounded-full ${u.status === 'online' ? 'bg-[#00ff88]' : u.status === 'away' ? 'bg-[#ffaa00]' : '#4a6660'}`} />
              <div>
                <p className="text-xs text-white">{u.name}</p>
                <p className="text-[8px] text-[#4a6660]">{u.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-20 left-20 right-0 border-t border-[#1a2924] p-4" style={{ backgroundColor: '#0a0f0d' }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                pttActive ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-[#1a2924]'
              }`}
            >
              <Mic className={`w-6 h-6 ${pttActive ? 'text-white' : 'text-[#4a6660]'}`} />
            </motion.button>
            <span className="text-xs text-[#4a6660] font-mono">PUSH TO TALK</span>
          </div>
          
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${transmitting ? 'text-[#00ff88] animate-pulse' : 'text-[#4a6660]'}`} />
                <span className="text-xs text-[#4a6660] font-mono">VOICE CHANNEL: TAC-1</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className={`w-4 h-4 ${signalStrength > 70 ? 'text-[#00ff88]' : signalStrength > 40 ? 'text-[#ffaa00]' : 'text-[#ff3344]'}`} />
                <span className="text-xs font-mono" style={{ color: signalStrength > 70 ? '#00ff88' : signalStrength > 40 ? '#ffaa00' : '#ff3344' }}>{signalStrength}%</span>
              </div>
            </div>
<div className="flex items-center gap-1 h-10">
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-[#00ff88] rounded-t"
                  animate={{ height: transmitting ? `${20 + Math.sin(i * 0.5) * 30}%` : '10%' }}
                  transition={{ repeat: transmitting ? Infinity : 0, duration: 0.1 }}
                  style={{ opacity: 0.4 }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <Phone className="w-4 h-4 text-[#4a6660]" />
              <span className="text-[10px] text-[#4a6660] font-mono">4 ACTIVE</span>
            </div>
            <button className="p-2 bg-[#1a2924] rounded text-[#4a6660] hover:text-white">
              <MicOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
