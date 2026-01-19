import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 12,
    border: `1px solid ${isActive ? 'rgba(110,168,254,0.45)' : 'transparent'}`,
    background: isActive ? 'rgba(110,168,254,0.14)' : 'transparent',
    color: 'var(--text)',
  });
  return (
    <aside
      style={{
        width: 260,
        padding: 14,
        borderRight: '1px solid var(--border)',
        position: 'sticky',
        top: 66,
        alignSelf: 'flex-start',
        height: 'calc(100vh - 66px)',
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 800, margin: '6px 6px 8px' }}>
          MENU
        </div>
        <NavLink to="/dashboard" style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/attendance" style={linkStyle}>
          Attendance
        </NavLink>
        <NavLink to="/leave" style={linkStyle}>
          Leave
        </NavLink>
        <NavLink to="/holidays" style={linkStyle}>
          Holidays & Calendar
        </NavLink>
        <NavLink to="/salary" style={linkStyle}>
          Salary
        </NavLink>

        {user?.role === 'owner' && (
          <div style={{ marginTop: 10, padding: 12, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--panel)' }}>
            <div style={{ fontWeight: 900, marginBottom: 4 }}>Owner tools</div>
            <div style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.4 }}>
              Approvals and totals are visible in Dashboard/Leave modules.
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;