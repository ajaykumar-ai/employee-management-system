import React from 'react';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { BarChart } from '../components/charts/BarChart';
import { useAuth } from '../contexts/AuthContext';
import { useHR } from '../contexts/HRContext';
import { todayYMD } from '../utils/date';

const TeamLeadDashboard: React.FC = () => {
  const { user } = useAuth();
  const { employees, attendance, leaves } = useHR();
  const today = todayYMD();

  const teamId = user && 'teamId' in user ? user.teamId : '';
  const teamMembers = employees.filter((e) => e.teamId === teamId);
  const teamPresentToday = attendance.filter(
    (a) => a.date === today && a.status === 'present' && teamMembers.some((m) => m.id === a.employeeId)
  ).length;
  const teamPendingLeaves = leaves.filter(
    (l) => l.status === 'pending' && teamMembers.some((m) => m.id === l.employeeId)
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: -0.5 }}>Team Lead Dashboard</div>
          <div style={{ color: 'var(--muted)' }}>Quick view of your team attendance and leave approvals.</div>
        </div>
        <Badge tone="info">Today: {today}</Badge>
      </div>

      <div className="grid cols-3">
        <StatCard
          label="Team attendance"
          value={`${teamPresentToday}/${teamMembers.length}`}
          hint="Marked present today"
        />
        <StatCard label="Team leave requests" value={teamPendingLeaves} hint="Pending approvals" />
        <StatCard label="Team members" value={teamMembers.length} hint="Direct team" />
      </div>

      <div className="grid cols-2">
        <Card title="Team Members List" right={<Badge tone="neutral">{teamId}</Badge>}>
          <div style={{ display: 'grid', gap: 10 }}>
            {teamMembers.map((m) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: 10, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
                <div>
                  <div style={{ fontWeight: 850 }}>{m.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>{m.designation}</div>
                </div>
                <Badge tone={m.role === 'team_lead' ? 'info' : 'neutral'}>{m.role === 'team_lead' ? 'TL' : 'EMP'}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Pending Leave Requests" right={<Badge tone={teamPendingLeaves ? 'warning' : 'success'}>{teamPendingLeaves ? `${teamPendingLeaves} pending` : 'No pending'}</Badge>}>
          <div style={{ display: 'grid', gap: 10 }}>
            {leaves
              .filter((l) => l.status === 'pending' && teamMembers.some((m) => m.id === l.employeeId))
              .slice(0, 6)
              .map((l) => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: 10, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
                  <div>
                    <div style={{ fontWeight: 850 }}>{employees.find((e) => e.id === l.employeeId)?.name ?? l.employeeId}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {l.from} → {l.to} • {l.type}
                    </div>
                  </div>
                  <Badge tone="warning">PENDING</Badge>
                </div>
              ))}
            {!teamPendingLeaves && <div style={{ color: 'var(--muted)' }}>Nothing pending right now.</div>}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 10 }}>
            Tip: Go to <b>Leave</b> to approve/reject.
          </div>
        </Card>
      </div>

      <Card title="Team attendance (quick chart)" right={<Badge tone="neutral">{today}</Badge>}>
        <BarChart
          bars={[
            { label: 'Present', value: teamPresentToday, color: 'rgba(81,207,102,0.75)' },
            { label: 'Not marked', value: Math.max(0, teamMembers.length - teamPresentToday), color: 'rgba(255,255,255,0.22)' },
          ]}
        />
      </Card>
    </div>
  );
};

export default TeamLeadDashboard;