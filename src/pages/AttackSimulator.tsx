import React from 'react';
import { Card, CardHeader, Button, Badge } from '../components/ui';
import { useSimulation } from '../context/SimulationContext';
import { Play, Shield, AlertOctagon, Lock, Fingerprint, Crosshair, CheckCircle, Activity } from 'lucide-react';

export const AttackSimulator = () => {
  const { isSimulatingAttack, startAttackSimulation, activeCalls, alerts, blockTransaction } = useSimulation();
  
  const targetCall = activeCalls[0];
  const isAttackPrevented = targetCall?.status === 'BLOCKED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Command Center: Attack Simulator</h2>
        <Button 
          variant={isSimulatingAttack ? 'secondary' : 'primary'} 
          icon={Play}
          onClick={() => startAttackSimulation('VOICE_CLONING')}
          disabled={isSimulatingAttack || isAttackPrevented}
        >
          {isSimulatingAttack ? 'Simulation Running...' : 'START LIVE SIMULATION'}
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--gap-md)', flex: 1, height: 'calc(100vh - 120px)' }}>
        
        {/* Left Side: Context, Transaction, and Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)', overflowY: 'auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-md)' }}>
            <Card>
              <CardHeader title="Live Call Context" icon={Crosshair} />
              {targetCall ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-sm)', fontSize: '0.875rem' }}>
                  <div style={{ padding: 'var(--gap-sm)', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-base)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>CALL ID</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{targetCall.id}</div>
                  </div>
                  <div><strong>Caller:</strong> {targetCall.callerId}</div>
                  <div><strong>Location:</strong> {targetCall.location}</div>
                  <div><strong>Language:</strong> {targetCall.language}</div>
                  
                  <div style={{ marginTop: 'var(--gap-md)', paddingTop: 'var(--gap-md)', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 'var(--gap-xs)' }}>AI VOICE PROBABILITY</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: targetCall.aiProbability > 80 ? 'var(--status-critical)' : 'var(--brand-primary)' }}>
                      {targetCall.aiProbability.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 'var(--gap-sm)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 'var(--gap-xs)' }}>RISK SCORE</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: targetCall.riskScore > 80 ? 'var(--status-critical)' : targetCall.riskScore > 50 ? 'var(--status-high)' : 'var(--status-safe)' }}>
                      {targetCall.riskScore} / 100
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Waiting for simulation...</div>
              )}
            </Card>
            
            <Card>
              <CardHeader title="Transaction Details" icon={Lock} />
              {targetCall?.transaction ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-xs)', fontSize: '0.875rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{targetCall.transaction.amount.toLocaleString()}</div>
                  <div>Type: {targetCall.transaction.type}</div>
                  <Badge variant={targetCall.transaction.status === 'BLOCKED' ? 'critical' : 'medium'}>
                    {targetCall.transaction.status}
                  </Badge>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No sensitive transaction detected yet.</div>
              )}
            </Card>
          </div>
          
          {/* Middle: Attack Timeline / Pipeline (Now full width below) */}
          <Card style={{ flex: 1, minHeight: '300px' }}>
            <CardHeader title="Real-Time Analysis Pipeline" icon={Shield} />
            
            {isAttackPrevented ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--gap-md)', color: 'var(--status-safe)', height: '100%' }}>
                <CheckCircle size={64} />
                <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>ATTACK PREVENTED</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Transaction blocked. Account secured.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)', marginTop: 'var(--gap-lg)' }}>
                {!targetCall && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--gap-xxl)' }}>
                    Click "START LIVE SIMULATION" to begin demonstration.
                  </div>
                )}
                
                {targetCall?.events.map((event, i) => (
                  <div key={i} className={`pipeline-stage ${event.type === 'CRITICAL' ? 'danger' : 'active'}`}>
                    {event.type === 'CRITICAL' ? <AlertOctagon color="var(--status-critical)" /> : 
                     event.type === 'SUCCESS' ? <CheckCircle color="var(--status-safe)" /> :
                     <Activity color="var(--brand-primary)" />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(event.timestamp).toLocaleTimeString()}</div>
                      <div style={{ fontWeight: 500 }}>{event.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        
        {/* Right Sidebar: Action / Verification & Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)' }}>
          <Card>
            <CardHeader title="System Response" icon={Fingerprint} />
            
            {targetCall?.threatLevel === 'CRITICAL' && !isAttackPrevented ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-lg)', marginTop: 'var(--gap-md)' }}>
                <div style={{ padding: 'var(--gap-sm)', backgroundColor: 'var(--status-critical-bg)', border: '1px solid var(--status-critical)', borderRadius: 'var(--radius-base)', color: 'var(--status-critical)', fontWeight: 600, textAlign: 'center' }}>
                  CRITICAL THREAT DETECTED
                </div>
                
                <div style={{ fontSize: '0.875rem' }}>
                  <strong>Recommendation:</strong><br/>
                  Voice cloning probability is extreme (96.8%). Speaker identity does not match historical embeddings. 
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-sm)' }}>
                  <Button variant="danger" style={{ padding: 'var(--gap-md)' }} onClick={() => blockTransaction(targetCall.id)}>
                    BLOCK TRANSACTION NOW
                  </Button>
                  <Button variant="outline-danger" style={{ padding: 'var(--gap-md)' }}>
                    REQUIRE SECONDARY VERIFICATION
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 'var(--gap-md)' }}>
                {isAttackPrevented ? 'Threat neutralized.' : 'Monitoring for threats...'}
              </div>
            )}
          </Card>

          <Card style={{ flex: 1 }}>
            <CardHeader title="Acoustic Signature" icon={Activity} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)', marginTop: 'var(--gap-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PHASE CONSISTENCY</div>
              <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: targetCall ? (targetCall.aiProbability > 50 ? '30%' : '85%') : '0%', backgroundColor: targetCall?.aiProbability > 50 ? 'var(--status-critical)' : 'var(--status-safe)', transition: 'width 1s ease' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SPECTRAL ARTIFACTS</div>
              <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: targetCall ? (targetCall.aiProbability > 50 ? '92%' : '12%') : '0%', backgroundColor: targetCall?.aiProbability > 50 ? 'var(--status-critical)' : 'var(--status-safe)', transition: 'width 1s ease' }} />
              </div>
              
              <div style={{ marginTop: 'var(--gap-md)', height: '100px', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                {/* Fake animated bars */}
                {Array.from({ length: 40 }).map((_, i) => (
                   <div 
                     key={i} 
                     style={{
                       flex: 1,
                       backgroundColor: isSimulatingAttack ? (targetCall?.aiProbability > 50 ? 'var(--status-critical)' : 'var(--brand-primary)') : 'var(--bg-hover)',
                       height: isSimulatingAttack ? `${Math.max(10, Math.random() * 100)}%` : '10%',
                       transition: 'height 0.2s ease',
                       opacity: 0.8
                     }} 
                   />
                ))}
              </div>
            </div>
          </Card>
        </div>
        
      </div>
    </div>
  );
};
