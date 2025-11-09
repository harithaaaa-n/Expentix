import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { DollarSign, TrendingUp, Zap, Users } from 'lucide-react';

export interface SearchResult {
  id: string;
  type: 'Expense' | 'Income' | 'Bill' | 'Family';
  title: string;
  description: string;
  url: string;
}

const fetchSearchResults = async (userId: string, searchTerm: string): Promise<SearchResult[]> => {
  if (!searchTerm.trim()) {
    return [];
  }

  const searchPattern = `%${searchTerm}%`;

  const [expensesRes, incomeRes, billsRes, familyRes] = await Promise.all([
    supabase.from('expenses').select('id, title, amount, expense_date').eq('user_id', userId).or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`).limit(5),
    supabase.from('income').select('id, source, amount, date').eq('user_id', userId).or(`source.ilike.${searchPattern},description.ilike.${searchPattern}`).limit(5),
    supabase.from('essential_bills').select('id, title, amount, due_date').eq('user_id', userId).or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`).limit(5),
    supabase.from('family_members').select('id, name, relation').eq('user_id', userId).or(`name.ilike.${searchPattern},relation.ilike.${searchPattern}`).limit(5),
  ]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const expenses = expensesRes.data?.map(item => ({
    id: item.id,
    type: 'Expense' as const,
    title: item.title,
    description: `${formatCurrency(item.amount)} on ${item.expense_date}`,
    url: '/expenses',
  })) || [];

  const income = incomeRes.data?.map(item => ({
    id: item.id,
    type: 'Income' as const,
    title: item.source,
    description: `${formatCurrency(item.amount)} on ${item.date}`,
    url: '/income',
  })) || [];

  const bills = billsRes.data?.map(item => ({
    id: item.id,
    type: 'Bill' as const,
    title: item.title,
    description: `Due ${item.due_date} - ${formatCurrency(item.amount)}`,
    url: '/bills',
  })) || [];

  const family = familyRes.data?.map(item => ({
    id: item.id,
    type: 'Family' as const,
    title: item.name,
    description: item.relation || 'Family Member',
    url: '/family',
  })) || [];

  return [...expenses, ...income, ...bills, ...family];
};

export const useGlobalSearch = (searchTerm: string) => {
  const { user } = useSession();

  return useQuery({
    queryKey: ['globalSearch', searchTerm, user?.id],
    queryFn: () => fetchSearchResults(user!.id, searchTerm),
    enabled: !!user && searchTerm.length > 1, // Only search when term is long enough
    staleTime: 1000 * 60, // 1 minute cache
  });
};