import React from 'react';

type Slice = { label: string; value: number; color: string };

export const DonutChart: React.FC<{
  size?: number;
  thickness?: number;
  slices: Slice[];
  centerLabel?: string;
  centerValue?: string;
}> = ({ size = 140, thickness = 16, slices, centerLabel, centerValue }) => {
  const radius = (size - thickness) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * radius;
  const total = Math.max(0, slices.reduce((s, x) => s + Math.max(0, x.value), 0));

  let offset = 0;
  const arcs = slices.map((s) => {
    const v = Math.max(0, s.value);
    const frac = total ? v / total : 0;
    const dash = circumference * frac;
    const arc = (
      <circle
        key={s.label}
        cx={c}
        cy={c}
        r={radius}
        fill="transparent"
        stroke={s.color}
        strokeWidth={thickness}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
      />
    );
    offset += dash + 2; // tiny spacing
    return arc;
  });

  return (
    <div style={{ display: 'grid', placeItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={c} cy={c} r={radius} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth={thickness} />
        <g transform={`rotate(-90 ${c} ${c})`}>{arcs}</g>
      </svg>
      {(centerLabel || centerValue) && (
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          {centerValue && <div style={{ fontSize: 22, fontWeight: 950 }}>{centerValue}</div>}
          {centerLabel && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{centerLabel}</div>}
        </div>
      )}
    </div>
  );
};

