import React, { useMemo, useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Field, Select, TextInput } from '../components/common/Field';
import { useAuth } from '../contexts/AuthContext';
import { useHR } from '../contexts/HRContext';
import { daysInMonth, formatMonthLabel, monthKey, pad2, todayYMD } from '../utils/date';

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const { employees, attendance, holidays, clockIn, clockOut } = useHR();

  const today = todayYMD();
  const [date, setDate] = useState(today);
  const [month, setMonth] = useState(monthKey(new Date()));
  const [search, setSearch] = useState('');

  const isOwner = user?.role === 'owner';
  const defaultEmployeeId =
    user && 'id' in user ? user.id : employees.find((e) => e.role === 'employee')?.id ?? employees[0]?.id ?? '';
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId);

  const selectedEmployee = employees.find((e) => e.id === employeeId);
  const recordForDate = attendance.find((a) => a.employeeId === employeeId && a.date === date);

  const holidaySet = useMemo(() => new Set(holidays.filter((h) => h.type === 'holiday').map((h) => h.date)), [holidays]);

  const dailyList = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employees
      .filter((e) => (q ? `${e.name} ${e.designation}`.toLowerCase().includes(q) : true))
      .map((e) => {
      const rec = attendance.find((a) => a.employeeId === e.id && a.date === date);
      return { e, rec };
    });
  }, [employees, attendance, date, search]);

  const monthDays = useMemo(() => {
    const [yy, mm] = month.split('-').map(Number);
    const count = daysInMonth(month);
    return Array.from({ length: count }, (_, i) => `${yy}-${pad2(mm)}-${pad2(i + 1)}`);
  }, [month]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: -0.5 }}>Attendance</div>
          <div style={{ color: 'var(--muted)' }}>Clock in/out, see daily list, and a monthly status view.</div>
        </div>
        <Badge tone="info">Today: {today}</Badge>
      </div>

      <div className="grid cols-2">
        <Card title="In / Out time entry" right={<Badge tone={recordForDate?.inTime ? 'success' : 'warning'}>{recordForDate?.inTime ? 'Marked' : 'Pending'}</Badge>}>
          <div style={{ display: 'grid', gap: 12 }}>
            {isOwner ? (
              <Field label="Employee">
                <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.designation})
                    </option>
                  ))}
                </Select>
              </Field>
            ) : (
              <div style={{ color: 'var(--muted)' }}>
                Marking attendance for: <b>{selectedEmployee?.name ?? employeeId}</b>
              </div>
            )}

            <Field label="Date">
              <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                onClick={() => clockIn(employeeId, date)}
                disabled={holidaySet.has(date)}
              >
                In Time
              </Button>
              <Button onClick={() => clockOut(employeeId, date)} disabled={holidaySet.has(date)}>
                Out Time
              </Button>
              {holidaySet.has(date) && <Badge tone="warning">Holiday</Badge>}
            </div>

            <div style={{ display: 'grid', gap: 8, padding: 12, borderRadius: 14, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ color: 'var(--muted)' }}>In</span>
                <span style={{ fontWeight: 900 }}>{recordForDate?.inTime ?? '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ color: 'var(--muted)' }}>Out</span>
                <span style={{ fontWeight: 900 }}>{recordForDate?.outTime ?? '—'}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Daily attendance list" right={<Badge tone="neutral">{date}</Badge>}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end', marginBottom: 12 }}>
            <Field label="Search employee">
              <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type a name..." />
            </Field>
            <Button variant="ghost" onClick={() => setSearch('')}>Clear</Button>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {dailyList.map(({ e, rec }) => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: 10, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontWeight: 850 }}>{e.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>{e.designation}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                    {rec?.inTime ?? '—'} → {rec?.outTime ?? '—'}
                  </div>
                  <Badge tone={rec?.status === 'present' ? 'success' : holidaySet.has(date) ? 'warning' : 'neutral'}>
                    {holidaySet.has(date) ? 'HOLIDAY' : rec?.status === 'present' ? 'PRESENT' : '—'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          {!dailyList.length && <div style={{ color: 'var(--muted)', marginTop: 10 }}>No matching employees.</div>}
        </Card>
      </div>

      <Card title="Monthly view" right={<Badge tone="info">{formatMonthLabel(month)}</Badge>}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end', marginBottom: 12 }}>
          <Field label="Month (YYYY-MM)">
            <TextInput value={month} onChange={(e) => setMonth(e.target.value)} placeholder="2026-01" />
          </Field>
          <Field label="Employee">
            <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 8 }}>
          {monthDays.map((d) => {
            const rec = attendance.find((a) => a.employeeId === employeeId && a.date === d);
            const isHol = holidaySet.has(d);
            const tone: 'warning' | 'success' | 'neutral' = isHol ? 'warning' : rec?.status === 'present' ? 'success' : 'neutral';
            return (
              <div key={d} style={{ padding: 10, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontWeight: 900 }}>{d.slice(-2)}</div>
                  <Badge tone={tone}>
                    {isHol ? 'H' : rec?.status === 'present' ? 'P' : '-'}
                  </Badge>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 6 }}>
                  {rec?.inTime ?? '—'} / {rec?.outTime ?? '—'}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Attendance;