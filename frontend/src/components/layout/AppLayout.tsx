import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <TopBar />
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;