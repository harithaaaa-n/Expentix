import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/integrations/supabase/session-context';

export function useInitialTheme() {
  const { user, isLoading: isSessionLoading } = useSession();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (user && !isSessionLoading) {
      const fetchAndApplyTheme = async () => {
        // Check if theme is already set by localStorage (next-themes default behavior)
        // If not, fetch from DB
        if (theme === undefined) {
          const { data, error } = await supabase
            .from('profiles')
            .select('theme')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error("Failed to fetch theme preference:", error);
          } else if (data?.theme) {
            // Apply the theme from the database
            setTheme(data.theme as 'light' | 'dark' | 'system');
          }
        }
      };
      fetchAndApplyTheme();
    }
  }, [user, isSessionLoading, theme, setTheme]);
}