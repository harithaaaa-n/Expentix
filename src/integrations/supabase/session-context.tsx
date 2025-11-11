import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { type Session, type User } from "@supabase/supabase-js";
import { supabase } from "./client";
import { showError } from "@/utils/toast";

interface SessionContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        } else if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsLoading(false);
        } else if (event === "INITIAL_SESSION") {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsLoading(false);
        }
      },
    );

    // Fetch initial session manually in case listener misses it (e.g., on page load)
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, user, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(
      "useSession must be used within a SessionContextProvider",
    );
  }
  return context;
};