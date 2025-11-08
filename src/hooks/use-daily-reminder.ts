import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/integrations/supabase/session-context';
import { format } from 'date-fns';

const REMINDER_DISMISS_KEY = 'daily_expense_reminder_dismissed';

export function useDailyReminder() {
  const { user, isLoading: isSessionLoading } = useSession();
  const [needsReminder, setNeedsReminder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const dismissKeyToday = `${REMINDER_DISMISS_KEY}_${today}`;

  // Check local storage for dismissal status
  useEffect(() => {
    const dismissed = localStorage.getItem(dismissKeyToday) === 'true';
    setIsDismissed(dismissed);
  }, [dismissKeyToday]);

  const fetchDailyExpenseStatus = useCallback(async () => {
    if (!user || isDismissed) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Check if any expense was logged today
    const { count, error } = await supabase
      .from('expenses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('expense_date', today);

    if (error) {
      console.error("Error checking daily expenses:", error);
      setNeedsReminder(false);
    } else {
      setNeedsReminder(count === 0);
    }
    setIsLoading(false);
  }, [user, today, isDismissed]);

  useEffect(() => {
    if (user && !isSessionLoading) {
      fetchDailyExpenseStatus();
    }
  }, [user, isSessionLoading, fetchDailyExpenseStatus]);

  const dismissReminder = () => {
    localStorage.setItem(dismissKeyToday, 'true');
    setIsDismissed(true);
    setNeedsReminder(false);
  };

  return {
    needsReminder: needsReminder && !isDismissed,
    isLoading,
    dismissReminder,
  };
}