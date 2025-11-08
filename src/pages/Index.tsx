import { useSession } from "@/integrations/supabase/session-context";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import LandingPage from "@/components/landing/LandingPage.tsx";

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
    <LandingPage />
  );
};

export default Index;