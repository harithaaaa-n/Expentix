import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { showError } from "@/utils/toast";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const { user } = useSession();

  const saveThemePreference = async (newTheme: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ theme: newTheme, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      showError("Failed to save theme preference: " + error.message);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    saveThemePreference(newTheme);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}