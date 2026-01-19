import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { theme, toggle } = useTheme();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
        background: 'color-mix(in srgb, var(--bg) 65%, transparent)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: -0.3 }}>Employee Management</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Role-based UI • Mock data</div>
        </div>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="ghost" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
          <Badge tone="info">
            {user.role === 'owner' ? 'Owner (Admin)' : user.role === 'team_lead' ? 'Team Lead' : 'Employee'}
          </Badge>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 180 }}>
            <div style={{ fontWeight: 750 }}>{user.name}</div>
            {'teamName' in user && <div style={{ color: 'var(--muted)', fontSize: 12 }}>{user.teamName}</div>}
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              nav('/login', { replace: true });
            }}
          >
            Logout
          </Button>
        </div>
      )}
      </div>
    </header>
  );
};

export default Header;