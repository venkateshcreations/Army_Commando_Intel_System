import { create } from 'zustand';
import { eventBus, EVENTS } from '../systems/EventBus';

const initialUnits = [
  { id: 'U001', name: 'Alpha Team', role: 'Assault', status: 'active', lat: 40.7128, lng: -74.0060, health: 100, lastUpdate: Date.now() },
  { id: 'U002', name: 'Bravo Team', role: 'Recon', status: 'active', lat: 40.7200, lng: -74.0100, health: 100, lastUpdate: Date.now() },
  { id: 'U003', name: 'Charlie Team', role: 'Support', status: 'active', lat: 40.7150, lng: -73.9950, health: 85, lastUpdate: Date.now() },
  { id: 'U004', name: 'Delta Team', role: 'Sniper', status: 'idle', lat: 40.7300, lng: -74.0200, health: 100, lastUpdate: Date.now() },
  { id: 'U005', name: 'Echo Team', role: 'Medical', status: 'active', lat: 40.7100, lng: -74.0080, health: 100, lastUpdate: Date.now() },
];

const initialThreats = [
  { id: 'T001', type: 'hostile', severity: 'critical', lat: 40.7250, lng: -74.0150, radius: 500, status: 'active', detectedAt: Date.now() - 300000 },
  { id: 'T002', type: 'suspicious', severity: 'high', lat: 40.7180, lng: -73.9900, radius: 300, status: 'active', detectedAt: Date.now() - 600000 },
  { id: 'T003', type: 'civilian', severity: 'low', lat: 40.7220, lng: -74.0050, radius: 200, status: 'monitoring', detectedAt: Date.now() - 900000 },
];

const initialAlerts = [
  { id: 'A001', type: 'threat', severity: 'critical', message: 'Hostile activity detected in sector 7', timestamp: Date.now() - 60000, acknowledged: false },
  { id: 'A002', type: 'unit', severity: 'warning', message: 'Charlie Team health below 90%', timestamp: Date.now() - 120000, acknowledged: false },
];

const initialFeed = [
  { id: 'F001', type: 'movement', source: 'Alpha Team', message: 'Moved to waypoint Alpha-7', timestamp: Date.now() - 30000 },
  { id: 'F002', type: 'detection', source: 'Bravo Team', message: 'Detected suspicious vehicle', timestamp: Date.now() - 60000 },
  { id: 'F003', type: 'alert', source: 'System', message: 'Perimeter breach attempted', timestamp: Date.now() - 90000 },
  { id: 'F004', type: 'status', source: 'Delta Team', message: 'Ready for deployment', timestamp: Date.now() - 120000 },
  { id: 'F005', type: 'intel', source: 'Intel Unit', message: 'New satellite imagery available', timestamp: Date.now() - 180000 },
];

export const useStore = create((set, get) => ({
  units: initialUnits,
  threats: initialThreats,
  alerts: initialAlerts,
  feed: initialFeed,
  settings: {
    simulationSpeed: 1,
    alertSound: true,
    theme: 'dark',
    mapStyle: 'default',
  },
  analytics: {
    threatDensity: 0,
    riskScore: 0,
    activeUnits: 0,
    detectedThreats: 0,
    hourlyActivity: [],
    riskHistory: [],
  },
  selectedUnit: null,
  selectedThreat: null,
  isSimulationRunning: true,

  setSelectedUnit: (unitId) => set({ selectedUnit: unitId }),
  setSelectedThreat: (threatId) => set({ selectedThreat: threatId }),
  
  toggleSimulation: () => set((state) => ({ isSimulationRunning: !state.isSimulationRunning })),
  
  updateSettings: (newSettings) => set((state) => ({ 
    settings: { ...state.settings, ...newSettings } 
  })),

  addFeedEvent: (event) => set((state) => ({
    feed: [{ ...event, id: `F${Date.now()}`, timestamp: Date.now() }, ...state.feed].slice(0, 100)
  })),

  addAlert: (alert) => set((state) => ({
    alerts: [{ ...alert, id: `A${Date.now()}`, timestamp: Date.now(), acknowledged: false }, ...state.alerts]
  })),

  dismissAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map(a => a.id === alertId ? { ...a, acknowledged: true } : a)
  })),

  acknowledgeAllAlerts: () => set((state) => ({
    alerts: state.alerts.map(a => ({ ...a, acknowledged: true }))
  })),

  updateUnitPosition: (unitId, lat, lng) => set((state) => ({
    units: state.units.map(u => u.id === unitId ? { ...u, lat, lng, lastUpdate: Date.now() } : u)
  })),

  updateUnitStatus: (unitId, status, health) => set((state) => ({
    units: state.units.map(u => u.id === unitId ? { ...u, status, health: health ?? u.health, lastUpdate: Date.now() } : u)
  })),

  addThreat: (threat) => set((state) => ({
    threats: [...state.threats, { ...threat, id: `T${Date.now()}`, detectedAt: Date.now() }]
  })),

  updateThreatStatus: (threatId, status) => set((state) => ({
    threats: state.threats.map(t => t.id === threatId ? { ...t, status } : t)
  })),

  updateAnalytics: (analytics) => set((state) => ({
    analytics: { ...state.analytics, ...analytics }
  })),
}));

eventBus.on(EVENTS.UNIT_MOVED, (data) => {
  const { unitId, lat, lng } = data;
  useStore.getState().updateUnitPosition(unitId, lat, lng);
});

eventBus.on(EVENTS.THREAT_DETECTED, (threat) => {
  useStore.getState().addThreat(threat);
  useStore.getState().addAlert({
    type: 'threat',
    severity: threat.severity,
    message: `${threat.type} detected at coordinates ${threat.lat.toFixed(4)}, ${threat.lng.toFixed(4)}`
  });
  useStore.getState().addFeedEvent({
    type: 'detection',
    source: 'Radar System',
    message: `New ${threat.type} threat detected`
  });
});

eventBus.on(EVENTS.ALERT_TRIGGERED, (alert) => {
  useStore.getState().addAlert(alert);
});

eventBus.on(EVENTS.FEED_EVENT, (event) => {
  useStore.getState().addFeedEvent(event);
});
