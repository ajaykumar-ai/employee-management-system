export type Role = 'owner' | 'team_lead' | 'employee';

export type Employee = {
  id: string;
  name: string;
  role: 'team_lead' | 'employee';
  teamId: string;
  designation: string;
  email: string;
  salaryMonthly: number;
};

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'holiday' | 'weekend';

export type AttendanceRecord = {
  employeeId: string;
  date: string; // YYYY-MM-DD
  inTime?: string; // HH:mm
  outTime?: string; // HH:mm
  status: AttendanceStatus;
};

export type LeaveType = 'casual' | 'sick' | 'earned' | 'unpaid';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveRequest = {
  id: string;
  employeeId: string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  reviewedBy?: string; // userId / role
  reviewedAt?: string; // ISO
  comments?: string;
};

export type HolidayType = 'holiday' | 'restricted';

export type Holiday = {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  type: HolidayType;
};

export type SalaryMonth = {
  employeeId: string;
  month: string; // YYYY-MM
  base: number;
  hra: number;
  special: number;
  deductions: {
    pf: number;
    tax: number;
    lop: number; // loss of pay
  };
};

