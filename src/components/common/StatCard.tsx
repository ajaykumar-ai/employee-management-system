import React from 'react';
import { Card } from './Card';

export const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  hint?: string;
  right?: React.ReactNode;
}> = ({ label, value, hint, right }) => {
  return (
    <Card
      title={label}
      right={right}
      className="stat"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>{value}</div>
        {hint && <div style={{ color: 'var(--muted)', fontSize: 13 }}>{hint}</div>}
      </div>
    </Card>
  );
};

