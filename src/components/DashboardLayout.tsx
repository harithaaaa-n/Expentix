import React from "react";
import { Sidebar } from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col w-full md:ml-64">
        <Header />
        <main className="flex-1 p-4 md:p-6 bg-muted/40 dark:bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;