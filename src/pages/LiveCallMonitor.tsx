import React from 'react';
import { Card, CardHeader, Badge, Button } from '../components/ui';
import { useSimulation } from '../context/SimulationContext';
import { Phone, ShieldAlert, Activity, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LiveCallMonitor = () => {
  const { activeCalls } = useSimulation();
  const navigate = useNavigate();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-sm)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Active Voice Channels</h2>
          <div className="live-indicator">
            <div className="live-dot" /> LIVE
          </div>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Monitoring {activeCalls.length} concurrent calls
        </div>
      </div>
      
      <div className="call-grid">
        {activeCalls.map(call => (
          <Card key={call.id} style={{ 
            borderColor: call.threatLevel === 'CRITICAL' ? 'var(--status-critical)' : 
                         call.threatLevel === 'HIGH' ? 'var(--status-high)' : 'var(--border-color)',
            boxShadow: call.threatLevel === 'CRITICAL' ? '0 0 10px rgba(239, 68, 68, 0.2)' : 'none'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--gap-sm)' }}>
              <div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{call.id}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{call.callerId}</div>
              </div>
              <Badge variant={call.threatLevel.toLowerCase() as any}>{call.threatLevel}</Badge>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.875rem', marginBottom: 'var(--gap-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Destination:</span>
                <span>{call.destination}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Duration:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>AI Prob:</span>
                <span style={{ 
                  fontFamily: 'var(--font-mono)', 
                  color: call.aiProbability > 50 ? 'var(--status-critical)' : 'var(--status-safe)' 
                }}>{call.aiProbability.toFixed(1)}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Risk Score:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{call.riskScore} / 100</span>
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--gap-xs)' }}>
              <Button 
                variant={call.threatLevel === 'CRITICAL' ? 'danger' : 'primary'} 
                style={{ flex: 1 }}
                onClick={() => navigate('/voice-analysis')}
              >
                Analyze
              </Button>
              <Button variant="secondary" icon={AlertTriangle} title="Flag Call" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
