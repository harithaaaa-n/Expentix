import { useSession } from "@/integrations/supabase/session-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  totalBalance: number;
}

const Header: React.FC<HeaderProps> = ({ totalBalance }) => {
  const { user } = useSession();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError("Failed to log out: " + error.message);
    } else {
      showSuccess("Logged out successfully!");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 md:ml-64">
      <div className="flex items-center gap-4">
        {isMobile && <h1 className="text-xl font-bold">Dashboard</h1>}
        {!isMobile && <h1 className="text-xl font-semibold">Dashboard</h1>}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Balance is now visible on all screen sizes */}
        <div className="text-sm sm:text-lg font-bold text-primary">
          Balance: <span className={totalBalance >= 0 ? "text-green-600" : "text-destructive"}>
            {formatCurrency(totalBalance)}
          </span>
        </div>

        {/* Theme Toggle is now always visible in the header */}
        <div>
          <ThemeToggle />
        </div>

        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>

        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut className="h-5 w-5 text-destructive" />
        </Button>
      </div>
    </header>
  );
};

export default Header;