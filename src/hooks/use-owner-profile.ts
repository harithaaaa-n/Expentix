import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  theme: 'light' | 'dark' | 'system' | null;
}

export const useOwnerProfile = () => {
  const { user, isLoading: isSessionLoading } = useSession();

  return useQuery({
    queryKey: ['ownerProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, theme')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found (new user)
        throw error;
      }
      
      const profile = data as Profile | null;
      
      const ownerName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'You';
      
      return { profile, ownerName };
    },
    enabled: !!user && !isSessionLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};