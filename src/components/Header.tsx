import { useSession } from "@/integrations/supabase/session-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useOwnerProfile } from "@/hooks/use-owner-profile";

const Header = () => {
  const { user } = useSession();
  const { data: ownerProfileData } = useOwnerProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError("Failed to log out: " + error.message);
    } else {
      showSuccess("Logged out successfully! Redirecting...");
      navigate('/');
    }
  };

  const userInitials = ownerProfileData?.ownerName ? ownerProfileData.ownerName.substring(0, 2).toUpperCase() : 'U';
  const greetingName = ownerProfileData?.ownerName || user?.email?.split('@')[0];

  const handleProfileClick = () => {
    navigate('/settings');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-4 md:px-6 md:ml-64">
      <div>
        <h1 className="text-xl font-semibold hidden md:block">
          Good Evening, {greetingName} 🌙
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {/* Profile Clickable Area */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleProfileClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleProfileClick();
          }}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={ownerProfileData?.profile?.avatar_url || ''} alt={user?.email} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut className="h-5 w-5 text-destructive" />
        </Button>
      </div>
    </header>
  );
};

export default Header;