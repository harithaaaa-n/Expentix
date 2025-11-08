import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";
import { Budget } from "@/types/settings";
import { format, subMonths, startOfMonth, endOfMonth, isSameMonth } from "date-fns";

interface MonthlyExpenseData {
  month: string;
  expenses: number;
}

interface CategoryExpenseData {
  name: string;
  value: number;
}

interface BudgetUsage {
  category: string;
  budgeted: number;
  spent: number;
  percentage: number;
  status: 'ok' | 'warning' | 'danger';
}

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  monthlyExpenses: MonthlyExpenseData[];
  categoryExpenses: CategoryExpenseData[];
  budgetUsage: BudgetUsage[];
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
  const now = new Date();
  const currentMonthStartString = format(startOfMonth(now), 'yyyy-MM-dd');

  // NOTE: RLS policies must allow the currently authenticated user (or anon user if no auth) 
  // to read data belonging to `userId` if this is a shared view. 
  // Since RLS is currently set to `auth.uid() = user_id`, this will only work if the viewer is the owner.
  // For shared viewing, we must assume the RLS policies are configured to allow the viewer to see the owner's data 
  // if they are part of the family group, or that the shared dashboard is only for viewing by the owner when logged out.

  const [incomeResult, expenseResult, budgetResult] = await Promise.all([
    supabase.from('income').select('amount, date').eq('user_id', userId),
    supabase.from('expenses').select('amount, expense_date, category').eq('user_id', userId),
    supabase.from('budgets').select('category, amount, month').eq('user_id', userId).eq('month', currentMonthStartString),
  ]);

  if (incomeResult.error) throw incomeResult.error;
  if (expenseResult.error) throw expenseResult.error;
  if (budgetResult.error) throw budgetResult.error;

  const incomeRecords: Pick<Income, 'amount' | 'date'>[] = incomeResult.data as Pick<Income, 'amount' | 'date'>[];
  const expenseRecords: Pick<Expense, 'amount' | 'expense_date' | 'category'>[] = expenseResult.data as Pick<Expense, 'amount' | 'expense_date' | 'category'>[];
  const budgetRecords: Pick<Budget, 'category' | 'amount' | 'month'>[] = budgetResult.data as Pick<Budget, 'category' | 'amount' | 'month'>[];

  return { incomeRecords, expenseRecords, budgetRecords };
};

const processFinancialData = (
  incomeRecords: Pick<Income, 'amount' | 'date'>[], 
  expenseRecords: Pick<Expense, 'amount' | 'expense_date' | 'category'>[],
  budgetRecords: Pick<Budget, 'category' | 'amount' | 'month'>[]
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
  const currentMonthSpendingMap = new Map<string, number>();

  expenseRecords.forEach(expense => {
    const date = new Date(expense.expense_date);
    const amount = parseFloat(String(expense.amount));

    // Monthly aggregation (for chart)
    const monthKey = format(date, 'yyyy-MM'); 
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + amount);

    // Category aggregation (for pie chart and top categories)
    const category = expense.category;
    categoryMap.set(category, (categoryMap.get(category) || 0) + amount);

    // Month-over-month comparison & Budget Usage (Current Month only)
    if (isSameMonth(date, now)) {
      currentMonthExpenses += amount;
      currentMonthSpendingMap.set(category, (currentMonthSpendingMap.get(category) || 0) + amount);
    } else if (date >= lastMonthStart && date <= lastMonthEnd) {
      lastMonthExpenses += amount;
    }
  });

  // --- Budget Usage Calculation ---
  const budgetUsage: BudgetUsage[] = budgetRecords.map(budget => {
    const budgeted = parseFloat(String(budget.amount));
    const spent = currentMonthSpendingMap.get(budget.category) || 0;
    const percentage = budgeted > 0 ? Math.round((spent / budgeted) * 100) : 0;
    
    let status: BudgetUsage['status'] = 'ok';
    if (percentage >= 100) {
      status = 'danger';
    } else if (percentage >= 80) {
      status = 'warning';
    }

    return {
      category: budget.category,
      budgeted,
      spent,
      percentage,
      status,
    };
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
    budgetUsage,
    comparison: {
      currentMonthExpenses,
      lastMonthExpenses,
      expenseDifference,
      expenseChangePercent,
    },
    topCategories,
  };
};

export const useFinancialSummary = (targetUserId?: string): FinancialSummary => {
  const { user, isLoading: isSessionLoading } = useSession();
  
  // Determine the user ID to fetch data for
  const userIdToFetch = targetUserId || user?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['financialSummary', userIdToFetch],
    queryFn: () => fetchFinancialData(userIdToFetch!),
    enabled: !!userIdToFetch && !isSessionLoading,
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
    budgetUsage: [],
    comparison: {
      currentMonthExpenses: 0,
      lastMonthExpenses: 0,
      expenseDifference: 0,
      expenseChangePercent: 0,
    },
    topCategories: [],
  };

  const processedData = data ? processFinancialData(data.incomeRecords, data.expenseRecords, data.budgetRecords) : defaultProcessedData;

  return {
    ...processedData,
    isLoading: isLoading || isSessionLoading,
  };
};