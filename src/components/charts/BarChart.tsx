import React from 'react';

export type Bar = { label: string; value: number; color?: string };

export const BarChart: React.FC<{
  bars: Bar[];
  height?: number;
  valueFormatter?: (n: number) => string;
}> = ({ bars, height = 140, valueFormatter }) => {
  const max = Math.max(1, ...bars.map((b) => Math.max(0, b.value)));
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))`, gap: 10, alignItems: 'end', height }}>
        {bars.map((b) => {
          const pct = (Math.max(0, b.value) / max) * 100;
          const color = b.color ?? 'rgba(110,168,254,0.55)';
          return (
            <div key={b.label} style={{ display: 'grid', gap: 8 }}>
              <div
                title={valueFormatter ? valueFormatter(b.value) : String(b.value)}
                style={{
                  height: `${pct}%`,
                  borderRadius: 12,
                  background: `linear-gradient(180deg, ${color}, rgba(255,255,255,0.02))`,
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow)',
                  minHeight: 8,
                }}
              />
              <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{b.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {bars.map((b) => (
          <div key={b.label} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: b.color ?? 'rgba(110,168,254,0.55)' }} />
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>
              {b.label}: <b style={{ color: 'var(--text)' }}>{valueFormatter ? valueFormatter(b.value) : b.value}</b>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

