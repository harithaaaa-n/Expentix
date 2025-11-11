import { useSession } from "@/integrations/supabase/session-context";
import Index from "./Index";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If logged in, redirect to /dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If logged out, show landing page
  return (
    <>
      <Helmet>
        <title>Expentix — Spend Smarter. Live Better.</title>
      </Helmet>
      <Index />
    </>
  );
};

export default Home;