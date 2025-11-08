import React from "react";
import { Sidebar } from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
  totalBalance: number;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, totalBalance }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex flex-col w-full md:ml-64">
        <Header totalBalance={totalBalance} />
        <main className={isMobile ? "flex-1 p-4 md:p-6 pt-4" : "flex-1 p-4 md:p-6"}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;