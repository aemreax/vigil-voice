import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Activity, Lock, Server, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <header style={{ padding: 'var(--gap-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-sm)' }}>
          <ShieldAlert size={24} color="var(--brand-primary)" />
          <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.05em' }}>Vigil Voice</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--gap-md)' }}>
          <Button variant="secondary" onClick={() => navigate('/login')}>Login</Button>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>Launch Console</Button>
        </div>
      </header>
      
      <main className="landing-hero">
        <h1 className="landing-title">
          Detect Voice Cloning.<br />
          Prevent Impersonation.<br />
          Protect Every Conversation.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', marginBottom: 'var(--gap-xxl)' }}>
          AI-powered real-time voice authenticity and impersonation detection for banks, enterprises, telecom networks, and government organizations.
        </p>
        
        <div style={{ display: 'flex', gap: 'var(--gap-lg)' }}>
          <Button variant="primary" style={{ padding: 'var(--gap-sm) var(--gap-lg)', fontSize: '1.125rem' }} onClick={() => navigate('/dashboard')}>
            Launch Security Console <ArrowRight size={18} />
          </Button>
          <Button variant="secondary" style={{ padding: 'var(--gap-sm) var(--gap-lg)', fontSize: '1.125rem', border: '1px solid var(--border-color)' }} onClick={() => navigate('/attack-simulator')}>
            Run Attack Simulation
          </Button>
        </div>
        
        <div style={{ marginTop: '100px', display: 'flex', gap: 'var(--gap-xxl)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: Activity, title: 'Real-Time Detection', desc: 'Sub-100ms latency acoustic analysis' },
            { icon: ShieldAlert, title: 'Risk Intelligence', desc: 'Context-aware dynamic risk scoring' },
            { icon: Lock, title: 'Fraud Prevention', desc: 'Pre-transaction transaction blocking' },
            { icon: Server, title: 'Enterprise Integration', desc: 'SIP/VoIP and WebSocket support' }
          ].map((feature, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--gap-sm)', width: '200px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-base)', backgroundColor: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                <feature.icon size={24} color="var(--brand-primary)" />
              </div>
              <h3 style={{ fontWeight: 600 }}>{feature.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
