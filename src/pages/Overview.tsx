import React from 'react';
import { ShieldAlert, Activity, PhoneCall, AlertTriangle, CheckCircle, Clock, Bell } from 'lucide-react';
import { Card, CardHeader, MetricCard } from '../components/ui';
import { useSimulation } from '../context/SimulationContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  safe: Math.floor(1000 + Math.random() * 500),
  synthetic: Math.floor(10 + Math.random() * 40)
}));

export const Overview = () => {
  const { activeCalls, alerts, analytics, systemHealth } = useSimulation();
  
  const highRiskCalls = activeCalls.filter(c => c.threatLevel === 'HIGH' || c.threatLevel === 'CRITICAL').length;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)' }}>
      
      {/* Voice Security Status Banner */}
      <Card style={{ backgroundColor: 'var(--bg-panel)', borderColor: highRiskCalls > 0 ? 'var(--status-critical)' : 'var(--status-safe)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-md)' }}>
            {highRiskCalls > 0 ? (
              <AlertTriangle size={32} color="var(--status-critical)" />
            ) : (
              <ShieldAlert size={32} color="var(--status-safe)" />
            )}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: highRiskCalls > 0 ? 'var(--status-critical)' : 'var(--status-safe)' }}>
                VOICE SECURITY STATUS: {highRiskCalls > 0 ? 'ELEVATED RISK DETECTED' : 'PROTECTED & MONITORING'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                {highRiskCalls > 0 ? `${highRiskCalls} active high-risk calls require attention.` : 'All voice channels are secure.'}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>System Detection Latency</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{systemHealth.inferenceLatency}ms</div>
          </div>
        </div>
      </Card>
      
      {/* KPIs */}
      <div className="grid-4">
        <MetricCard title="Calls Analyzed" value={analytics.callsAnalyzed.toLocaleString()} change="+12.4%" isPositive={true} icon={PhoneCall} />
        <MetricCard title="Active Calls" value={activeCalls.length} icon={Activity} />
        <MetricCard title="Synthetic Voices" value={analytics.aiDetected.toLocaleString()} change="+8.7%" isPositive={false} icon={AlertTriangle} />
        <MetricCard title="Fraud Prevented" value={analytics.prevented.toLocaleString()} change="+15.2%" isPositive={true} icon={CheckCircle} />
      </div>
      
      {/* Charts & Lists */}
      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        
        <Card style={{ height: '400px' }}>
          <CardHeader title="Detection Volume (24H)" icon={Activity} />
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--status-safe)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--status-safe)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--status-critical)" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="var(--status-critical)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} stroke="var(--border-color)" />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} stroke="var(--border-color)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-base)' }}
                  itemStyle={{ fontSize: '0.875rem' }}
                />
                <Area type="monotone" dataKey="safe" name="Human Voices" stroke="var(--status-safe)" fillOpacity={1} fill="url(#colorSafe)" />
                <Area type="monotone" dataKey="synthetic" name="AI/Synthetic" stroke="var(--status-critical)" fillOpacity={1} fill="url(#colorThreat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card style={{ height: '400px' }}>
          <CardHeader title="Recent Alerts" icon={Bell} />
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--gap-sm)' }}>
            {alerts.length === 0 ? (
              <div style={{ padding: 'var(--gap-lg)', textAlign: 'center', color: 'var(--text-muted)' }}>No recent alerts</div>
            ) : (
              alerts.map((alert, i) => (
                <div key={i} style={{ 
                  padding: 'var(--gap-sm)', 
                  borderLeft: `3px solid ${alert.type === 'CRITICAL' ? 'var(--status-critical)' : alert.type === 'WARNING' ? 'var(--status-high)' : alert.type === 'SUCCESS' ? 'var(--status-safe)' : 'var(--status-low)'}`,
                  backgroundColor: 'var(--bg-hover)',
                  borderRadius: '0 var(--radius-base) var(--radius-base) 0',
                  fontSize: '0.875rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                  <div>{alert.message}</div>
                </div>
              ))
            )}
          </div>
        </Card>
        
      </div>
    </div>
  );
};


