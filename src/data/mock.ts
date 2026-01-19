import type { Employee, Holiday, LeaveRequest, SalaryMonth } from '../types/hr';
import { monthKey, todayYMD } from '../utils/date';

export const TEAMS: Record<string, string> = {
  t1: 'Platform',
  t2: 'Design',
  t3: 'Sales',
};

export const EMPLOYEES: Employee[] = [
  {
    id: 'e101',
    name: 'Ajay Kumar',
    role: 'team_lead',
    teamId: 't1',
    designation: 'Team Lead (Platform)',
    email: 'ajay.tl@ems.local',
    salaryMonthly: 90000,
  },
  {
    id: 'e102',
    name: 'Riya Sharma',
    role: 'employee',
    teamId: 't1',
    designation: 'Frontend Developer',
    email: 'riya@ems.local',
    salaryMonthly: 65000,
  },
  {
    id: 'e103',
    name: 'Mohit Verma',
    role: 'employee',
    teamId: 't1',
    designation: 'Backend Developer',
    email: 'mohit@ems.local',
    salaryMonthly: 70000,
  },
  {
    id: 'e201',
    name: 'Sara Khan',
    role: 'team_lead',
    teamId: 't2',
    designation: 'Team Lead (Design)',
    email: 'sara.tl@ems.local',
    salaryMonthly: 88000,
  },
  {
    id: 'e202',
    name: 'Aman Singh',
    role: 'employee',
    teamId: 't2',
    designation: 'Product Designer',
    email: 'aman@ems.local',
    salaryMonthly: 62000,
  },
];

export const HOLIDAYS: Holiday[] = [
  { id: 'h1', date: '2026-01-26', name: 'Republic Day', type: 'holiday' },
  { id: 'h2', date: '2026-03-08', name: 'Holi', type: 'holiday' },
  { id: 'h3', date: '2026-08-15', name: 'Independence Day', type: 'holiday' },
  { id: 'rh1', date: '2026-02-14', name: 'Restricted Holiday: Family Day', type: 'restricted' },
];

export const SEED_LEAVES: LeaveRequest[] = [
  {
    id: 'l1',
    employeeId: 'e102',
    from: todayYMD(),
    to: todayYMD(),
    type: 'casual',
    reason: 'Personal work',
    status: 'pending',
  },
  {
    id: 'l2',
    employeeId: 'e103',
    from: '2026-01-10',
    to: '2026-01-12',
    type: 'sick',
    reason: 'Fever',
    status: 'approved',
    reviewedBy: 'owner',
    reviewedAt: new Date().toISOString(),
    comments: 'Take care.',
  },
];

export function buildSeedSalary(employeeId: string): SalaryMonth {
  const emp = EMPLOYEES.find((e) => e.id === employeeId);
  const base = emp?.salaryMonthly ?? 60000;
  const month = monthKey(new Date());
  return {
    employeeId,
    month,
    base,
    hra: Math.round(base * 0.25),
    special: Math.round(base * 0.15),
    deductions: {
      pf: Math.round(base * 0.12),
      tax: Math.round(base * 0.08),
      lop: 0,
    },
  };
}

