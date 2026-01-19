import React from 'react';

export const Field: React.FC<
  React.PropsWithChildren<{
    label: string;
    hint?: string;
  }>
> = ({ label, hint, children }) => {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>{label}</div>
        {hint && <div style={{ color: 'var(--muted)', fontSize: 12 }}>{hint}</div>}
      </div>
      {children}
    </label>
  );
};

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      {...props}
      style={{
        padding: '10px 12px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.22)',
        outline: 'none',
      }}
    />
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => {
  return (
    <select
      {...props}
      style={{
        padding: '10px 12px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.22)',
        outline: 'none',
      }}
    />
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  return (
    <textarea
      {...props}
      style={{
        padding: '10px 12px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.22)',
        outline: 'none',
        minHeight: 90,
        resize: 'vertical',
      }}
    />
  );
};

