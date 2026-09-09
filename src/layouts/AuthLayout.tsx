import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ShieldAlert } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-base)',
      padding: 'var(--gap-lg)'
    }}>
      <div style={{ marginBottom: 'var(--gap-xl)', display: 'flex', alignItems: 'center', gap: 'var(--gap-sm)' }}>
        <ShieldAlert size={32} color="var(--brand-primary)" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Vigil Voice</h1>
      </div>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Outlet />
      </div>
    </div>
  );
};
