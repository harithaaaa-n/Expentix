import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";
import { Budget } from "@/types/settings";
import { format, startOfMonth, subMonths, isSameMonth } from "date-fns";

interface MonthlyExpenseData {
  month: string;
  expenses: number;
}

interface CategoryExpenseData {
  name: string;
  value: number;
}

interface ComparisonData {
  currentMonthExpenses: number;
  lastMonthExpenses: number;
  expenseDifference: number;
  expenseChangePercent: number;
}

interface BudgetUsageData {
  category: string;
  percentage: number;
  spent: number;
  budgeted: number;
  status: 'ok' | 'warning' | 'danger';
}

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  monthlyExpenses: MonthlyExpenseData[];
  categoryExpenses: CategoryExpenseData[];
  recentExpenses: Expense[];
  comparison: ComparisonData;
  budgetUsage: BudgetUsageData[];
  topCategories: CategoryExpenseData[];
  isLoading: boolean;
}

const fetchFinancialData = async (userId: string) => {
  const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');

  const [incomeResult, expenseResult, budgetResult] = await Promise.all([
    supabase.from('income').select('*').eq('user_id', userId),
    supabase.from('expenses').select('*').eq('user_id', userId).order('expense_date', { ascending: false }),
    supabase.from('budgets').select('*').eq('user_id', userId).eq('month', currentMonthStart),
  ]);

  if (incomeResult.error) throw incomeResult.error;
  if (expenseResult.error) throw expenseResult.error;
  if (budgetResult.error) throw budgetResult.error;

  return { 
    income: incomeResult.data as Income[], 
    expenses: expenseResult.data as Expense[], 
    budgets: budgetResult.data as Budget[] 
  };
};

export const useFinancialSummary = (targetUserId?: string | null): FinancialSummary => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userIdToFetch = targetUserId || user?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['financialSummary', userIdToFetch],
    queryFn: () => fetchFinancialData(userIdToFetch!),
    enabled: !!userIdToFetch,
  });

  if (isError) {
    console.error("Failed to fetch financial data.");
  }

  const expensesData = data?.expenses || [];
  const incomeData = data?.income || [];
  const budgetsData = data?.budgets || [];

  // --- Basic Calculations ---
  const totalIncome = incomeData.reduce((sum, record) => sum + Number(record.amount), 0);
  const totalExpenses = expensesData.reduce((sum, record) => sum + Number(record.amount), 0);
  const remainingBalance = totalIncome - totalExpenses;
  const recentExpenses = expensesData.slice(0, 5);

  // --- Monthly & Category Aggregations ---
  const monthlyMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();
  expensesData.forEach(expense => {
    const expenseDate = new Date(expense.expense_date);
    const monthKey = format(expenseDate, 'MMM yy');
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + Number(expense.amount));
    categoryMap.set(expense.category, (categoryMap.get(expense.category) || 0) + Number(expense.amount));
  });
  const monthlyExpenses = Array.from(monthlyMap.entries()).map(([month, expenses]) => ({ month, expenses }));
  const categoryExpenses = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  const topCategories = [...categoryExpenses].sort((a, b) => b.value - a.value);

  // --- Comparison Calculation ---
  const now = new Date();
  const lastMonth = subMonths(now, 1);
  const currentMonthExpenses = expensesData
    .filter(e => isSameMonth(new Date(e.expense_date), now))
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const lastMonthExpenses = expensesData
    .filter(e => isSameMonth(new Date(e.expense_date), lastMonth))
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const expenseDifference = currentMonthExpenses - lastMonthExpenses;
  const expenseChangePercent = lastMonthExpenses > 0 ? (expenseDifference / lastMonthExpenses) * 100 : (currentMonthExpenses > 0 ? 100 : 0);
  const comparison: ComparisonData = { currentMonthExpenses, lastMonthExpenses, expenseDifference, expenseChangePercent };

  // --- Budget Usage Calculation ---
  const currentMonthCategoryExpenses = new Map<string, number>();
  expensesData
    .filter(e => isSameMonth(new Date(e.expense_date), now))
    .forEach(e => {
      currentMonthCategoryExpenses.set(e.category, (currentMonthCategoryExpenses.get(e.category) || 0) + Number(e.amount));
    });

  const budgetUsage: BudgetUsageData[] = budgetsData.map(budget => {
    const spent = currentMonthCategoryExpenses.get(budget.category) || 0;
    const budgeted = Number(budget.amount);
    const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
    let status: 'ok' | 'warning' | 'danger' = 'ok';
    if (percentage > 100) status = 'danger';
    else if (percentage >= 80) status = 'warning';
    return { category: budget.category, percentage, spent, budgeted, status };
  });

  return {
    totalIncome,
    totalExpenses,
    remainingBalance,
    monthlyExpenses,
    categoryExpenses,
    recentExpenses,
    comparison,
    budgetUsage,
    topCategories,
    isLoading: isLoading || isSessionLoading,
  };
};