import React, { useEffect, useState } from 'react';
import { Card, CardHeader, ProgressBar } from '../components/ui';
import { Activity, Radio, Cpu, Network } from 'lucide-react';

const generateWaveformData = () => Array.from({ length: 100 }, () => Math.random() * 100);

export const VoiceAnalysis = () => {
  const [waveform, setWaveform] = useState(generateWaveformData());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveform(prev => {
        const next = [...prev.slice(1), Math.random() * 100];
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Deep Acoustic Analysis</h2>
        <div className="live-indicator">
          <div className="live-dot" /> PROCESSING
        </div>
      </div>
      
      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        
        <Card>
          <CardHeader title="Live Waveform & Prosody" icon={Activity} />
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', gap: '2px', overflow: 'hidden' }}>
            {waveform.map((val, i) => (
              <div key={i} style={{ 
                flex: 1, 
                height: `${val}%`, 
                backgroundColor: i > 80 ? 'var(--status-critical)' : 'var(--brand-primary)',
                opacity: 0.8,
                transition: 'height 0.5s linear'
              }} />
            ))}
          </div>
        </Card>
        
        <Card>
          <CardHeader title="AI Detection Signals" icon={Cpu} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)', marginTop: 'var(--gap-sm)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span>Spectral Artifacts</span>
                <span>89%</span>
              </div>
              <ProgressBar value={89} color="var(--status-critical)" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span>Phase Inconsistency</span>
                <span>72%</span>
              </div>
              <ProgressBar value={72} color="var(--status-high)" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span>Prosodic Anomalies</span>
                <span>45%</span>
              </div>
              <ProgressBar value={45} color="var(--status-medium)" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span>Speaker Embedding Mismatch</span>
                <span>94%</span>
              </div>
              <ProgressBar value={94} color="var(--status-critical)" />
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <CardHeader title="Voice Analysis Pipeline" icon={Network} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--gap-lg)', position: 'relative' }}>
          {/* Connecting line */}
          <div style={{ position: 'absolute', top: '24px', left: '40px', right: '40px', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }} />
          
          {[
            { name: 'Signal Prep', value: '14ms' },
            { name: 'Acoustic', value: '13ms' },
            { name: 'Spectral', value: '27ms' },
            { name: 'Prosody', value: '21ms' },
            { name: 'Speaker ID', value: '16ms' },
            { name: 'Risk Engine', value: '93/100' }
          ].map((stage, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--gap-sm)', zIndex: 1 }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', 
                backgroundColor: i === 5 ? 'var(--status-critical-bg)' : 'var(--bg-card)', 
                border: `2px solid ${i === 5 ? 'var(--status-critical)' : 'var(--brand-primary)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Radio size={20} color={i === 5 ? 'var(--status-critical)' : 'var(--brand-primary)'} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{stage.name}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {stage.value}
              </span>
            </div>
          ))}
        </div>
      </Card>
      
    </div>
  );
};
