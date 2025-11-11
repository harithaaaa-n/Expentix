import { Link, useLocation } from "react-router-dom";
import { Home, DollarSign, TrendingUp, BarChart3, Users, Settings, Menu, Zap, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Expenses", href: "/expenses", icon: DollarSign },
  { name: "Income", href: "/income", icon: TrendingUp },
  { name: "Essential Bills", href: "/bills", icon: Zap },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Family", href: "/family", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

const SidebarContent = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col gap-2 p-4 h-full">
      <div className="flex h-16 items-center px-2 mb-4">
        <Link to="/" className="flex items-center gap-2 filter drop-shadow-[0_0_8px_rgba(58,134,255,0.4)]">
          <Wallet className="h-8 w-8 text-sky-blue" />
          <h1 className="text-2xl font-bold text-deep-slate dark:text-primary">Expentix</h1>
        </Link>
      </div>
      <nav className="grid gap-1 flex-grow">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 text-base font-medium",
                isActive
                  ? "bg-gradient-to-r from-sky-blue to-lavender-violet text-white shadow-[0_0_20px_theme(colors.sky-blue/40%)]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col h-screen w-64 border-r border-sidebar-border/50 bg-sidebar/60 backdrop-blur-lg fixed top-0 left-0">
      <SidebarContent />
    </div>
  );
};