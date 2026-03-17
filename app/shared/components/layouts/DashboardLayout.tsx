"use client";

import { ReactNode } from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Footer } from '../organisms/Footer';
import { BackgroundPattern } from '../organisms/BackgroundPattern';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <BackgroundPattern>
      <div className="flex min-h-screen bg-transparent">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <main className="flex-1 p-4 md:p-6 md:pt-6 pt-16">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </BackgroundPattern>
  );
};
