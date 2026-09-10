import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Activity, PhoneCall, Mic, AlertTriangle, 
  Search, FileText, History, Users, GitMerge, BarChart2, 
  ShieldCheck, Server, Settings, Bell, User, Moon, Sun, Clock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSimulation } from '../context/SimulationContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: Activity, label: 'Overview' },
  { path: '/live', icon: PhoneCall, label: 'Live Call Monitor' },
  { path: '/attack-simulator', icon: ShieldAlert, label: 'Attack Simulator' },
  { path: '/voice-analysis', icon: Mic, label: 'Voice Analysis' },
  { path: '/risk', icon: AlertTriangle, label: 'Risk Intelligence' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
  { path: '/investigations', icon: Search, label: 'Investigations' },
  { path: '/history', icon: History, label: 'Call History' },
  { path: '/fraud', icon: FileText, label: 'Fraud Intelligence' },
  { path: '/contacts', icon: Users, label: 'Contacts / Identity' },
  { path: '/workflows', icon: GitMerge, label: 'Workflows' },
  { path: '/analytics', icon: BarChart2, label: 'Analytics' },
  { path: '/privacy', icon: ShieldCheck, label: 'Privacy & Compliance' },
  { path: '/api', icon: Server, label: 'API / Integrations' },
  { path: '/health', icon: Activity, label: 'System Health' },
  { path: '/settings', icon: Settings, label: 'Settings' }
];

export const DashboardLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { alerts, activeCalls } = useSimulation();
  const navigate = useNavigate();
  
  const criticalCalls = activeCalls.filter(c => c.threatLevel === 'CRITICAL').length;

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <ShieldAlert color="var(--brand-primary)" />
          <span>Vigil Voice</span>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-sm)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Organization:</span>
              <select className="input" style={{ padding: '4px 8px', width: '200px' }}>
                <option>HDFC Bank - Main</option>
                <option>SBI - North Zone</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-md)' }}>
            <button onClick={toggleTheme} style={{ color: 'var(--text-secondary)' }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="var(--text-secondary)" />
              {(alerts.length > 0 || criticalCalls > 0) && (
                <div style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  backgroundColor: 'var(--status-critical)', color: 'white',
                  fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {alerts.length + criticalCalls}
                </div>
              )}
            </div>
            
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} color="var(--text-secondary)" />
            </div>
          </div>
        </header>
        
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
