import { useSession } from "@/integrations/supabase/session-context";
import { Navigate } from "react-router-dom";
import LandingContent from "@/components/LandingContent";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { isLoading, user } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    // Redirect authenticated users to the dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <LandingContent />
      <MadeWithDyad />
    </>
  );
};

export default Index;