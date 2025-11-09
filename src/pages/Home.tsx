import { useSession } from "@/integrations/supabase/session-context";
import Dashboard from "./Dashboard";
import Index from "./Index";
import { Loader2 } from "lucide-react";

const Home = () => {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return user ? <Dashboard /> : <Index />;
};

export default Home;