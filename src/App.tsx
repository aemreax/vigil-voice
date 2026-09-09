import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SimulationProvider } from './context/SimulationContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Overview } from './pages/Overview';
import { LiveCallMonitor } from './pages/LiveCallMonitor';
import { AttackSimulator } from './pages/AttackSimulator';
import { VoiceAnalysis } from './pages/VoiceAnalysis';

// Placeholder for other pages
const Placeholder = ({ title }: { title: string }) => (
  <div style={{ padding: 'var(--gap-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
    <h2 style={{ marginBottom: 'var(--gap-md)' }}>{title}</h2>
    <p>This module is part of the complete SOC platform design system.</p>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <SimulationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/live" element={<LiveCallMonitor />} />
              <Route path="/attack-simulator" element={<AttackSimulator />} />
              <Route path="/voice-analysis" element={<VoiceAnalysis />} />
              
              <Route path="/risk" element={<Placeholder title="Risk Intelligence" />} />
              <Route path="/alerts" element={<Placeholder title="Alerts Center" />} />
              <Route path="/investigations" element={<Placeholder title="Investigations" />} />
              <Route path="/history" element={<Placeholder title="Call History" />} />
              <Route path="/fraud" element={<Placeholder title="Fraud Intelligence" />} />
              <Route path="/contacts" element={<Placeholder title="Contacts & Identity" />} />
              <Route path="/workflows" element={<Placeholder title="Workflow Builder" />} />
              <Route path="/analytics" element={<Placeholder title="Analytics" />} />
              <Route path="/privacy" element={<Placeholder title="Privacy & Compliance" />} />
              <Route path="/api" element={<Placeholder title="API & Integrations" />} />
              <Route path="/health" element={<Placeholder title="System Health" />} />
              <Route path="/settings" element={<Placeholder title="Settings" />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SimulationProvider>
    </ThemeProvider>
  );
}
