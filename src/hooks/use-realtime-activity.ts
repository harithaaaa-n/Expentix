import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/integrations/supabase/session-context';
import { useOwnerProfile } from './use-owner-profile';
import { format } from 'date-fns';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface ActivityItem {
  id: string;
  timestamp: string;
  message: string;
  type: 'expense' | 'income';
}

// Helper function to format the activity message
const formatActivityMessage = (
  payload: RealtimePostgresChangesPayload<any>,
  ownerName: string,
  members: { id: string, name: string }[]
): string | null => {
  const { eventType, new: newData, old: oldData, table } = payload;
  
  // Explicitly cast to 'any' to allow property access and resolve TS errors
  const newRecord = newData as any;
  const oldRecord = oldData as any;

  const isExpense = table === 'expenses';
  const transactionType = isExpense ? 'expense' : 'income';
  const amount = newRecord?.amount || oldRecord?.amount;
  const title = isExpense ? newRecord?.title || oldRecord?.title : newRecord?.source || oldRecord?.source;
  const memberId = newRecord?.member_id || oldRecord?.member_id;
  const userId = newRecord?.user_id || oldRecord?.user_id;

  if (!amount || !title) return null;

  const member = members.find(m => m.id === memberId);
  const memberName = member ? member.name : ownerName;
  const formattedAmount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  switch (eventType) {
    case 'INSERT':
      return `${memberName} logged a new ${transactionType}: ${title} (${formattedAmount})`;
    case 'UPDATE':
      return `${memberName} updated a ${transactionType}: ${title} (Amount: ${formattedAmount})`;
    case 'DELETE':
      return `${memberName} deleted a ${transactionType}: ${title} (Amount: ${formattedAmount})`;
    default:
      return null;
  }
};

export const useRealtimeActivity = (members: { id: string, name: string }[]) => {
  const { user } = useSession();
  const { data: ownerProfileData } = useOwnerProfile();
  const ownerName = ownerProfileData?.ownerName || 'You';
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);

  const handleRealtimeUpdate = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    if (payload.table !== 'expenses' && payload.table !== 'income') return;
    
    const message = formatActivityMessage(payload, ownerName, members);
    
    if (message) {
      const newItem: ActivityItem = {
        id: `${payload.table}-${payload.eventType}-${Date.now()}`,
        timestamp: format(new Date(), 'HH:mm:ss'),
        message,
        type: payload.table === 'expenses' ? 'expense' : 'income',
      };
      
      setActivityFeed(prev => [newItem, ...prev].slice(0, 10)); // Keep max 10 items
    }
  }, [ownerName, members]);

  useEffect(() => {
    if (!user) return;

    // 1. Subscribe to Expenses
    const expenseChannel = supabase
      .channel('family_expenses_feed')
      .on<any>(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'expenses', 
          filter: `user_id=eq.${user.id}` 
        },
        handleRealtimeUpdate
      )
      .subscribe();

    // 2. Subscribe to Income
    const incomeChannel = supabase
      .channel('family_income_feed')
      .on<any>(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'income', 
          filter: `user_id=eq.${user.id}` 
        },
        handleRealtimeUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(expenseChannel);
      supabase.removeChannel(incomeChannel);
    };
  }, [user, handleRealtimeUpdate]);

  return { activityFeed };
};