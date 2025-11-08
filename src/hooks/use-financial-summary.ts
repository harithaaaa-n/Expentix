import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

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
  comparison: {
    currentMonthExpenses: number;
    lastMonthExpenses: number;
    expenseDifference: number;
    expenseChangePercent: number;
  };
  topCategories: CategoryExpenseData[];
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

  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  let currentMonthExpenses = 0;
  let lastMonthExpenses = 0;

  // Monthly & Category Calculations
  const monthlyMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  expenseRecords.forEach(expense => {
    const date = new Date(expense.expense_date);
    const amount = parseFloat(String(expense.amount));

    // Monthly aggregation
    const monthKey = format(date, 'yyyy-MM'); 
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + amount);

    // Category aggregation
    const category = expense.category;
    categoryMap.set(category, (categoryMap.get(category) || 0) + amount);

    // Month-over-month comparison
    if (date >= currentMonthStart) {
      currentMonthExpenses += amount;
    } else if (date >= lastMonthStart && date <= lastMonthEnd) {
      lastMonthExpenses += amount;
    }
  });

  // Monthly Expenses Array
  const monthlyExpenses = Array.from(monthlyMap.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, expenses]) => ({ 
      month: format(new Date(key + '-01'), 'MMM yy'),
      expenses: expenses 
    }));

  // Category Expenses Array
  const categoryExpenses = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

  // Top Categories (Top 3)
  const topCategories = categoryExpenses
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  // Comparison Calculation
  const expenseDifference = currentMonthExpenses - lastMonthExpenses;
  const expenseChangePercent = lastMonthExpenses > 0 
    ? (expenseDifference / lastMonthExpenses) * 100 
    : (currentMonthExpenses > 0 ? 100 : 0);

  return {
    totalIncome,
    totalExpenses,
    remainingBalance,
    monthlyExpenses,
    categoryExpenses,
    comparison: {
      currentMonthExpenses,
      lastMonthExpenses,
      expenseDifference,
      expenseChangePercent,
    },
    topCategories,
  };
};

export const useFinancialSummary = (): FinancialSummary => {
  const { user, isLoading: isSessionLoading } = useSession();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['financialSummary', user?.id],
    queryFn: () => fetchFinancialData(user!.id),
    enabled: !!user && !isSessionLoading,
    staleTime: 1000 * 60 * 5, 
  });

  if (isError) {
    console.error("Failed to fetch financial data.");
  }

  const defaultProcessedData = {
    totalIncome: 0,
    totalExpenses: 0,
    remainingBalance: 0,
    monthlyExpenses: [],
    categoryExpenses: [],
    comparison: {
      currentMonthExpenses: 0,
      lastMonthExpenses: 0,
      expenseDifference: 0,
      expenseChangePercent: 0,
    },
    topCategories: [],
  };

  const processedData = data ? processFinancialData(data.incomeRecords, data.expenseRecords) : defaultProcessedData;

  return {
    ...processedData,
    isLoading: isLoading || isSessionLoading,
  };
};