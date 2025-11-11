import { Link, useLocation } from "react-router-dom";
import { Home, DollarSign, TrendingUp, BarChart3, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Expenses", href: "/expenses", icon: DollarSign },
  { name: "Income", href: "/income", icon: TrendingUp },
  { name: "Bills", href: "/bills", icon: Zap },
  { name: "Family", href: "/family", icon: Users },
];

const NavItem: React.FC<{ item: typeof navItems[0], isActive: boolean }> = ({ item, isActive }) => (
  <Link to={item.href} className="flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors duration-200">
    <div className="relative">
      <item.icon className={cn("h-5 w-5", isActive ? "text-sky-blue" : "text-muted-foreground group-hover:text-primary")} />
      {isActive && (
        <motion.div
          layoutId="active-nav-indicator"
          className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-sky-blue rounded-full"
        />
      )}
    </div>
    <span className={cn(isActive ? "text-primary" : "text-muted-foreground")}>{item.name}</span>
  </Link>
);

const BottomNav = () => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t border-border/50 shadow-[0_-2px_15px_rgba(0,0,0,0.05)] flex items-center justify-around md:hidden z-40"
    >
      {navItems.map((item) => (
        <NavItem key={item.name} item={item} isActive={location.pathname.startsWith(item.href)} />
      ))}
    </motion.div>
  );
};

export default BottomNav;