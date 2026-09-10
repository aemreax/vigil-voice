import React, { useRef, useState, useEffect } from 'react';
import { Card, CardHeader, Button, Badge } from '../components/ui';
import { useSimulation } from '../context/SimulationContext';
import { Play, Shield, AlertOctagon, Lock, Fingerprint, Crosshair, CheckCircle, Activity, Server, UploadCloud, FileAudio, MoreVertical, Trash2 } from 'lucide-react';

interface LibraryFile {
  id: string;
  name: string;
  fileData: string;
}

export const AttackSimulator = () => {
  const { isSimulatingAttack, startAttackSimulation, activeCalls, alerts, blockTransaction, rdStatus, rdData } = useSimulation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [libraryFiles, setLibraryFiles] = useState<LibraryFile[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const targetCall = activeCalls[0];
  const isAttackPrevented = targetCall?.status === 'BLOCKED';

  // Load from backend on mount
  useEffect(() => {
    fetch('/api/library')
      .then(res => res.json())
      .then(data => setLibraryFiles(data))
      .catch(console.error);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const newFiles = Array.from(fileList);
      
      for (const file of newFiles) {
        // Prevent obvious duplicates in local state
        if (libraryFiles.some(f => f.name === file.name)) continue;

        const reader = new FileReader();
        reader.onloadend = async () => {
          const fileData = reader.result as string;
          const id = Math.random().toString(36).substring(7);
          const newLibFile = { id, name: file.name, fileData };
          
          setLibraryFiles(prev => {
             if (prev.some(f => f.name === file.name)) return prev;
             return [...prev, newLibFile];
          });
          
          await fetch('/api/library', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLibFile)
          }).catch(console.error);
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Reset input safely after a tick so it doesn't interrupt the event
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 100);
  };

  const handleStartClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Command Center: Attack Simulator</h2>
        <div>
          <input 
            type="file" 
            accept="audio/*" 
            multiple
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            style={{ display: 'none' }} 
          />
          <Button 
            variant="primary" 
            icon={UploadCloud}
            onClick={handleStartClick}
          >
            ADD TEST AUDIO
          </Button>
        </div>
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
            <CardHeader title="Model Response" icon={Server} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-sm)', marginTop: 'var(--gap-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Model Status</span>
                <Badge variant={rdStatus === 'CONNECTED' || rdStatus === 'READY' ? 'safe' : rdStatus === 'ERROR' ? 'critical' : rdStatus === 'CONNECTING' ? 'medium' : 'default'}>
                  {rdStatus}
                </Badge>
              </div>
              {rdData && (
                <div style={{ padding: 'var(--gap-sm)', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-base)', fontSize: '0.875rem' }}>
                   <div style={{ color: 'var(--brand-primary)', marginBottom: '4px', fontWeight: 600 }}>LIVE ANALYSIS PAYLOAD:</div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <span>Threat Level:</span>
                     <span style={{ fontWeight: 600, color: 'var(--status-critical)' }}>{rdData.threatLevel}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <span>Engine Confidence:</span>
                     <span style={{ fontFamily: 'var(--font-mono)' }}>{rdData.aiProbability.toFixed(1)}%</span>
                   </div>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Audio Test Library" icon={FileAudio} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'var(--gap-sm)', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
              {libraryFiles.length === 0 ? (
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--gap-md)' }}>
                  No files loaded. Click "Add Test Audio".
                </div>
              ) : (
                libraryFiles.map((file) => (
                  <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-base)', position: 'relative' }}>
                    <span style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }} title={file.name}>
                      {file.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button 
                        onClick={() => { setActiveMenuId(null); startAttackSimulation(file); }}
                        disabled={isSimulatingAttack || rdStatus === 'CONNECTING'}
                        style={{ background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 600, cursor: (isSimulatingAttack || rdStatus === 'CONNECTING') ? 'not-allowed' : 'pointer', opacity: (isSimulatingAttack || rdStatus === 'CONNECTING') ? 0.5 : 1 }}
                      >
                        Analyze
                      </button>
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === file.id ? null : file.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
                      >
                        <MoreVertical size={16} color="var(--text-secondary)" />
                      </button>
                    </div>
                    
                    {activeMenuId === file.id && (
                      <div style={{ position: 'absolute', top: '100%', right: '0', zIndex: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-base)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '4px', minWidth: '120px' }}>
                        <button 
                          onClick={async () => {
                            setActiveMenuId(null);
                            setLibraryFiles(prev => prev.filter(f => f.id !== file.id));
                            await fetch(`/api/library/${file.id}`, { method: 'DELETE' });
                          }}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'transparent', border: 'none', color: 'var(--status-critical)', cursor: 'pointer', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--status-critical-bg)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

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
