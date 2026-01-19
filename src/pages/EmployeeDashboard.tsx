import React from 'react';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { selectEmployeeMonthStats, useHR } from '../contexts/HRContext';
import { formatMonthLabel, monthKey, todayYMD } from '../utils/date';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { attendance, leaves, holidays, salaries } = useHR();
  const today = todayYMD();
  const ym = monthKey(new Date());

  const employeeId = user && 'id' in user ? user.id : '';
  const todayRecord = attendance.find((a) => a.employeeId === employeeId && a.date === today);
  const monthStats = selectEmployeeMonthStats(employeeId, ym, attendance, holidays, leaves);

  const leaveBalance = {
    casual: 12,
    sick: 8,
    earned: 18,
  };
  const usedApproved = leaves
    .filter((l) => l.employeeId === employeeId && l.status === 'approved')
    .length;

  const salary = salaries.find((s) => s.employeeId === employeeId && s.month === ym);
  const gross = salary ? salary.base + salary.hra + salary.special : 0;
  const deductions = salary ? salary.deductions.pf + salary.deductions.tax + salary.deductions.lop : 0;
  const net = gross - deductions;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: -0.5 }}>Employee Dashboard</div>
          <div style={{ color: 'var(--muted)' }}>Your attendance, leave balance, and salary summary.</div>
        </div>
        <Badge tone="info">{formatMonthLabel(ym)}</Badge>
      </div>

      <div className="grid cols-3">
        <StatCard
          label="Personal attendance (today)"
          value={todayRecord?.inTime ? 'Checked-in' : 'Not checked-in'}
          hint={todayRecord?.inTime ? `In: ${todayRecord.inTime}${todayRecord.outTime ? ` • Out: ${todayRecord.outTime}` : ''}` : `Date: ${today}`}
          right={<Badge tone={todayRecord?.inTime ? 'success' : 'warning'}>{todayRecord?.inTime ? 'OK' : 'ACTION'}</Badge>}
        />
        <StatCard label="Leave balance" value={`${leaveBalance.casual + leaveBalance.sick + leaveBalance.earned - usedApproved}`} hint="Total remaining (mock)" />
        <StatCard label="Salary summary" value={`₹${net.toLocaleString()}`} hint="Estimated net pay (mock)" />
      </div>

      <div className="grid cols-2">
        <Card title="This Month - Attendance">
          <div className="grid cols-2">
            <div style={{ padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>Working days</div>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{monthStats.workingDays}</div>
            </div>
            <div style={{ padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>Present</div>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{monthStats.present}</div>
            </div>
            <div style={{ padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>Approved leave</div>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{monthStats.onLeave}</div>
            </div>
            <div style={{ padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>Absent</div>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{monthStats.absent}</div>
            </div>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 10 }}>
            Tip: Use <b>Attendance</b> page to clock in/out.
          </div>
        </Card>

        <Card title="Salary (Payslip summary)">
          {salary ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                <span>Gross</span>
                <span>₹{gross.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                <span>Deductions</span>
                <span>₹{deductions.toLocaleString()}</span>
              </div>
              <div style={{ height: 1, background: 'var(--border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}>
                <span>Net Pay</span>
                <span>₹{net.toLocaleString()}</span>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                Attendance-linked LOP is shown inside the <b>Salary</b> page.
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--muted)' }}>No salary record for {ym}.</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;