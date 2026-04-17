class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  once(event, callback) {
    const unsubscribe = this.on(event, (data) => {
      unsubscribe();
      callback(data);
    });
    return unsubscribe;
  }
}

export const eventBus = new EventBus();

export const EVENTS = {
  UNIT_MOVED: 'UNIT_MOVED',
  UNIT_STATUS_CHANGED: 'UNIT_STATUS_CHANGED',
  THREAT_DETECTED: 'THREAT_DETECTED',
  THREAT_UPDATED: 'THREAT_UPDATED',
  ALERT_TRIGGERED: 'ALERT_TRIGGERED',
  ALERT_DISMISSED: 'ALERT_DISMISSED',
  FEED_EVENT: 'FEED_EVENT',
  SIMULATION_TICK: 'SIMULATION_TICK',
  MAP_CLICK: 'MAP_CLICK',
  FILTER_CHANGED: 'FILTER_CHANGED',
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
};
