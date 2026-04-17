import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { BarChart3, TrendingUp, Activity, Shield, AlertTriangle, Target, Zap, Clock, Thermometer } from 'lucide-react';
import { useStore } from '../store/useStore';

function ThreatHeatmap() {
  const svgRef = useRef(null);
  const { threats } = useStore();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 280;
    const height = 160;
    const gridSize = 12;
    const cellSize = width / gridSize;

    const grid = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        let intensity = 0;
        threats.forEach(threat => {
          const distFactor = Math.sqrt(
            Math.pow((i / gridSize - 0.5) * 2, 2) + 
            Math.pow((j / gridSize - 0.5) * 2, 2)
          );
          if (distFactor < 0.4) {
            const severityWeight = { critical: 1, high: 0.75, medium: 0.5, low: 0.25 };
            intensity += (severityWeight[threat.severity] || 0.25) * (1 - distFactor);
          }
        });
        grid.push({ x: i, y: j, intensity: Math.min(intensity, 1) });
      }
    }

    const colorScale = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateRgbBasis(['#111916', '#331111', '#ff0000']));

    svg.selectAll('rect')
      .data(grid)
      .enter()
      .append('rect')
      .attr('x', d => d.x * cellSize)
      .attr('y', d => d.y * cellSize)
      .attr('width', cellSize - 1)
      .attr('height', cellSize - 1)
      .attr('fill', d => d.intensity > 0.05 ? colorScale(d.intensity) : '#1a2924')
      .attr('rx', 2);

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 1)
      .attr('rx', 4);

  }, [threats]);

  return (
    <div className="bg-tactical-dark border border-tactical-border rounded-lg p-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-tactical-muted font-semibold flex items-center gap-1">
          <Thermometer className="w-3 h-3" />
          THREAT HEATMAP
        </p>
        <span className="text-[10px] text-tactical-danger">{threats.filter(t => t.status === 'active').length} ACTIVE</span>
      </div>
      <svg ref={svgRef} width={280} height={160} className="mx-auto" />
      <div className="flex justify-between mt-1 text-[8px] text-tactical-muted">
        <span>LOW</span>
        <span>MEDIUM</span>
        <span>HIGH</span>
        <span>CRITICAL</span>
      </div>
    </div>
  );
}

function TimelineChart() {
  const svgRef = useRef(null);
  const { analytics } = useStore();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 10, right: 10, bottom: 25, left: 25 };
    const width = 280 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = analytics.hourlyActivity;

    const x = d3.scaleBand()
      .domain(data.map(d => d.hour))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 20])
      .range([height, 0]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => i % 4 === 0)))
      .selectAll('text')
      .attr('fill', '#4a6660')
      .attr('font-size', '8px');

    g.append('g')
      .call(d3.axisLeft(y).ticks(3))
      .selectAll('text')
      .attr('fill', '#4a6660')
      .attr('font-size', '8px');

    g.selectAll('line').attr('stroke', '#1a2924');
    g.selectAll('path').attr('stroke', '#1a2924');

    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#00ff88');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#00ccff');

    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.hour))
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.count))
      .attr('fill', 'url(#barGradient)')
      .attr('rx', 2);

  }, [analytics.hourlyActivity]);

  return (
    <div className="bg-tactical-dark border border-tactical-border rounded-lg p-2">
      <p className="text-xs text-tactical-muted font-semibold flex items-center gap-1 mb-2">
        <Activity className="w-3 h-3" />
        ACTIVITY TIMELINE (24H)
      </p>
      <svg ref={svgRef} width={280} height={100} className="mx-auto" />
    </div>
  );
}

function RiskPredictionCurve() {
  const svgRef = useRef(null);
  const { analytics } = useStore();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 10, right: 10, bottom: 25, left: 25 };
    const width = 280 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = analytics.riskHistory;

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d.score))
      .curve(d3.curveMonotoneX);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${60 - d}m`))
      .selectAll('text')
      .attr('fill', '#4a6660')
      .attr('font-size', '8px');

    g.append('g')
      .call(d3.axisLeft(y).ticks(4))
      .selectAll('text')
      .attr('fill', '#4a6660')
      .attr('font-size', '8px');

    g.selectAll('line').attr('stroke', '#1a2924');
    g.selectAll('path').attr('stroke', '#1a2924');

    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'riskAreaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ff3344')
      .attr('stop-opacity', 0.4);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ff3344')
      .attr('stop-opacity', 0);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#riskAreaGradient)')
      .attr('d', d3.area()
        .x((d, i) => x(i))
        .y0(height)
        .y1(d => y(d.score))
        .curve(d3.curveMonotoneX)
      );

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#ff3344')
      .attr('stroke-width', 2)
      .attr('d', line);

    g.selectAll('circle')
      .data(data.slice(-1))
      .enter()
      .append('circle')
      .attr('cx', (d, i) => x(data.length - 1))
      .attr('cy', d => y(d.score))
      .attr('r', 4)
      .attr('fill', '#ff3344');

  }, [analytics.riskHistory]);

  return (
    <div className="bg-tactical-dark border border-tactical-border rounded-lg p-2">
      <p className="text-xs text-tactical-muted font-semibold flex items-center gap-1 mb-2">
        <TrendingUp className="w-3 h-3" />
        RISK PREDICTION (60m)
      </p>
      <svg ref={svgRef} width={280} height={100} className="mx-auto" />
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { analytics, units, threats } = useStore();

  const riskLevel = useMemo(() => {
    if (analytics.riskScore >= 75) return { level: 'CRITICAL', color: 'text-tactical-danger', bg: 'bg-tactical-danger/20' };
    if (analytics.riskScore >= 50) return { level: 'HIGH', color: 'text-tactical-warning', bg: 'bg-tactical-warning/20' };
    if (analytics.riskScore >= 25) return { level: 'MODERATE', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    return { level: 'LOW', color: 'text-tactical-primary', bg: 'bg-tactical-primary/20' };
  }, [analytics.riskScore]);

  return (
    <div className="bg-tactical-card border border-tactical-border rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-tactical-border flex items-center justify-between">
        <h2 className="text-tactical-primary font-semibold flex items-center gap-2 text-sm">
          <BarChart3 className="w-4 h-4" />
          ANALYTICS
        </h2>
        <div className={`px-2 py-1 rounded text-[10px] font-bold ${riskLevel.bg} ${riskLevel.color}`}>
          {riskLevel.level} RISK
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-tactical-dark border border-tactical-border rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield className="w-3 h-3 text-tactical-danger" />
              <p className="text-[10px] text-tactical-muted">RISK SCORE</p>
            </div>
            <p className="text-2xl font-bold text-tactical-danger">{analytics.riskScore}</p>
            <div className="mt-1 h-1.5 bg-tactical-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-tactical-warning to-tactical-danger" 
                style={{ width: `${analytics.riskScore}%` }} 
              />
            </div>
          </div>
          
          <div className="bg-tactical-dark border border-tactical-border rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3 h-3 text-tactical-warning" />
              <p className="text-[10px] text-tactical-muted">THREAT DENSITY</p>
            </div>
            <p className="text-2xl font-bold text-tactical-warning">{analytics.threatDensity.toFixed(2)}</p>
            <p className="text-[10px] text-tactical-muted mt-1">{threats.filter(t => t.status === 'active').length} active threats</p>
          </div>
        </div>

        <ThreatHeatmap />
        <TimelineChart />
        <RiskPredictionCurve />

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-tactical-dark border border-tactical-border rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3 h-3 text-tactical-secondary" />
              <p className="text-[10px] text-tactical-muted">EFFICIENCY</p>
            </div>
            <p className="text-xl font-bold text-tactical-secondary">87%</p>
            <p className="text-[10px] text-tactical-primary mt-1">+3% from avg</p>
          </div>
          
          <div className="bg-tactical-dark border border-tactical-border rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3 h-3 text-tactical-muted" />
              <p className="text-[10px] text-tactical-muted">RESPONSE TIME</p>
            </div>
            <p className="text-xl font-bold text-white">2.4s</p>
            <p className="text-[10px] text-tactical-primary mt-1">-0.8s improved</p>
          </div>
        </div>

        <div className="bg-tactical-dark border border-tactical-border rounded-lg p-2">
          <p className="text-[10px] text-tactical-muted mb-2">UNIT PERFORMANCE</p>
          <div className="space-y-1.5">
            {units.slice(0, 4).map(unit => (
              <div key={unit.id} className="flex items-center justify-between">
                <span className="text-[10px] text-white">{unit.name}</span>
                <div className="flex-1 mx-2">
                  <div className="h-1.5 bg-tactical-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${unit.health > 70 ? 'bg-tactical-primary' : unit.health > 30 ? 'bg-tactical-warning' : 'bg-tactical-danger'}`} 
                      style={{ width: `${unit.health}%` }} 
                    />
                  </div>
                </div>
                <span className="text-[10px] text-tactical-muted">{unit.health}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
