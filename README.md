# Employee Management System (Frontend Assignment)

This project implements the UI for the **Frontend Assignment – Employee Management System**:

- **Roles**: Owner (Admin), Team Lead (Sub-admin), Employee
- **Modules (UI-level)**: Authentication (UI only), role-based dashboards, attendance, leave management, holidays/calendar, salary view
- **Data**: Mock data + mock state persisted to `localStorage` (no backend required)

## Tech Stack

- **React (Create React App) + TypeScript**
- **React Router**
- **Context** for basic state management (`AuthContext`, `HRContext`)

## Setup

```bash
npm install
npm start
```

Open the app at `http://localhost:3000`.

## Demo Login (Mock)

On `/login` you can:

- **Login as Owner (Admin)**: full overview + leave approvals + can add holidays
- **Login as Team Lead**: team overview + team leave approvals
- **Login as Employee**: personal attendance + leave history + salary summary

You can also pick a specific employee from the “Pick Employee” tab (still mock).

## What’s Implemented (per assignment)

### Authentication (UI only)

- Login screen
- Role-based redirection to `/dashboard`
- Protected pages via `ProtectedRoute`

### Dashboards (role-based)

- **Owner/Admin**: total employees, attendance summary, pending leaves, salary overview
- **Team Lead**: team attendance, team leave requests, team members list
- **Employee**: personal attendance, leave balance (mock), salary summary

### Attendance System

- In time / Out time entry (for self, or any employee as Owner)
- Daily attendance list
- Monthly view grid

### Leave Management

- Apply for leave
- Leave history
- Approve / reject leaves (Owner & Team Lead)

### Holiday & Calendar

- Calendar view
- Holidays list
- Restricted holidays (RH) toggle
- Owner can mark/add holidays

### Salary View

- Monthly salary breakdown
- Attendance-linked calculation (LOP)
- Payslip-style UI

## Folder Structure (high-level)

- `src/pages/` — route-level pages (Dashboard modules, Login, etc.)
- `src/components/` — layout + reusable UI components
- `src/contexts/` — `AuthContext` + `HRContext` (mock state & actions)
- `src/data/` — mock seed data
- `src/types/` — shared TypeScript types
- `src/utils/` — small helpers (dates, etc.)
- `src/styles/` — global styling

## Notes

- This is intentionally **UI-first** (no real auth backend).
- Mock state is persisted in `localStorage`:
  - `ems.auth.v1` (current session)
  - `ems.hr.v1` (attendance/leaves/holidays/salary mock data)

## Bonus Features (Optional)

- ✅ **Charts & summaries**: Donut charts for attendance, bar charts for salary breakdowns
- ✅ **Advanced calendar UI**: Month navigation, weekday headers, today highlight
- ✅ **Filters & search**: Search/filter for leave lists, attendance, holidays
- ✅ **Dark mode**: Theme toggle (dark/light) with persisted preference

## Production Build & Deployment

### Build

```bash
npm run build
```

This creates an optimized `build/` folder ready for deployment.

### Deploy to Netlify (Fastest)

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the `build` folder
3. Your site is live instantly!

### Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub (or email)
3. Click "Add New Project"
4. Import your GitHub repo (or drag `build` folder)
5. Deploy

### Test Locally

```bash
npm install -g serve
serve -s build
```

Then open `http://localhost:3000`
