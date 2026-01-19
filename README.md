# Employee Management System – Frontend Assignment

Frontend assignment submission for **GrubPac Technology**.  
A role-based Employee Management System UI built using **React + TypeScript**, aligned strictly with the assignment requirements.

🔗 **Live Demo**: https://ems-frontend-ajay.netlify.app  
🔗 **GitHub Repo**: https://github.com/ajaykumar-ai/employee-management-system

---

## Overview

This project implements a **frontend-only Employee Management System** with three user roles:

- **Owner / Admin**
- **Team Lead**
- **Employee**

The application demonstrates role-based dashboards, protected routing, and core HR workflows such as attendance, leave management, holidays, and salary views using **mock data**.

The focus is on:
- clean architecture
- role-based flows
- reusable components
- realistic UI behavior

---

## Features (Assignment Scope)

### Authentication (UI Only)
- Login screen with role-based access
- Protected routes
- Role-based redirection after login
- Session persistence using localStorage

### Role-Based Dashboards
- **Owner / Admin**
  - Total employees
  - Attendance summary
  - Pending leave requests
  - Salary overview
- **Team Lead**
  - Team attendance
  - Team leave requests
  - Team members list
- **Employee**
  - Personal attendance
  - Leave balance
  - Salary summary

### Attendance Management
- In-time / Out-time entry
- Daily attendance list
- Monthly attendance view
- Role-based access control

### Leave Management
- Apply for leave
- Leave history with status
- Approve / reject leaves (Owner & Team Lead)

### Holiday & Calendar
- Calendar view
- Holidays list
- Restricted Holidays (RH)
- Owner can add holidays

### Salary View
- Monthly salary breakdown
- Attendance-linked LOP calculation
- Payslip-style UI

---

## Bonus Enhancements

- Dashboard charts (attendance & salary)
- Search and filters
- Advanced calendar navigation
- Dark / light theme toggle

---

## Technical Approach

- **React + TypeScript** for type safety and maintainability
- **React Context API** for global state (Auth, HR data, Theme)
- **React Router v6** for routing and protected routes
- Modular component structure with separation of concerns
- Mock data persisted using `localStorage`
- Responsive layout with reusable UI components

The solution is intentionally frontend-only, as per assignment instructions.

---

## Project Structure

