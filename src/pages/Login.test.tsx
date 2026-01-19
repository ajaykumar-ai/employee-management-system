import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../contexts/AuthContext';
import { HRProvider } from '../contexts/HRContext';

describe('Login page', () => {
  it('renders the login screen', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <HRProvider>
            <Login />
          </HRProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Employee Management System/i)).toBeInTheDocument();
    expect(screen.getByText(/Login as Owner/i)).toBeInTheDocument();
  });
});

