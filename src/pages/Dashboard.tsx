import { useSession } from "@/integrations/supabase/session-context";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, isLoading } = useSession();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError("Failed to log out: " + error.message);
    } else {
      showSuccess("Logged out successfully!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Should be handled by Index.tsx redirect, but good practice to include
    return <p>Redirecting...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard, {user.email}!</h1>
      <p className="mb-6 text-muted-foreground">This is where your expense tracking magic happens.</p>
      
      <Button onClick={handleLogout} variant="destructive">
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;