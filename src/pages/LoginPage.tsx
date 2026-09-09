import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/ui';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };
  
  return (
    <Card style={{ padding: 'var(--gap-xxl)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--gap-lg)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--gap-xs)' }}>SOC Access</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Enter your enterprise credentials</p>
      </div>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-xs)' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>WORK EMAIL</label>
          <input type="email" required className="input" placeholder="analyst@organization.com" defaultValue="admin@voicesec.ai" />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-xs)' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>PASSWORD</label>
          <input type="password" required className="input" placeholder="••••••••" defaultValue="password123" />
        </div>
        
        <Button variant="primary" type="submit" style={{ marginTop: 'var(--gap-sm)', padding: 'var(--gap-sm)' }} disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In to Console'}
        </Button>
      </form>
      
      <div style={{ marginTop: 'var(--gap-lg)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Protected by hardware MFA key. Insert key when prompted.
      </div>
    </Card>
  );
};
