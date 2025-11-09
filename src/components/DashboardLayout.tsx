import React from "react";
import { Sidebar } from "./Sidebar";
import Header from "./Header";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {/* Background Gradient Container */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#E0F7FA] via-[#E3F2FD] to-[#EDE7F6] dark:from-deep-slate dark:via-gray-900 dark:to-deep-slate" />
      
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col w-full md:ml-64">
          <Header />
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;