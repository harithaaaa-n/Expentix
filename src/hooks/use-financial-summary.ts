import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";
import { format } from "date-fns";

interface MonthlyExpenseData {
  month: string;
  expenses: number;
}

interface CategoryExpenseData {
  name: string;
  value: number;
}

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  monthlyExpenses: MonthlyExpenseData[];
  categoryExpenses: CategoryExpenseData[];
  isLoading: boolean;
}

const fetchFinancialData = async (userId: string) => {
  const [incomeResult, expenseResult] = await Promise.all([
    supabase.from('income').select('amount').eq('user_id', userId),
    supabase.from('expenses').select('amount, expense_date, category').eq('user_id', userId),
  ]);

  if (incomeResult.error) throw incomeResult.error;
  if (expenseResult.error) throw expenseResult.error;

  return { income: incomeResult.data, expenses: expenseResult.data };
};

export const useFinancialSummary = (): FinancialSummary => {
  const { user, isLoading: isSessionLoading } = useSession();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['financialSummary', user?.id],
    queryFn: () => fetchFinancialData(user!.id),
    enabled: !!user,
  });

  if (isError) {
    console.error("Failed to fetch financial data.");
  }

  const totalIncome = data?.income?.reduce((sum, record) => sum + record.amount, 0) || 0;
  const totalExpenses = data?.expenses?.reduce((sum, record) => sum + record.amount, 0) || 0;
  const remainingBalance = totalIncome - totalExpenses;

  const monthlyMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  data?.expenses?.forEach(expense => {
    const monthKey = format(new Date(expense.expense_date), 'MMM yy');
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + expense.amount);
    categoryMap.set(expense.category, (categoryMap.get(expense.category) || 0) + expense.amount);
  });

  const monthlyExpenses = Array.from(monthlyMap.entries()).map(([month, expenses]) => ({ month, expenses }));
  const categoryExpenses = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

  return {
    totalIncome,
    totalExpenses,
    remainingBalance,
    monthlyExpenses,
    categoryExpenses,
    isLoading: isLoading || isSessionLoading,
  };
};