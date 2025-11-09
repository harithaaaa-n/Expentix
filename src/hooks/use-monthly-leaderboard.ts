import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { FamilyMember } from "@/types/settings";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";
import { startOfMonth, format } from "date-fns";
import { useOwnerProfile } from "./use-owner-profile";

interface MemberStats {
  id: string; // user_id for owner, member_id for others
  name: string;
  avatar_url: string | null;
  netSavings: number;
  expenseCount: number;
  incomeCount: number;
}

const fetchLeaderboardData = async (userId: string, members: FamilyMember[]) => {
  const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');

  // 1. Fetch all transactions for the current month
  const [incomeResult, expenseResult] = await Promise.all([
    supabase.from('income').select('amount, member_id').eq('user_id', userId).gte('date', currentMonthStart),
    supabase.from('expenses').select('amount, member_id').eq('user_id', userId).gte('expense_date', currentMonthStart),
  ]);

  if (incomeResult.error) throw incomeResult.error;
  if (expenseResult.error) throw expenseResult.error;

  const incomeRecords = incomeResult.data as Pick<Income, 'amount' | 'member_id'>[];
  const expenseRecords = expenseResult.data as Pick<Expense, 'amount' | 'member_id'>[];

  // 2. Aggregate data by member_id (or null for owner)
  const aggregationMap = new Map<string | null, { income: number, expenses: number, incomeCount: number, expenseCount: number }>();

  const initializeMapEntry = (key: string | null) => {
    if (!aggregationMap.has(key)) {
      aggregationMap.set(key, { income: 0, expenses: 0, incomeCount: 0, expenseCount: 0 });
    }
  };

  incomeRecords.forEach(record => {
    initializeMapEntry(record.member_id);
    const entry = aggregationMap.get(record.member_id)!;
    entry.income += record.amount;
    entry.incomeCount += 1;
  });

  expenseRecords.forEach(record => {
    initializeMapEntry(record.member_id);
    const entry = aggregationMap.get(record.member_id)!;
    entry.expenses += record.amount;
    entry.expenseCount += 1;
  });

  return aggregationMap;
};

export const useMonthlyLeaderboard = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const { data: ownerProfileData, isLoading: isProfileLoading } = useOwnerProfile();

  // Fetch all family members (including owner profile data)
  const membersQuery = useQuery({
    queryKey: ['familyMembers'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as FamilyMember[];
    },
    enabled: !!user && !isSessionLoading,
  });

  const members = membersQuery.data || [];
  const ownerId = user?.id || '';
  const ownerName = ownerProfileData?.ownerName || 'You';
  const ownerAvatar = ownerProfileData?.profile?.avatar_url || null;

  const leaderboardQuery = useQuery({
    queryKey: ['monthlyLeaderboard', ownerId, members.length],
    queryFn: () => fetchLeaderboardData(ownerId, members),
    enabled: !!ownerId && membersQuery.isSuccess,
  });

  const aggregationMap = leaderboardQuery.data;
  const isLoading = isSessionLoading || isProfileLoading || membersQuery.isLoading || leaderboardQuery.isLoading;

  const leaderboardData: MemberStats[] = React.useMemo(() => {
    if (!aggregationMap || !user) return [];

    const allParticipants = [
      { id: ownerId, name: ownerName, avatar_url: ownerAvatar, member_id: null },
      ...members.map(m => ({ 
        id: m.id!, 
        name: m.name, 
        avatar_url: m.avatar_url, 
        member_id: m.id! 
      }))
    ];

    const stats: MemberStats[] = allParticipants.map(p => {
      const key = p.member_id;
      const data = aggregationMap.get(key) || { income: 0, expenses: 0, incomeCount: 0, expenseCount: 0 };
      
      return {
        id: p.id,
        name: p.name,
        avatar_url: p.avatar_url,
        netSavings: data.income - data.expenses,
        expenseCount: data.expenseCount,
        incomeCount: data.incomeCount,
      };
    });

    return stats;
  }, [aggregationMap, members, ownerId, ownerName, ownerAvatar, user]);

  return {
    leaderboardData,
    isLoading,
    refetch: leaderboardQuery.refetch,
  };
};