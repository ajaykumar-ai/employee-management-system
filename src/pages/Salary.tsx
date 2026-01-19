import React, { useMemo, useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Field, Select, TextInput } from '../components/common/Field';
import { useAuth } from '../contexts/AuthContext';
import { selectEmployeeMonthStats, useHR } from '../contexts/HRContext';
import { formatMonthLabel, monthKey } from '../utils/date';

const Salary: React.FC = () => {
  const { user } = useAuth();
  const { employees, salaries, attendance, holidays, leaves } = useHR();
  const isOwner = user?.role === 'owner';

  const [month, setMonth] = useState(monthKey(new Date()));
  const defaultEmployeeId =
    user && 'id' in user ? user.id : employees[0]?.id ?? '';
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId);

  const emp = employees.find((e) => e.id === employeeId);
  const salary = salaries.find((s) => s.employeeId === employeeId && s.month === month);
  const stats = selectEmployeeMonthStats(employeeId, month, attendance, holidays, leaves);

  const dailyRate = useMemo(() => {
    const gross = salary ? salary.base + salary.hra + salary.special : (emp?.salaryMonthly ?? 0);
    return stats.workingDays ? gross / stats.workingDays : 0;
  }, [salary, emp, stats.workingDays]);

  const lop = Math.round(stats.absent * dailyRate);
  const gross = salary ? salary.base + salary.hra + salary.special : 0;
  const deductions = salary ? salary.deductions.pf + salary.deductions.tax + lop : lop;
  const net = gross - deductions;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: -0.5 }}>Salary</div>
          <div style={{ color: 'var(--muted)' }}>Monthly salary breakdown with attendance-linked view.</div>
        </div>
        <Badge tone="info">{formatMonthLabel(month)}</Badge>
      </div>

      <Card title="Select employee & month">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end' }}>
          <Field label="Month (YYYY-MM)">
            <TextInput value={month} onChange={(e) => setMonth(e.target.value)} placeholder="2026-01" />
          </Field>
          <Field label="Employee">
            <Select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              disabled={!isOwner}
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </Select>
          </Field>
          {!isOwner && (
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>
              Tip: Owner can view any employee. Others typically view self (UI demo allows selection only if needed).
            </div>
          )}
        </div>
      </Card>

      <div className="grid cols-2">
        <Card title="Monthly salary breakdown" right={<Badge tone="neutral">{emp?.designation ?? '—'}</Badge>}>
          {salary ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <Row label="Base" value={`₹${salary.base.toLocaleString()}`} />
              <Row label="HRA" value={`₹${salary.hra.toLocaleString()}`} />
              <Row label="Special allowance" value={`₹${salary.special.toLocaleString()}`} />
              <div style={{ height: 1, background: 'var(--border)', margin: '2px 0' }} />
              <Row label="Gross" value={`₹${gross.toLocaleString()}`} strong />
              <div style={{ height: 1, background: 'var(--border)', margin: '2px 0' }} />
              <Row label="PF" value={`₹${salary.deductions.pf.toLocaleString()}`} />
              <Row label="Tax" value={`₹${salary.deductions.tax.toLocaleString()}`} />
              <Row label="LOP (attendance linked)" value={`₹${lop.toLocaleString()}`} />
              <div style={{ height: 1, background: 'var(--border)', margin: '2px 0' }} />
              <Row label="Net Pay" value={`₹${net.toLocaleString()}`} strong />
            </div>
          ) : (
            <div style={{ color: 'var(--muted)' }}>No salary record for {month}.</div>
          )}
        </Card>

        <Card title="Attendance-linked calculation view">
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              <Mini label="Working days" value={stats.workingDays} />
              <Mini label="Present" value={stats.present} />
              <Mini label="Approved leave" value={stats.onLeave} />
              <Mini label="Absent (LOP)" value={stats.absent} />
            </div>

            <div style={{ padding: 12, borderRadius: 14, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>Daily rate (approx.)</div>
              <div style={{ fontSize: 22, fontWeight: 950 }}>₹{Math.round(dailyRate).toLocaleString()}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6 }}>
                LOP = Absent days × Daily rate (weekends + holidays excluded).
              </div>
            </div>

            <div style={{ padding: 12, borderRadius: 14, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ color: 'var(--muted)' }}>LOP deduction</div>
                <Badge tone={lop ? 'warning' : 'success'}>{lop ? `₹${lop.toLocaleString()}` : '₹0'}</Badge>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>
                This is a UI demo; salary and deductions are mock values.
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Payslip-style UI">
        <div style={{ display: 'grid', gap: 12, padding: 14, borderRadius: 16, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 950 }}>{emp?.name ?? 'Employee'}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>{emp?.email ?? ''}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>Month</div>
              <div style={{ fontWeight: 900 }}>{formatMonthLabel(month)}</div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border)' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 14, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontWeight: 950, marginBottom: 10 }}>Earnings</div>
              <Row label="Base" value={`₹${(salary?.base ?? 0).toLocaleString()}`} />
              <Row label="HRA" value={`₹${(salary?.hra ?? 0).toLocaleString()}`} />
              <Row label="Special" value={`₹${(salary?.special ?? 0).toLocaleString()}`} />
              <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
              <Row label="Gross" value={`₹${gross.toLocaleString()}`} strong />
            </div>
            <div style={{ padding: 12, borderRadius: 14, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontWeight: 950, marginBottom: 10 }}>Deductions</div>
              <Row label="PF" value={`₹${(salary?.deductions.pf ?? 0).toLocaleString()}`} />
              <Row label="Tax" value={`₹${(salary?.deductions.tax ?? 0).toLocaleString()}`} />
              <Row label="LOP" value={`₹${lop.toLocaleString()}`} />
              <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
              <Row label="Total deductions" value={`₹${deductions.toLocaleString()}`} strong />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>Net payable</div>
            <div style={{ fontSize: 22, fontWeight: 950 }}>₹{net.toLocaleString()}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontWeight: strong ? 950 : 650 }}>
    <span style={{ color: strong ? 'var(--text)' : 'var(--muted)' }}>{label}</span>
    <span>{value}</span>
  </div>
);

const Mini: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div style={{ padding: 12, borderRadius: 14, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
    <div style={{ color: 'var(--muted)', fontSize: 12 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 950 }}>{value}</div>
  </div>
);

export default Salary;