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
    supabase.from('income').select('amount, date').eq('user_id', userId),
    supabase.from('expenses').select('amount, expense_date, category').eq('user_id', userId),
  ]);

  if (incomeResult.error) throw incomeResult.error;
  if (expenseResult.error) throw expenseResult.error;

  const incomeRecords: Pick<Income, 'amount' | 'date'>[] = incomeResult.data as Pick<Income, 'amount' | 'date'>[];
  const expenseRecords: Pick<Expense, 'amount' | 'expense_date' | 'category'>[] = expenseResult.data as Pick<Expense, 'amount' | 'expense_date' | 'category'>[];

  return { incomeRecords, expenseRecords };
};

const processFinancialData = (
  incomeRecords: Pick<Income, 'amount' | 'date'>[], 
  expenseRecords: Pick<Expense, 'amount' | 'expense_date' | 'category'>[]
) => {
  const totalIncome = incomeRecords.reduce((sum, record) => sum + parseFloat(String(record.amount)), 0);
  const totalExpenses = expenseRecords.reduce((sum, record) => sum + parseFloat(String(record.amount)), 0);
  const remainingBalance = totalIncome - totalExpenses;

  // Monthly Expenses Calculation
  const monthlyMap = new Map<string, number>();
  expenseRecords.forEach(expense => {
    const date = new Date(expense.expense_date);
    // Use YYYY-MM format for correct chronological sorting across years
    const monthKey = format(date, 'yyyy-MM'); 
    const amount = parseFloat(String(expense.amount));
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + amount);
  });

  // Convert map to array and sort by month key
  const monthlyExpenses = Array.from(monthlyMap.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, expenses]) => ({ 
      month: format(new Date(key + '-01'), 'MMM yy'), // Display as 'Jan 24'
      expenses: expenses 
    }));

  // Category Expenses Calculation
  const categoryMap = new Map<string, number>();
  expenseRecords.forEach(expense => {
    const category = expense.category;
    const amount = parseFloat(String(expense.amount));
    categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
  });

  const categoryExpenses = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

  return {
    totalIncome,
    totalExpenses,
    remainingBalance,
    monthlyExpenses,
    categoryExpenses,
  };
};

export const useFinancialSummary = (): FinancialSummary => {
  const { user, isLoading: isSessionLoading } = useSession();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['financialSummary', user?.id],
    queryFn: () => fetchFinancialData(user!.id),
    enabled: !!user && !isSessionLoading,
    // Keep data fresh for 5 minutes
    staleTime: 1000 * 60 * 5, 
  });

  if (isError) {
    console.error("Failed to fetch financial data.");
  }

  const processedData = data ? processFinancialData(data.incomeRecords, data.expenseRecords) : {
    totalIncome: 0,
    totalExpenses: 0,
    remainingBalance: 0,
    monthlyExpenses: [],
    categoryExpenses: [],
  };

  return {
    ...processedData,
    isLoading: isLoading || isSessionLoading,
  };
};