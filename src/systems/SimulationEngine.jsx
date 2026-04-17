import { eventBus, EVENTS } from '../systems/EventBus';
import { useStore } from '../store/useStore';

const THREAT_TYPES = ['hostile', 'suspicious', 'civilian', 'vehicle', 'drone'];
const SEVERITIES = ['critical', 'high', 'medium', 'low'];
const UNIT_ROLES = ['Assault', 'Recon', 'Support', 'Sniper', 'Medical'];
const FEED_TYPES = ['movement', 'detection', 'alert', 'status', 'intel', 'communication'];

const randomInRange = (min, max) => Math.random() * (max - min) + min;
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomLat = () => 40.70 + Math.random() * 0.08;
const randomLng = () => -74.03 + Math.random() * 0.06;

class SimulationEngine {
  constructor() {
    this.intervalId = null;
    this.tickCount = 0;
    this.baseLat = 40.715;
    this.baseLng = -74.005;
  }

  start(interval = 2000) {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.tick(), interval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  tick() {
    this.tickCount++;
    const state = useStore.getState();
    
    if (!state.isSimulationRunning) return;

    state.units.forEach(unit => {
      if (unit.status === 'active' && Math.random() > 0.3) {
        const movement = 0.002;
        const newLat = unit.lat + randomInRange(-movement, movement);
        const newLng = unit.lng + randomInRange(-movement, movement);
        state.updateUnitPosition(unit.id, newLat, newLng);
        
        if (Math.random() > 0.7) {
          eventBus.emit(EVENTS.FEED_EVENT, {
            type: 'movement',
            source: unit.name,
            message: `Position updated in sector ${Math.floor(Math.random() * 10) + 1}`
          });
        }
      }

      if (Math.random() > 0.95) {
        const newHealth = Math.max(0, Math.min(100, unit.health + randomInRange(-10, 5)));
        const newStatus = newHealth < 30 ? 'injured' : newHealth < 60 ? 'compromised' : unit.status;
        state.updateUnitStatus(unit.id, newStatus, newHealth);
      }
    });

    if (Math.random() > 0.85) {
      const newThreat = {
        type: randomElement(THREAT_TYPES),
        severity: randomElement(SEVERITIES),
        lat: randomLat(),
        lng: randomLng(),
        radius: randomInRange(100, 800),
        status: 'active'
      };
      eventBus.emit(EVENTS.THREAT_DETECTED, newThreat);
    }

    if (Math.random() > 0.9) {
      const feedEvent = {
        type: randomElement(FEED_TYPES),
        source: randomElement(state.units).name,
        message: this.generateRandomMessage()
      };
      eventBus.emit(EVENTS.FEED_EVENT, feedEvent);
    }

    if (Math.random() > 0.92) {
      const alert = {
        type: randomElement(['threat', 'unit', 'system']),
        severity: randomElement(['critical', 'warning', 'info']),
        message: this.generateRandomAlert()
      };
      eventBus.emit(EVENTS.ALERT_TRIGGERED, alert);
    }

    this.computeAnalytics();
    eventBus.emit(EVENTS.SIMULATION_TICK, { tick: this.tickCount });
  }

  generateRandomMessage() {
    const messages = [
      'Visual contact established',
      'Moving to new waypoint',
      'Requesting backup',
      'Area clear',
      'Enemy spotted',
      'Setting up perimeter',
      'Taking fire',
      'Requesting extraction',
      'Equipment check complete',
      'Patrol initiated'
    ];
    return randomElement(messages);
  }

  generateRandomAlert() {
    const alerts = [
      'Unidentified movement detected',
      'Communication jamming detected',
      'Unauthorized drone activity',
      'Perimeter breach attempt',
      'Supply drop required',
      'Medical evacuation needed',
      'Enemy reinforcement detected'
    ];
    return randomElement(alerts);
  }

  computeAnalytics() {
    const state = useStore.getState();
    const activeThreats = state.threats.filter(t => t.status === 'active');
    const activeUnits = state.units.filter(u => u.status === 'active');
    
    const threatDensity = activeThreats.length > 0 
      ? activeThreats.reduce((sum, t) => sum + (t.severity === 'critical' ? 4 : t.severity === 'high' ? 3 : t.severity === 'medium' ? 2 : 1), 0) / state.units.length
      : 0;
    
    const riskScore = Math.min(100, Math.round(threatDensity * 25 + (state.alerts.filter(a => !a.acknowledged).length * 10)));
    
    const now = Date.now();
    const hourlyActivity = [];
    for (let i = 23; i >= 0; i--) {
      hourlyActivity.push({
        hour: new Date(now - i * 3600000).getHours(),
        count: Math.floor(Math.random() * 20) + 5
      });
    }

    const riskHistory = [];
    for (let i = 59; i >= 0; i--) {
      riskHistory.push({
        minute: i,
        score: Math.floor(Math.random() * 40 + riskScore * 0.5)
      });
    }

    state.updateAnalytics({
      threatDensity: Math.round(threatDensity * 100) / 100,
      riskScore,
      activeUnits: activeUnits.length,
      detectedThreats: activeThreats.length,
      hourlyActivity,
      riskHistory
    });
  }
}

export const simulationEngine = new SimulationEngine();
