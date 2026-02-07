import { ReactNode } from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Footer } from '../organisms/Footer';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-[#fafaf5]">
      <Sidebar children={undefined} />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
};
