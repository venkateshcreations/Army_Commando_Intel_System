import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Users, Hash, Lock, Clock, Radio, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const mockChannels = [
  { id: 'general', name: 'General', type: 'public', unread: 3 },
  { id: 'tactical', name: 'Tactical Ops', type: 'public', unread: 0 },
  { id: 'alpha', name: 'Alpha Team', type: 'private', unread: 1 },
  { id: 'bravo', name: 'Bravo Team', type: 'private', unread: 0 },
  { id: 'charlie', name: 'Charlie Team', type: 'private', unread: 0 },
];

const mockMessages = [
  { id: 1, channel: 'tactical', user: 'Commander', message: 'All teams maintain position and await further orders', time: Date.now() - 60000, type: 'command' },
  { id: 2, channel: 'tactical', user: 'Alpha-1', message: 'Visual confirmed on target, holding position', time: Date.now() - 45000, type: 'response' },
  { id: 3, channel: 'general', user: 'Bravo-2', message: 'Supply drop received at waypoint Alpha-7', time: Date.now() - 30000, type: 'info' },
  { id: 4, channel: 'tactical', user: 'Delta-1', message: 'Perimeter secure, all clear', time: Date.now() - 15000, type: 'response' },
  { id: 5, channel: 'tactical', user: 'Echo-MED', message: 'Medical team ready for extraction', time: Date.now() - 10000, type: 'info' },
  { id: 6, channel: 'general', user: 'System', message: 'Satellite uplink established', time: Date.now() - 5000, type: 'system' },
];

const mockUsers = [
  { id: 1, name: 'Commander', status: 'online', role: 'Command' },
  { id: 2, name: 'Alpha-1', status: 'online', role: 'Assault' },
  { id: 3, name: 'Bravo-2', status: 'away', role: 'Recon' },
  { id: 4, name: 'Delta-1', status: 'online', role: 'Sniper' },
  { id: 5, name: 'Echo-MED', status: 'online', role: 'Medical' },
  { id: 6, name: 'Charlie-3', status: 'offline', role: 'Support' },
];

export default function CommunicationUI() {
  const [activeChannel, setActiveChannel] = useState(mockChannels[1]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      channel: activeChannel.id,
      user: 'You',
      message: newMessage,
      time: Date.now(),
      type: 'message'
    }]);
    setNewMessage('');
  };

  const channelMessages = messages.filter(m => m.channel === activeChannel.id);
  const onlineUsers = mockUsers.filter(u => u.status === 'online');

  const getMessageColor = (type) => {
    switch(type) {
      case 'command': return 'text-tactical-danger';
      case 'response': return 'text-tactical-primary';
      case 'info': return 'text-tactical-secondary';
      case 'system': return 'text-tactical-warning';
      default: return 'text-white';
    }
  };

  return (
    <div className="bg-tactical-card border border-tactical-border rounded-lg h-full flex flex-col">
      <div className="p-2 border-b border-tactical-border">
        <div className="flex items-center justify-between">
          <h2 className="text-tactical-primary font-semibold flex items-center gap-2 text-sm">
            <Radio className="w-4 h-4" />
            COMMUNICATIONS
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded ${isMuted ? 'bg-tactical-danger/20 text-tactical-danger' : 'bg-tactical-dark text-tactical-muted'}`}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-16 border-r border-tactical-border p-1.5 overflow-y-auto flex-shrink-0">
          {mockChannels.map(channel => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel)}
              className={`w-full p-2 rounded mb-1 flex flex-col items-center gap-1 transition-colors ${
                activeChannel.id === channel.id
                  ? 'bg-tactical-primary/20 text-tactical-primary'
                  : 'text-tactical-muted hover:text-white hover:bg-tactical-dark'
              }`}
            >
              {channel.type === 'private' ? (
                <Lock className="w-3 h-3" />
              ) : (
                <Hash className="w-3 h-3" />
              )}
              <span className="text-[9px] truncate w-full text-center">{channel.name}</span>
              {channel.unread > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 bg-tactical-danger text-white text-[8px] rounded-full flex items-center justify-center">
                  {channel.unread}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-2 border-b border-tactical-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeChannel.type === 'private' && <Lock className="w-3 h-3 text-tactical-muted" />}
              <span className="text-sm text-white font-medium">{activeChannel.name}</span>
            </div>
            <span className="text-[10px] text-tactical-muted flex items-center gap-1">
              <span className="w-2 h-2 bg-tactical-primary rounded-full animate-pulse"></span>
              {onlineUsers.length} online
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {channelMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${msg.user === 'System' ? 'bg-tactical-warning/10 rounded p-2 border border-tactical-warning/30' : ''}`}
              >
                <div className="flex items-baseline gap-2">
                  <span className={`text-xs font-semibold ${getMessageColor(msg.type)}`}>{msg.user}</span>
                  <span className="text-[10px] text-tactical-muted">
                    {new Date(msg.time).toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                </div>
                <p className={`text-sm mt-0.5 ${msg.user === 'System' ? 'text-tactical-warning' : 'text-gray-300'}`}>{msg.message}</p>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-2 border-t border-tactical-border">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type message..."
                className="flex-1 bg-tactical-dark border border-tactical-border rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-tactical-primary"
              />
              <button
                onClick={handleSend}
                className="p-1.5 bg-tactical-primary/20 text-tactical-primary rounded hover:bg-tactical-primary/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-20 border-l border-tactical-border p-2 overflow-y-auto hidden xl:block">
          <p className="text-[10px] text-tactical-muted mb-2">ONLINE ({onlineUsers.length})</p>
          <div className="space-y-1">
            {mockUsers.map(user => (
              <div key={user.id} className="flex items-center gap-1.5 p-1 rounded hover:bg-tactical-dark">
                <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-tactical-primary' : user.status === 'away' ? 'bg-tactical-warning' : 'bg-tactical-muted'}`}></div>
                <div className="min-w-0">
                  <p className="text-[10px] text-white truncate">{user.name}</p>
                  <p className="text-[8px] text-tactical-muted">{user.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
