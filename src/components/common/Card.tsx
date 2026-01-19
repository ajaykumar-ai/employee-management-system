import React from 'react';

type Props = React.PropsWithChildren<{
  title?: string;
  right?: React.ReactNode;
  className?: string;
}>;

export const Card: React.FC<Props> = ({ title, right, children, className }) => {
  return (
    <section
      className={className}
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        overflow: 'hidden',
      }}
    >
      {(title || right) && (
        <header
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 14px 12px',
            borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent)',
          }}
        >
          <div style={{ fontWeight: 700 }}>{title}</div>
          <div>{right}</div>
        </header>
      )}
      <div style={{ padding: 14 }}>{children}</div>
    </section>
  );
};

