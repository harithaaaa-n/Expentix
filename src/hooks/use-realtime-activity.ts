import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/integrations/supabase/session-context';
import { useOwnerProfile } from './use-owner-profile';
import { format, parseISO } from 'date-fns';
import { type RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface ActivityItem {
  id: string;
  timestamp: string;
  message: string;
  type: 'expense' | 'income';
  created_at: string; // Used for sorting
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

// Helper function to format initial fetched records
const formatInitialRecord = (record: any, type: 'expense' | 'income', ownerName: string, members: { id: string, name: string }[]): ActivityItem => {
  const isExpense = type === 'expense';
  const title = isExpense ? record.title : record.source;
  const member = members.find(m => m.id === record.member_id);
  const memberName = member ? member.name : ownerName;
  const formattedAmount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(record.amount);
  
  const message = `${memberName} logged a ${type}: ${title} (${formattedAmount})`;
  
  return {
    id: `${type}-${record.id}`,
    timestamp: format(parseISO(record.created_at), 'HH:mm:ss'),
    message,
    type,
    created_at: record.created_at,
  };
};

const fetchInitialActivity = async (userId: string, ownerName: string, members: { id: string, name: string }[]): Promise<ActivityItem[]> => {
  const [expenseResult, incomeResult] = await Promise.all([
    supabase.from('expenses').select('id, title, amount, member_id, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
    supabase.from('income').select('id, source, amount, member_id, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
  ]);

  if (expenseResult.error) throw expenseResult.error;
  if (incomeResult.error) throw incomeResult.error;

  const expenseItems = expenseResult.data.map(r => formatInitialRecord(r, 'expense', ownerName, members));
  const incomeItems = incomeResult.data.map(r => formatInitialRecord(r, 'income', ownerName, members));

  const combined = [...expenseItems, ...incomeItems];
  
  // Sort by created_at descending and take the top 10
  combined.sort((a, b) => parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime());
  
  return combined.slice(0, 10);
};


export const useRealtimeActivity = (members: { id: string, name: string }[]) => {
  const { user, isLoading: isSessionLoading } = useSession();
  const { data: ownerProfileData } = useOwnerProfile();
  const ownerName = ownerProfileData?.ownerName || 'You';
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // --- Realtime Handler ---
  const handleRealtimeUpdate = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    if (payload.table !== 'expenses' && payload.table !== 'income') return;
    
    const message = formatActivityMessage(payload, ownerName, members);
    
    if (message) {
      const newItem: ActivityItem = {
        id: `${payload.table}-${payload.eventType}-${Date.now()}`,
        timestamp: format(new Date(), 'HH:mm:ss'),
        message,
        type: payload.table === 'expenses' ? 'expense' : 'income',
        created_at: new Date().toISOString(), // Use current time for sorting new events
      };
      
      setActivityFeed(prev => [newItem, ...prev].slice(0, 10)); // Keep max 10 items
    }
  }, [ownerName, members]);

  // --- Initial Fetch Effect ---
  useEffect(() => {
    if (user && !isSessionLoading && isInitialLoad) {
      fetchInitialActivity(user.id, ownerName, members)
        .then(initialFeed => {
          setActivityFeed(initialFeed);
          setIsInitialLoad(false);
        })
        .catch(error => {
          console.error("Error fetching initial activity feed:", error);
          setIsInitialLoad(false);
        });
    }
  }, [user, isSessionLoading, ownerName, members, isInitialLoad]);


  // --- Realtime Subscription Effect ---
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

  return { activityFeed, isInitialLoad };
};