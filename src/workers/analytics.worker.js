self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'COMPUTE_ANALYTICS':
      const analytics = computeAnalytics(data);
      self.postMessage({ type: 'ANALYTICS_RESULT', data: analytics });
      break;
      
    case 'DETECT_PATTERNS':
      const patterns = detectPatterns(data);
      self.postMessage({ type: 'PATTERNS_RESULT', data: patterns });
      break;
      
    case 'PREDICT_RISK':
      const prediction = predictRisk(data);
      self.postMessage({ type: 'RISK_PREDICTION', data: prediction });
      break;
      
    case 'PROCESS_HEATMAP':
      const heatmap = generateHeatmap(data);
      self.postMessage({ type: 'HEATMAP_DATA', data: heatmap });
      break;
      
    default:
      break;
  }
};

function computeAnalytics({ units, threats, alerts }) {
  const activeThreats = threats.filter(t => t.status === 'active');
  const activeUnits = units.filter(u => u.status === 'active');
  
  const threatScore = activeThreats.reduce((sum, t) => {
    const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
    return sum + (severityWeight[t.severity] || 1);
  }, 0);
  
  const avgUnitHealth = units.reduce((sum, u) => sum + u.health, 0) / units.length;
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;
  
  return {
    threatScore,
    activeThreats: activeThreats.length,
    activeUnits: activeUnits.length,
    avgUnitHealth: Math.round(avgUnitHealth),
    unacknowledgedAlerts,
    riskLevel: Math.min(100, threatScore * 10 + unacknowledgedAlerts * 15)
  };
}

function detectPatterns({ units, threats }) {
  const patterns = [];
  
  const clusters = groupByProximity(threats);
  if (clusters.length > 0) {
    patterns.push({
      type: 'threat_cluster',
      severity: 'high',
      message: `${clusters.length} threat cluster(s) detected`,
      locations: clusters
    });
  }
  
  const unitMovements = analyzeMovementPatterns(units);
  if (unitMovements.suspicious) {
    patterns.push({
      type: 'unusual_movement',
      severity: 'medium',
      message: 'Unusual movement patterns detected',
      details: unitMovements
    });
  }
  
  const temporalPattern = analyzeTemporalPatterns(threats);
  if (temporalPattern.increasing) {
    patterns.push({
      type: 'increasing_threats',
      severity: 'critical',
      message: 'Threat frequency increasing',
      details: temporalPattern
    });
  }
  
  return patterns;
}

function groupByProximity(threats, threshold = 0.01) {
  const clusters = [];
  const processed = new Set();
  
  threats.forEach((threat, i) => {
    if (processed.has(i)) return;
    
    const cluster = [threat];
    processed.add(i);
    
    threats.forEach((other, j) => {
      if (i !== j && !processed.has(j)) {
        const distance = Math.sqrt(
          Math.pow(threat.lat - other.lat, 2) + 
          Math.pow(threat.lng - other.lng, 2)
        );
        if (distance < threshold) {
          cluster.push(other);
          processed.add(j);
        }
      }
    });
    
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  });
  
  return clusters;
}

function analyzeMovementPatterns(units) {
  const movements = units.map(u => ({
    id: u.id,
    status: u.status,
    health: u.health
  }));
  
  const inactiveUnits = movements.filter(u => u.status !== 'active').length;
  const lowHealth = movements.filter(u => u.health < 70).length;
  
  return {
    suspicious: inactiveUnits > movements.length * 0.5 || lowHealth > 2,
    inactiveUnits,
    lowHealthUnits: lowHealth
  };
}

function analyzeTemporalPatterns(threats) {
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  const twoHoursAgo = now - 7200000;
  
  const recentThreats = threats.filter(t => t.detectedAt > oneHourAgo).length;
  const olderThreats = threats.filter(t => t.detectedAt > twoHoursAgo && t.detectedAt <= oneHourAgo).length;
  
  return {
    increasing: recentThreats > olderThreats * 1.5,
    recentCount: recentThreats,
    olderCount: olderThreats
  };
}

function predictRisk({ currentRisk, threatTrend, timeToAnalyze }) {
  const trendMultiplier = threatTrend > 0 ? 1.1 : threatTrend < 0 ? 0.9 : 1;
  const basePrediction = currentRisk * trendMultiplier;
  const prediction = Math.min(100, Math.max(0, basePrediction + timeToAnalyze * 0.5));
  
  return {
    predictedRisk: Math.round(prediction),
    trend: threatTrend > 0 ? 'increasing' : threatTrend < 0 ? 'decreasing' : 'stable',
    confidence: Math.min(95, 60 + Math.random() * 35)
  };
}

function generateHeatmap({ threats, gridSize = 20 }) {
  const bounds = { minLat: 40.7, maxLat: 40.78, minLng: -74.03, maxLng: -73.97 };
  const cellWidth = (bounds.maxLng - bounds.minLng) / gridSize;
  const cellHeight = (bounds.maxLat - bounds.minLat) / gridSize;
  
  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = {
        x: i,
        y: j,
        lat: bounds.minLat + i * cellHeight,
        lng: bounds.minLng + j * cellWidth,
        intensity: 0
      };
      
      threats.forEach(threat => {
        const inCell = 
          threat.lat >= cell.lat && threat.lat < cell.lat + cellHeight &&
          threat.lng >= cell.lng && threat.lng < cell.lng + cellWidth;
        
        if (inCell) {
          const severityWeight = { critical: 1, high: 0.75, medium: 0.5, low: 0.25 };
          cell.intensity += severityWeight[threat.severity] || 0.25;
        }
      });
      
      grid.push(cell);
    }
  }
  
  return { grid, bounds, cellSize: cellWidth };
}
