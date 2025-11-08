import { Link } from "react-router-dom";
import { Home, DollarSign, TrendingUp, BarChart3, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Add Expense", href: "/expenses/add", icon: DollarSign },
  { name: "Income", href: "/income", icon: TrendingUp },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  name: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, name }) => {
  const isActive = location.pathname === href;
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="h-5 w-5" />
      {name}
    </Link>
  );
};

const SidebarContent = () => (
  <div className="flex flex-col gap-2 p-4 h-full">
    <div className="text-lg font-semibold text-sidebar-primary mb-4">
      Navigation
    </div>
    <nav className="grid gap-1 flex-grow">
      {navItems.map((item) => (
        <NavItem key={item.name} {...item} />
      ))}
    </nav>
    <div className="mt-auto pt-4 border-t border-sidebar-border flex justify-center">
      <ThemeToggle />
    </div>
  </div>
);

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
        <SheetContent side="left" className="p-0 w-64 flex flex-col">
          <div className="flex h-16 items-center border-b border-sidebar-border px-4">
            <h1 className="text-xl font-bold text-sidebar-primary">
              HomeExpense+
            </h1>
          </div>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden md:flex flex-col h-screen w-64 border-r bg-sidebar fixed top-0 left-0">
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <h1 className="text-xl font-bold text-sidebar-primary">
          HomeExpense+
        </h1>
      </div>
      <SidebarContent />
    </div>
  );
};