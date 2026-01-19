import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="layout">
        <Sidebar />
        <main className="container" style={{ paddingTop: 18 }}>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;