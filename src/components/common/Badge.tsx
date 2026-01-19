import React from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export const Badge: React.FC<{ tone?: Tone; children: React.ReactNode }> = ({ tone = 'neutral', children }) => {
  const colors: Record<Tone, { bg: string; border: string }> = {
    neutral: { bg: 'rgba(255,255,255,0.08)', border: 'var(--border)' },
    info: { bg: 'rgba(110,168,254,0.18)', border: 'rgba(110,168,254,0.4)' },
    success: { bg: 'rgba(81,207,102,0.16)', border: 'rgba(81,207,102,0.4)' },
    warning: { bg: 'rgba(255,212,59,0.14)', border: 'rgba(255,212,59,0.4)' },
    danger: { bg: 'rgba(255,107,107,0.16)', border: 'rgba(255,107,107,0.42)' },
  };
  const c = colors[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        borderRadius: 999,
        border: `1px solid ${c.border}`,
        background: c.bg,
        fontSize: 12,
        fontWeight: 650,
        color: 'var(--text)',
      }}
    >
      {children}
    </span>
  );
};

