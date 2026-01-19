import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  small?: boolean;
};

export const Button: React.FC<Props> = ({ variant = 'secondary', small, style, ...props }) => {
  const bg =
    variant === 'primary'
      ? 'rgba(110, 168, 254, 0.22)'
      : variant === 'danger'
        ? 'rgba(255, 107, 107, 0.18)'
        : variant === 'ghost'
          ? 'transparent'
          : 'rgba(255, 255, 255, 0.08)';

  const border =
    variant === 'primary'
      ? 'rgba(110, 168, 254, 0.45)'
      : variant === 'danger'
        ? 'rgba(255, 107, 107, 0.45)'
        : 'var(--border)';

  return (
    <button
      {...props}
      style={{
        padding: small ? '8px 10px' : '10px 12px',
        borderRadius: '12px',
        border: `1px solid ${border}`,
        background: bg,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.55 : 1,
        transition: 'transform 120ms ease, background 120ms ease',
        ...style,
      }}
      onMouseDown={(e) => {
        props.onMouseDown?.(e);
        if (props.disabled) return;
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        props.onMouseUp?.(e);
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        props.onMouseLeave?.(e);
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    />
  );
};

