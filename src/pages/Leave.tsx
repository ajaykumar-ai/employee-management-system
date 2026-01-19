import React, { useMemo, useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Field, Select, TextArea, TextInput } from '../components/common/Field';
import { useAuth } from '../contexts/AuthContext';
import { useHR } from '../contexts/HRContext';
import type { LeaveType } from '../types/hr';
import { todayYMD } from '../utils/date';

const Leave: React.FC = () => {
  const { user } = useAuth();
  const { employees, leaves, applyLeave, reviewLeave } = useHR();
  const isApprover = user?.role === 'owner' || user?.role === 'team_lead';

  const employeeId = user && 'id' in user ? user.id : '';
  const teamId = user && 'teamId' in user ? user.teamId : '';

  const [tab, setTab] = useState<'apply' | 'history' | 'approvals'>(isApprover ? 'approvals' : 'apply');

  const [from, setFrom] = useState(todayYMD());
  const [to, setTo] = useState(todayYMD());
  const [type, setType] = useState<LeaveType>('casual');
  const [reason, setReason] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const myLeaves = useMemo(() => leaves.filter((l) => l.employeeId === employeeId), [leaves, employeeId]);
  const pendingMy = myLeaves.filter((l) => l.status === 'pending').length;

  const approvableLeaves = useMemo(() => {
    const pending = leaves.filter((l) => l.status === 'pending');
    if (user?.role === 'owner') return pending;
    if (user?.role === 'team_lead') {
      const teamMembers = employees.filter((e) => e.teamId === teamId).map((e) => e.id);
      return pending.filter((l) => teamMembers.includes(l.employeeId));
    }
    return [];
  }, [leaves, user, employees, teamId]);

  const filteredMyLeaves = useMemo(() => {
    const q = search.trim().toLowerCase();
    return myLeaves.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (!q) return true;
      return (
        l.reason.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q) ||
        l.from.includes(q) ||
        l.to.includes(q)
      );
    });
  }, [myLeaves, search, statusFilter]);

  const filteredApprovable = useMemo(() => {
    const q = search.trim().toLowerCase();
    return approvableLeaves.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (!q) return true;
      const emp = employees.find((e) => e.id === l.employeeId);
      return (
        l.reason.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q) ||
        l.from.includes(q) ||
        l.to.includes(q) ||
        (emp?.name?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [approvableLeaves, search, statusFilter, employees]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: -0.5 }}>Leave Management</div>
          <div style={{ color: 'var(--muted)' }}>Apply for leave, view history, and approve/reject requests.</div>
        </div>
        <Badge tone={pendingMy ? 'warning' : 'neutral'}>My pending: {pendingMy}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Button variant={tab === 'apply' ? 'primary' : 'secondary'} onClick={() => setTab('apply')}>
          Apply
        </Button>
        <Button variant={tab === 'history' ? 'primary' : 'secondary'} onClick={() => setTab('history')}>
          History
        </Button>
        {isApprover && (
          <Button variant={tab === 'approvals' ? 'primary' : 'secondary'} onClick={() => setTab('approvals')}>
            Approvals
          </Button>
        )}
      </div>

      {(tab === 'history' || tab === 'approvals') && (
        <Card title="Search & filters">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end' }}>
            <Field label="Search" hint="Reason, type, date, (and employee for approvals)">
              <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. sick, 2026-01, personal..." />
            </Field>
            <Field label="Status">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
            </Field>
            <Button variant="ghost" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
              Clear
            </Button>
          </div>
        </Card>
      )}

      {tab === 'apply' && (
        <div className="grid cols-2">
          <Card title="Apply for leave" right={<Badge tone="info">{user?.role === 'owner' ? 'Owner can still apply (demo)' : 'Employee flow'}</Badge>}>
            <div style={{ display: 'grid', gap: 12 }}>
              <Field label="From">
                <TextInput type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </Field>
              <Field label="To">
                <TextInput type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </Field>
              <Field label="Leave type">
                <Select value={type} onChange={(e) => setType(e.target.value as LeaveType)}>
                  <option value="casual">Casual</option>
                  <option value="sick">Sick</option>
                  <option value="earned">Earned</option>
                  <option value="unpaid">Unpaid</option>
                </Select>
              </Field>
              <Field label="Reason">
                <TextArea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Short reason..." />
              </Field>

              <Button
                variant="primary"
                disabled={!employeeId || !from || !to || !reason.trim()}
                onClick={() => {
                  applyLeave({
                    employeeId,
                    from,
                    to,
                    type,
                    reason: reason.trim(),
                  });
                  setReason('');
                  setTab('history');
                }}
              >
                Submit
              </Button>
            </div>
          </Card>

          <Card title="Quick rules (mock)">
            <div style={{ display: 'grid', gap: 10, color: 'var(--muted)', lineHeight: 1.5 }}>
              <div>- Leave balance is not enforced (UI demo).</div>
              <div>- Owner can approve/reject any request.</div>
              <div>- Team Lead can approve/reject requests for their team members.</div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'history' && (
        <Card title="Leave history" right={<Badge tone="neutral">Showing: {filteredMyLeaves.length}/{myLeaves.length}</Badge>}>
          <div style={{ display: 'grid', gap: 10 }}>
            {filteredMyLeaves.map((l) => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: 10, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontWeight: 850 }}>
                    {l.from} → {l.to}{' '}
                    <span style={{ color: 'var(--muted)', fontWeight: 650 }}>({l.type})</span>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>{l.reason}</div>
                  {l.reviewedBy && (
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                      Reviewed by <b>{l.reviewedBy}</b> {l.comments ? `• ${l.comments}` : ''}
                    </div>
                  )}
                </div>
                <Badge
                  tone={l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'danger' : 'warning'}
                >
                  {l.status.toUpperCase()}
                </Badge>
              </div>
            ))}
            {!filteredMyLeaves.length && <div style={{ color: 'var(--muted)' }}>No matching leave requests.</div>}
          </div>
        </Card>
      )}

      {tab === 'approvals' && isApprover && (
        <Card title="Approve / Reject" right={<Badge tone={filteredApprovable.length ? 'warning' : 'success'}>{filteredApprovable.length ? `${filteredApprovable.length} pending` : 'No pending'}</Badge>}>
          <div style={{ display: 'grid', gap: 10 }}>
            {filteredApprovable.map((l) => {
              const emp = employees.find((e) => e.id === l.employeeId);
              return (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: 10, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontWeight: 900 }}>{emp?.name ?? l.employeeId}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {l.from} → {l.to} • {l.type} • {l.reason}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <Badge tone="warning">PENDING</Badge>
                    <Button
                      variant="primary"
                      small
                      onClick={() => reviewLeave(l.id, 'approved', user?.role ?? 'approver', 'Approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      small
                      onClick={() => reviewLeave(l.id, 'rejected', user?.role ?? 'approver', 'Rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
            {!filteredApprovable.length && <div style={{ color: 'var(--muted)' }}>No matching approvals.</div>}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Leave;