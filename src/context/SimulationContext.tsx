import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThreatLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Call {
  id: string;
  callerId: string;
  destination: string;
  location: string;
  duration: number;
  networkType: string;
  aiProbability: number;
  humanProbability: number;
  riskScore: number;
  threatLevel: ThreatLevel;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED' | 'REQUIRED';
  status: 'ACTIVE' | 'ENDED' | 'BLOCKED';
  language: string;
  transaction?: {
    amount: number;
    type: string;
    status: 'PENDING' | 'APPROVED' | 'BLOCKED';
  };
  events: CallEvent[];
}

export interface CallEvent {
  timestamp: number;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
}

interface SimulationContextType {
  activeCalls: Call[];
  alerts: CallEvent[];
  startAttackSimulation: (type: string) => void;
  isSimulatingAttack: boolean;
  blockTransaction: (callId: string) => void;
  requireVerification: (callId: string) => void;
  systemHealth: {
    inferenceLatency: number;
    cpu: number;
    modelAvailability: number;
  };
  analytics: {
    callsAnalyzed: number;
    aiDetected: number;
    prevented: number;
  };
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const INITIAL_CALLS: Call[] = [
  {
    id: 'VC-10024', callerId: '+91 98765 43210', destination: 'HDFC Support', location: 'Mumbai, MH',
    duration: 145, networkType: 'VoLTE', aiProbability: 2.1, humanProbability: 97.9,
    riskScore: 12, threatLevel: 'SAFE', verificationStatus: 'VERIFIED', status: 'ACTIVE', language: 'Hindi',
    events: [{ timestamp: Date.now() - 145000, message: 'Call started', type: 'INFO' }]
  },
  {
    id: 'VC-10025', callerId: '+91 91234 56789', destination: 'SBI Branch', location: 'Delhi, DL',
    duration: 45, networkType: 'VoIP', aiProbability: 45.2, humanProbability: 54.8,
    riskScore: 58, threatLevel: 'MEDIUM', verificationStatus: 'PENDING', status: 'ACTIVE', language: 'English',
    events: [{ timestamp: Date.now() - 45000, message: 'Call started', type: 'INFO' }]
  },
  {
    id: 'VC-10026', callerId: '+91 88888 12345', destination: 'ICICI Retail', location: 'Bengaluru, KA',
    duration: 312, networkType: 'VoLTE', aiProbability: 1.5, humanProbability: 98.5,
    riskScore: 8, threatLevel: 'SAFE', verificationStatus: 'VERIFIED', status: 'ACTIVE', language: 'Kannada',
    events: [{ timestamp: Date.now() - 312000, message: 'Call started', type: 'INFO' }]
  },
  {
    id: 'VC-10027', callerId: '+91 99999 54321', destination: 'Axis Priority', location: 'Chennai, TN',
    duration: 18, networkType: 'VoIP', aiProbability: 72.4, humanProbability: 27.6,
    riskScore: 78, threatLevel: 'HIGH', verificationStatus: 'REQUIRED', status: 'ACTIVE', language: 'Tamil',
    events: [{ timestamp: Date.now() - 18000, message: 'Call started', type: 'INFO' }]
  },
  {
    id: 'VC-10028', callerId: '+91 77777 98765', destination: 'Kotak Wealth', location: 'Pune, MH',
    duration: 89, networkType: 'WiFi-Call', aiProbability: 4.2, humanProbability: 95.8,
    riskScore: 15, threatLevel: 'SAFE', verificationStatus: 'PENDING', status: 'ACTIVE', language: 'Marathi',
    events: [{ timestamp: Date.now() - 89000, message: 'Call started', type: 'INFO' }]
  },
  {
    id: 'VC-10029', callerId: '+91 66666 11223', destination: 'PNB Support', location: 'Lucknow, UP',
    duration: 410, networkType: '3G', aiProbability: 1.1, humanProbability: 98.9,
    riskScore: 5, threatLevel: 'SAFE', verificationStatus: 'VERIFIED', status: 'ACTIVE', language: 'Hindi',
    events: [{ timestamp: Date.now() - 410000, message: 'Call started', type: 'INFO' }]
  },
  {
    id: 'VC-10030', callerId: '+91 55555 44556', destination: 'HDFC Loans', location: 'Kolkata, WB',
    duration: 65, networkType: 'VoLTE', aiProbability: 22.5, humanProbability: 77.5,
    riskScore: 34, threatLevel: 'LOW', verificationStatus: 'PENDING', status: 'ACTIVE', language: 'Bengali',
    events: [{ timestamp: Date.now() - 65000, message: 'Call started', type: 'INFO' }]
  },
  {
    id: 'VC-10031', callerId: '+91 44444 77889', destination: 'SBI Wealth', location: 'Ahmedabad, GJ',
    duration: 124, networkType: 'VoIP', aiProbability: 8.4, humanProbability: 91.6,
    riskScore: 19, threatLevel: 'SAFE', verificationStatus: 'VERIFIED', status: 'ACTIVE', language: 'Gujarati',
    events: [{ timestamp: Date.now() - 124000, message: 'Call started', type: 'INFO' }]
  }
];

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCalls, setActiveCalls] = useState<Call[]>(INITIAL_CALLS);
  const [alerts, setAlerts] = useState<CallEvent[]>([]);
  const [isSimulatingAttack, setIsSimulatingAttack] = useState(false);
  const [attackStep, setAttackStep] = useState(0);
  const [attackCallId, setAttackCallId] = useState<string | null>(null);
  
  const [systemHealth, setSystemHealth] = useState({
    inferenceLatency: 42,
    cpu: 34,
    modelAvailability: 99.98
  });
  
  const [analytics, setAnalytics] = useState({
    callsAnalyzed: 128492,
    aiDetected: 1284,
    prevented: 1250
  });

  // Background random simulation
  useEffect(() => {
    if (isSimulatingAttack) return; // Pause random updates during focused attack demo
    
    const interval = setInterval(() => {
      setActiveCalls(prev => prev.map(call => {
        if (call.status !== 'ACTIVE') return call;
        
        // Randomly fluctuate values slightly
        const newDuration = call.duration + 1;
        
        // Sometimes end calls randomly
        if (Math.random() > 0.98 && call.duration > 30) {
          return { ...call, status: 'ENDED', duration: newDuration };
        }
        
        return { ...call, duration: newDuration };
      }));
      
      // Update health slightly
      setSystemHealth(prev => ({
        ...prev,
        inferenceLatency: 40 + Math.floor(Math.random() * 10),
        cpu: 30 + Math.floor(Math.random() * 15)
      }));
      
    }, 1000);
    return () => clearInterval(interval);
  }, [isSimulatingAttack]);

  // Directed Attack Simulation Engine
  useEffect(() => {
    if (!isSimulatingAttack || !attackCallId) return;
    
    const interval = setInterval(() => {
      setAttackStep(prev => prev + 1);
    }, 2500); // Progress attack every 2.5 seconds
    
    return () => clearInterval(interval);
  }, [isSimulatingAttack, attackCallId]);

  useEffect(() => {
    if (!isSimulatingAttack || !attackCallId) return;
    
    const ts = Date.now();
    setActiveCalls(prev => prev.map(call => {
      if (call.id !== attackCallId) return call;
      
      let updatedCall = { ...call };
      const newEvents = [...call.events];
      
      switch (attackStep) {
        case 1:
          updatedCall.riskScore = 24;
          updatedCall.threatLevel = 'LOW';
          newEvents.push({ timestamp: ts, message: 'Audio stream analyzed', type: 'INFO' });
          break;
        case 2:
          updatedCall.riskScore = 47;
          updatedCall.aiProbability = 34.5;
          updatedCall.humanProbability = 65.5;
          updatedCall.threatLevel = 'MEDIUM';
          newEvents.push({ timestamp: ts, message: 'Acoustic anomaly detected in lower frequencies', type: 'WARNING' });
          break;
        case 3:
          updatedCall.riskScore = 71;
          updatedCall.aiProbability = 68.2;
          updatedCall.humanProbability = 31.8;
          updatedCall.threatLevel = 'HIGH';
          newEvents.push({ timestamp: ts, message: 'Speaker identity mismatch detected', type: 'CRITICAL' });
          break;
        case 4:
          updatedCall.riskScore = 93;
          updatedCall.aiProbability = 96.8;
          updatedCall.humanProbability = 3.2;
          updatedCall.threatLevel = 'CRITICAL';
          updatedCall.transaction = { amount: 850000, type: 'Bank Transfer', status: 'PENDING' };
          newEvents.push({ timestamp: ts, message: 'High-value transaction requested', type: 'CRITICAL' });
          setAlerts(prev => [{ timestamp: ts, message: `CRITICAL: Voice cloning attack detected on ${call.id}`, type: 'CRITICAL' }, ...prev]);
          break;
        case 5:
          updatedCall.verificationStatus = 'REQUIRED';
          newEvents.push({ timestamp: ts, message: 'Secondary verification required by policy', type: 'INFO' });
          break;
        case 6:
          updatedCall.status = 'BLOCKED';
          if (updatedCall.transaction) updatedCall.transaction.status = 'BLOCKED';
          newEvents.push({ timestamp: ts, message: 'Transaction BLOCKED - Attack Prevented', type: 'SUCCESS' });
          setAlerts(prev => [{ timestamp: ts, message: `SUCCESS: Attack prevented on ${call.id}`, type: 'SUCCESS' }, ...prev]);
          setIsSimulatingAttack(false); // End simulation
          setAnalytics(prev => ({
             ...prev, 
             aiDetected: prev.aiDetected + 1,
             prevented: prev.prevented + 1
          }));
          break;
      }
      
      updatedCall.events = newEvents;
      return updatedCall;
    }));
    
  }, [attackStep, isSimulatingAttack, attackCallId]);

  const startAttackSimulation = useCallback((type: string) => {
    const newCallId = 'VC-' + Math.floor(10000 + Math.random() * 90000);
    const newCall: Call = {
      id: newCallId,
      callerId: '+91 ' + Math.floor(7000000000 + Math.random() * 2999999999).toString().replace(/(\d{5})(\d{5})/, '$1 $2'),
      destination: 'Enterprise Support',
      location: 'Bengaluru, KA',
      duration: 0,
      networkType: 'VoIP',
      aiProbability: 5.2,
      humanProbability: 94.8,
      riskScore: 12,
      threatLevel: 'SAFE',
      verificationStatus: 'PENDING',
      status: 'ACTIVE',
      language: 'English',
      events: [{ timestamp: Date.now(), message: 'Call connected', type: 'INFO' }]
    };
    
    setActiveCalls(prev => [newCall, ...prev]);
    setAttackCallId(newCallId);
    setAttackStep(0);
    setIsSimulatingAttack(true);
  }, []);

  const blockTransaction = useCallback((callId: string) => {
    setActiveCalls(prev => prev.map(call => {
      if (call.id === callId) {
        return {
          ...call,
          status: 'BLOCKED',
          transaction: call.transaction ? { ...call.transaction, status: 'BLOCKED' } : undefined,
          events: [...call.events, { timestamp: Date.now(), message: 'Manually blocked by operator', type: 'SUCCESS' }]
        };
      }
      return call;
    }));
  }, []);

  const requireVerification = useCallback((callId: string) => {
    setActiveCalls(prev => prev.map(call => {
      if (call.id === callId) {
        return {
          ...call,
          verificationStatus: 'REQUIRED',
          events: [...call.events, { timestamp: Date.now(), message: 'Manual verification requested', type: 'INFO' }]
        };
      }
      return call;
    }));
  }, []);

  return (
    <SimulationContext.Provider value={{ 
      activeCalls, 
      alerts,
      startAttackSimulation, 
      isSimulatingAttack,
      blockTransaction,
      requireVerification,
      systemHealth,
      analytics
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within SimulationProvider');
  return context;
};
