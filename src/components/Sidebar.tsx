import { Link, useLocation } from "react-router-dom";
import { Home, DollarSign, TrendingUp, BarChart3, Users, Settings, Menu, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="flex items-center">
          <img src="/Gemini_Generated_Image_4yfve64yfve64yfv.png" alt="Expentix Logo" className="h-10" />
        </Link>
      </div>
      <nav className="grid gap-1 flex-grow">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
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
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 flex flex-col bg-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden md:flex flex-col h-screen w-64 border-r bg-sidebar fixed top-0 left-0">
      <SidebarContent />
    </div>
  );
};