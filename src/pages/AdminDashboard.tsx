import React from 'react';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { DonutChart } from '../components/charts/DonutChart';
import { useHR } from '../contexts/HRContext';
import { todayYMD } from '../utils/date';

const AdminDashboard: React.FC = () => {
  const { employees, attendance, leaves, salaries } = useHR();
  const today = todayYMD();

  const totalEmployees = employees.length;
  const presentToday = attendance.filter((a) => a.date === today && a.status === 'present').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'pending').length;
  const approvedLeaves = leaves.filter((l) => l.status === 'approved').length;
  const rejectedLeaves = leaves.filter((l) => l.status === 'rejected').length;

  const payroll = salaries.reduce((sum, s) => sum + (s.base + s.hra + s.special), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: -0.5 }}>Owner Dashboard</div>
          <div style={{ color: 'var(--muted)' }}>High level overview across employees, attendance, leaves, and salary.</div>
        </div>
        <Badge tone="info">Today: {today}</Badge>
      </div>

      <div className="grid cols-4">
        <StatCard label="Total employees" value={totalEmployees} hint="All teams" />
        <StatCard label="Attendance summary" value={`${presentToday}/${totalEmployees}`} hint="Marked present today" />
        <StatCard label="Pending leaves" value={pendingLeaves} hint="Need review" />
        <StatCard label="Salary overview" value={`₹${payroll.toLocaleString()}`} hint="Gross monthly (mock)" />
      </div>

      <div className="grid cols-2">
        <Card title="Recent Leave Requests" right={<Badge tone={pendingLeaves ? 'warning' : 'success'}>{pendingLeaves ? `${pendingLeaves} pending` : 'All clear'}</Badge>}>
          <div style={{ display: 'grid', gap: 10 }}>
            {leaves.slice(0, 6).map((l) => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: 10, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontWeight: 800 }}>
                    {employees.find((e) => e.id === l.employeeId)?.name ?? l.employeeId}{' '}
                    <span style={{ color: 'var(--muted)', fontWeight: 650 }}>({l.type})</span>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                    {l.from} → {l.to} • {l.reason}
                  </div>
                </div>
                <Badge
                  tone={l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'danger' : 'warning'}
                >
                  {l.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Today - Attendance mix" right={<Badge tone="neutral">{presentToday}/{totalEmployees} present</Badge>}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <DonutChart
              slices={[
                { label: 'Present', value: presentToday, color: 'rgba(81,207,102,0.9)' },
                { label: 'Not marked', value: Math.max(0, totalEmployees - presentToday), color: 'rgba(255,255,255,0.22)' },
              ]}
              centerValue={`${Math.round((presentToday / Math.max(1, totalEmployees)) * 100)}%`}
              centerLabel="present"
            />
            <div style={{ display: 'grid', gap: 10, flex: 1, minWidth: 260 }}>
              <div style={{ padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>Leaves (all time)</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                  <Badge tone="warning">Pending: {pendingLeaves}</Badge>
                  <Badge tone="success">Approved: {approvedLeaves}</Badge>
                  <Badge tone="danger">Rejected: {rejectedLeaves}</Badge>
                </div>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                Tip: Approve leaves in <b>Leave</b> and manage holidays in <b>Holidays & Calendar</b>.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;