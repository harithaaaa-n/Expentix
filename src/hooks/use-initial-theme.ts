import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/integrations/supabase/session-context';

const isNightTime = () => {
  const hour = new Date().getHours();
  // Dark between 7 PM (19) and 7 AM (7)
  return hour >= 19 || hour < 7;
};

export function useInitialTheme() {
  const { user, isLoading: isSessionLoading } = useSession();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (user && !isSessionLoading) {
      const fetchAndApplyTheme = async () => {
        // 1. Check Database preference
        const { data, error } = await supabase
          .from('profiles')
          .select('theme')
          .eq('id', user.id)
          .single();

        let dbTheme: 'light' | 'dark' | 'system' | null = null;

        if (error && error.code !== 'PGRST116') {
          console.error("Failed to fetch theme preference:", error);
        } else if (data?.theme) {
          dbTheme = data.theme as 'light' | 'dark' | 'system';
        }

        // 2. Apply DB theme if available and different from current theme
        if (dbTheme && dbTheme !== theme) {
          setTheme(dbTheme);
          return;
        }
        
        // 3. Time-based fallback (Only if no preference is stored in localStorage/DB)
        // next-themes uses localStorage key 'vite-ui-theme'
        const storedTheme = localStorage.getItem('vite-ui-theme');
        
        if (!storedTheme && !dbTheme) {
             // If no preference is stored anywhere, apply time-based default
             const fallbackTheme = isNightTime() ? 'dark' : 'light';
             if (fallbackTheme !== theme) {
                setTheme(fallbackTheme);
             }
        }
      };
      fetchAndApplyTheme();
    }
  }, [user, isSessionLoading, theme, setTheme]);
}