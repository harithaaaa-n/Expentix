import React from "react";
import { Sidebar } from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Gradient Container */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#E0F7FA] via-[#E3F2FD] to-[#EDE7F6] dark:from-sky-blue/10 dark:via-deep-slate dark:to-lavender-violet/10" />
      
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col w-full md:ml-64">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

export default DashboardLayout;