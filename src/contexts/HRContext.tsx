import React, { createContext, useContext, useMemo, useState } from 'react';
import type { AttendanceRecord, Employee, Holiday, LeaveRequest, SalaryMonth } from '../types/hr';
import { EMPLOYEES, HOLIDAYS, SEED_LEAVES, buildSeedSalary } from '../data/mock';
import { eachDay, isWeekend, pad2, todayYMD } from '../utils/date';

type HRState = {
  employees: Employee[];
  holidays: Holiday[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  salaries: SalaryMonth[];
};

type HRContextType = HRState & {
  clockIn: (employeeId: string, date?: string, time?: string) => void;
  clockOut: (employeeId: string, date?: string, time?: string) => void;
  applyLeave: (req: Omit<LeaveRequest, 'id' | 'status'>) => void;
  reviewLeave: (id: string, status: 'approved' | 'rejected', reviewer: string, comments?: string) => void;
  addHoliday: (h: Omit<Holiday, 'id'>) => void;
};

const LS_KEY = 'ems.hr.v1';

function nowTimeHHmm() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function loadInitial(): HRState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error('empty');
    const parsed = JSON.parse(raw) as HRState;
    if (!parsed || !Array.isArray(parsed.employees)) throw new Error('invalid');
    return parsed;
  } catch {
    const salaries: SalaryMonth[] = EMPLOYEES.map((e) => buildSeedSalary(e.id));
    return {
      employees: EMPLOYEES,
      holidays: HOLIDAYS,
      attendance: [],
      leaves: SEED_LEAVES,
      salaries,
    };
  }
}

function persist(state: HRState) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

const HRContext = createContext<HRContextType | undefined>(undefined);

export const HRProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<HRState>(() => loadInitial());

  const api = useMemo<HRContextType>(() => {
    const clockIn: HRContextType['clockIn'] = (employeeId, date = todayYMD(), time = nowTimeHHmm()) => {
      setState((prev) => {
        const existingIdx = prev.attendance.findIndex((r) => r.employeeId === employeeId && r.date === date);
        const nextAttendance = [...prev.attendance];
        const base: AttendanceRecord =
          existingIdx >= 0
            ? { ...nextAttendance[existingIdx] }
            : { employeeId, date, status: 'present' };
        base.inTime = base.inTime ?? time;
        base.status = 'present';
        if (existingIdx >= 0) nextAttendance[existingIdx] = base;
        else nextAttendance.push(base);

        const next = { ...prev, attendance: nextAttendance };
        persist(next);
        return next;
      });
    };

    const clockOut: HRContextType['clockOut'] = (employeeId, date = todayYMD(), time = nowTimeHHmm()) => {
      setState((prev) => {
        const existingIdx = prev.attendance.findIndex((r) => r.employeeId === employeeId && r.date === date);
        const nextAttendance = [...prev.attendance];
        const base: AttendanceRecord =
          existingIdx >= 0
            ? { ...nextAttendance[existingIdx] }
            : { employeeId, date, status: 'present' };
        base.outTime = time;
        base.status = 'present';
        if (existingIdx >= 0) nextAttendance[existingIdx] = base;
        else nextAttendance.push(base);

        const next = { ...prev, attendance: nextAttendance };
        persist(next);
        return next;
      });
    };

    const applyLeave: HRContextType['applyLeave'] = (req) => {
      setState((prev) => {
        const nextLeaves: LeaveRequest[] = [
          { ...req, id: uid('leave'), status: 'pending' },
          ...prev.leaves,
        ];
        const next = { ...prev, leaves: nextLeaves };
        persist(next);
        return next;
      });
    };

    const reviewLeave: HRContextType['reviewLeave'] = (id, status, reviewer, comments) => {
      setState((prev) => {
        const nextLeaves = prev.leaves.map((l) =>
          l.id === id
            ? {
                ...l,
                status,
                reviewedBy: reviewer,
                reviewedAt: new Date().toISOString(),
                comments,
              }
            : l
        );
        const next = { ...prev, leaves: nextLeaves };
        persist(next);
        return next;
      });
    };

    const addHoliday: HRContextType['addHoliday'] = (h) => {
      setState((prev) => {
        const nextHolidays: Holiday[] = [{ ...h, id: uid('hol') }, ...prev.holidays];
        const next = { ...prev, holidays: nextHolidays };
        persist(next);
        return next;
      });
    };

    return {
      ...state,
      clockIn,
      clockOut,
      applyLeave,
      reviewLeave,
      addHoliday,
    };
  }, [state]);

  return <HRContext.Provider value={api}>{children}</HRContext.Provider>;
};

export function useHR() {
  const ctx = useContext(HRContext);
  if (!ctx) throw new Error('useHR must be used within HRProvider');
  return ctx;
}

export function selectEmployeeMonthStats(
  employeeId: string,
  ym: string,
  attendance: AttendanceRecord[],
  holidays: Holiday[],
  leaves: LeaveRequest[]
) {
  const daysCount = (() => {
    const [y, m] = ym.split('-').map(Number);
    return new Date(y, m, 0).getDate();
  })();

  const holidaySet = new Set(holidays.filter((h) => h.type === 'holiday').map((h) => h.date));
  const leaveDays = new Set<string>();
  for (const l of leaves) {
    if (l.employeeId !== employeeId) continue;
    if (l.status !== 'approved') continue;
    for (const d of eachDay(l.from, l.to)) leaveDays.add(d);
  }

  let workingDays = 0;
  let present = 0;
  let holiday = 0;
  let onLeave = 0;
  let absent = 0;

  const [yy, mm] = ym.split('-').map(Number);
  for (let day = 1; day <= daysCount; day++) {
    const ymd = `${yy}-${pad2(mm)}-${pad2(day)}`;
    if (isWeekend(ymd)) {
      continue;
    }
    if (holidaySet.has(ymd)) {
      holiday++;
      continue;
    }
    workingDays++;
    if (leaveDays.has(ymd)) {
      onLeave++;
      continue;
    }
    const rec = attendance.find((r) => r.employeeId === employeeId && r.date === ymd);
    if (rec?.status === 'present') present++;
    else absent++;
  }

  return { workingDays, present, holiday, onLeave, absent };
}

