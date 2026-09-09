import React from 'react';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={clsx('card', className)}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ title: string, action?: React.ReactNode, icon?: LucideIcon }> = ({ title, action, icon: Icon }) => (
  <div className="card-header">
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {Icon && <Icon size={16} color="var(--text-muted)" />}
      <h3 className="card-title">{title}</h3>
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'outline-danger', icon?: LucideIcon }> = ({ children, variant = 'secondary', icon: Icon, className, ...props }) => (
  <button className={clsx('btn', `btn-${variant}`, className)} {...props}>
    {Icon && <Icon size={16} />}
    {children}
  </button>
);

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'safe' | 'low' | 'medium' | 'high' | 'critical' | 'outline' }> = ({ children, variant = 'outline' }) => (
  <span className={clsx('badge', `badge-${variant}`)}>
    {children}
  </span>
);

export const MetricCard: React.FC<{ title: string, value: string | number, change?: string, isPositive?: boolean, icon?: LucideIcon }> = ({ title, value, change, isPositive, icon: Icon }) => (
  <Card className="metric-card">
    <CardHeader title={title} icon={Icon} />
    <div className="metric-value">{value}</div>
    {change && (
      <div className={clsx('metric-change', isPositive ? 'positive' : 'negative')}>
        {isPositive ? '↑' : '↓'} {change}
      </div>
    )}
  </Card>
);

export const ProgressBar: React.FC<{ value: number, max?: number, color?: string }> = ({ value, max = 100, color = 'var(--brand-primary)' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: color, transition: 'width 0.5s ease-out' }} />
    </div>
  );
};
