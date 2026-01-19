import React, { useMemo, useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Field, Select, TextInput } from '../components/common/Field';
import { useAuth } from '../contexts/AuthContext';
import { useHR } from '../contexts/HRContext';
import type { HolidayType } from '../types/hr';
import { daysInMonth, formatMonthLabel, monthKey, pad2, shiftMonth, todayYMD, weekdayShortLabels, parseYMD } from '../utils/date';

const Holidays: React.FC = () => {
  const { user } = useAuth();
  const { holidays, addHoliday } = useHR();

  const [month, setMonth] = useState(monthKey(new Date()));
  const [showRestricted, setShowRestricted] = useState(true);
  const [search, setSearch] = useState('');

  const [date, setDate] = useState(todayYMD());
  const [name, setName] = useState('');
  const [type, setType] = useState<HolidayType>('holiday');

  const visibleHolidays = useMemo(() => {
    const q = search.trim().toLowerCase();
    return holidays
      .filter((h) => (showRestricted ? true : h.type === 'holiday'))
      .filter((h) => (q ? `${h.name} ${h.date}`.toLowerCase().includes(q) : true))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [holidays, showRestricted, search]);

  const monthDays = useMemo(() => {
    const [yy, mm] = month.split('-').map(Number);
    const count = daysInMonth(month);
    return Array.from({ length: count }, (_, i) => `${yy}-${pad2(mm)}-${pad2(i + 1)}`);
  }, [month]);

  const weekdayLabels = useMemo(() => weekdayShortLabels(), []);

  const monthStartOffset = useMemo(() => {
    const [yy, mm] = month.split('-').map(Number);
    const first = new Date(yy, mm - 1, 1);
    return first.getDay(); // 0..6
  }, [month]);

  const holidayMap = useMemo(() => {
    const m = new Map<string, { label: string; type: HolidayType }>();
    for (const h of visibleHolidays) m.set(h.date, { label: h.name, type: h.type });
    return m;
  }, [visibleHolidays]);

  const today = todayYMD();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: -0.5 }}>Holidays & Calendar</div>
          <div style={{ color: 'var(--muted)' }}>Holidays list, restricted holidays (RH), and calendar markers.</div>
        </div>
        <Badge tone="info">{formatMonthLabel(month)}</Badge>
      </div>

      <div className="grid cols-2">
        <Card
          title="Calendar view"
          right={
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge tone={showRestricted ? 'info' : 'neutral'}>RH: {showRestricted ? 'Shown' : 'Hidden'}</Badge>
              <Button small onClick={() => setShowRestricted((s) => !s)}>
                Toggle RH
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end', marginBottom: 12 }}>
            <Button small onClick={() => setMonth((m) => shiftMonth(m, -1))}>Prev</Button>
            <Button small onClick={() => setMonth(monthKey(new Date()))}>This month</Button>
            <Button small onClick={() => setMonth((m) => shiftMonth(m, 1))}>Next</Button>
            <Field label="Month (YYYY-MM)" hint="You can also type manually">
              <TextInput value={month} onChange={(e) => setMonth(e.target.value)} placeholder="2026-01" />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 8, marginBottom: 8 }}>
            {weekdayLabels.map((w) => (
              <div key={w} style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 800, textAlign: 'center' }}>{w}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 8 }}>
            {Array.from({ length: monthStartOffset }).map((_, i) => (
              <div key={`sp_${i}`} />
            ))}
            {monthDays.map((d) => {
              const hol = holidayMap.get(d);
              const tone = hol?.type === 'holiday' ? 'warning' : hol?.type === 'restricted' ? 'info' : 'neutral';
              const isToday = d === today;
              const weekend = (() => {
                const dt = parseYMD(d);
                const day = dt.getDay();
                return day === 0 || day === 6;
              })();
              return (
                <div
                  key={d}
                  style={{
                    padding: 10,
                    borderRadius: 12,
                    border: isToday ? '1px solid rgba(110,168,254,0.55)' : '1px solid var(--border)',
                    background: isToday ? 'rgba(110,168,254,0.10)' : weekend ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.18)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontWeight: 900 }}>{d.slice(-2)}</div>
                    {hol ? <Badge tone={tone}>{hol.type === 'holiday' ? 'HOL' : 'RH'}</Badge> : <Badge tone="neutral">—</Badge>}
                  </div>
                  <div title={hol?.label} style={{ color: 'var(--muted)', fontSize: 11, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {hol?.label ?? ''}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Holidays list" right={<Badge tone="neutral">Total: {visibleHolidays.length}</Badge>}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end', marginBottom: 12 }}>
            <Field label="Search holidays">
              <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. Republic, 2026-01..." />
            </Field>
            <Button variant="ghost" onClick={() => setSearch('')}>Clear</Button>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {visibleHolidays.map((h) => (
              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: 10, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.18)' }}>
                <div>
                  <div style={{ fontWeight: 900 }}>{h.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>{h.date}</div>
                </div>
                <Badge tone={h.type === 'holiday' ? 'warning' : 'info'}>{h.type === 'holiday' ? 'HOLIDAY' : 'RH'}</Badge>
              </div>
            ))}
            {!visibleHolidays.length && <div style={{ color: 'var(--muted)' }}>No holidays configured.</div>}
          </div>

          {user?.role === 'owner' && (
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />
              <div style={{ fontWeight: 950, marginBottom: 10 }}>Mark holiday on calendar</div>
              <div style={{ display: 'grid', gap: 10 }}>
                <Field label="Date">
                  <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>
                <Field label="Name">
                  <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Company Offsite" />
                </Field>
                <Field label="Type">
                  <Select value={type} onChange={(e) => setType(e.target.value as HolidayType)}>
                    <option value="holiday">Holiday</option>
                    <option value="restricted">Restricted (RH)</option>
                  </Select>
                </Field>
                <Button
                  variant="primary"
                  disabled={!date || !name.trim()}
                  onClick={() => {
                    addHoliday({ date, name: name.trim(), type });
                    setName('');
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Holidays;