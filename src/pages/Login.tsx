import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Field, Select, TextInput } from '../components/common/Field';
import { useAuth } from '../contexts/AuthContext';
import { EMPLOYEES, TEAMS } from '../data/mock';

const Login: React.FC = () => {
  const nav = useNavigate();
  const { loginAs, loginAsEmployee, user } = useAuth();
  const [mode, setMode] = useState<'quick' | 'employee'>('quick');
  const [employeeId, setEmployeeId] = useState<string>(EMPLOYEES[0]?.id ?? '');

  const employeeOptions = useMemo(
    () =>
      EMPLOYEES.map((e) => ({
        id: e.id,
        label: `${e.name} — ${e.role === 'team_lead' ? 'Team Lead' : 'Employee'} (${TEAMS[e.teamId] ?? e.teamId})`,
      })),
    []
  );

  // If already logged-in, bounce to dashboard
  React.useEffect(() => {
    if (user) nav('/dashboard', { replace: true });
  }, [user, nav]);

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ width: 'min(980px, 100%)', display: 'grid', gap: 14, gridTemplateColumns: '1.2fr 1fr' }}>
        <Card
          title="Employee Management System"
          right={<span style={{ color: 'var(--muted)', fontSize: 13 }}>UI-only • Mock data</span>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.6 }}>Role-based HR workflows</div>
            <div style={{ color: 'var(--muted)', lineHeight: 1.5 }}>
              Login as <b>Owner</b>, <b>Team Lead</b>, or <b>Employee</b> to see different dashboards and actions
              (attendance, leave approvals, holidays, and salary views).
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
              <Button variant="primary" onClick={() => { loginAs('owner'); nav('/dashboard'); }}>
                Login as Owner (Admin)
              </Button>
              <Button onClick={() => { loginAs('team_lead'); nav('/dashboard'); }}>Login as Team Lead</Button>
              <Button onClick={() => { loginAs('employee'); nav('/dashboard'); }}>Login as Employee</Button>
            </div>
          </div>
        </Card>

        <Card title="Mock Login">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button
                variant={mode === 'quick' ? 'primary' : 'secondary'}
                onClick={() => setMode('quick')}
                style={{ flex: 1 }}
              >
                Quick Roles
              </Button>
              <Button
                variant={mode === 'employee' ? 'primary' : 'secondary'}
                onClick={() => setMode('employee')}
                style={{ flex: 1 }}
              >
                Pick Employee
              </Button>
            </div>

            {mode === 'quick' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Field label="Email">
                  <TextInput value="demo@ems.local" readOnly />
                </Field>
                <Field label="Password">
                  <TextInput value="demo" readOnly />
                </Field>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                  This assignment is UI-only; these fields are just for a realistic login look.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Field label="Employee">
                  <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                    {employeeOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Button
                  variant="primary"
                  onClick={() => {
                    loginAsEmployee(employeeId);
                    nav('/dashboard');
                  }}
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;