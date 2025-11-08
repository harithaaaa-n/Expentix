import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";
import { format, subMonths, startOfMonth } from "date-fns";

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
  comparison: ComparisonData;
  budgetUsage: BudgetUsage[];
  topCategories: CategoryExpenseData[];
  isLoading: boolean;
}

const fetchFinancialData = async (userId: string) => {
  const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const lastMonthStart = format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
  const currentMonthEnd = format(new Date(), 'yyyy-MM-dd');
  
  const [incomeResult, expenseResult, budgetResult] = await Promise.all([
    supabase.from('income').select('amount').eq('user_id', userId),
    supabase.from('expenses').select('amount, expense_date, category').eq('user_id', userId),
    supabase.from('budgets').select('category, amount').eq('user_id', userId).eq('month', currentMonthStart),
  ]);

  if (incomeResult.error) throw incomeResult.error;
  if (expenseResult.error) throw expenseResult.error;
  if (budgetResult.error) throw budgetResult.error;

  return { income: incomeResult.data, expenses: expenseResult.data, budgets: budgetResult.data };
};

export const useFinancialSummary = (targetUserId?: string): FinancialSummary => {
  const { user, isLoading: isSessionLoading } = useSession();
  const userId = targetUserId || user?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['financialSummary', userId],
    queryFn: () => fetchFinancialData(userId!),
    enabled: !!userId,
  });

  if (isError) {
    console.error("Failed to fetch financial data.");
  }

  const allExpenses = data?.expenses || [];
  const totalIncome = data?.income?.reduce((sum, record) => sum + record.amount, 0) || 0;
  const totalExpenses = allExpenses.reduce((sum, record) => sum + record.amount, 0) || 0;
  const remainingBalance = totalIncome - totalExpenses;

  // --- Processing ---
  const currentMonth = format(new Date(), 'MMM yy');
  const lastMonth = format(subMonths(new Date(), 1), 'MMM yy');
  const currentMonthStart = startOfMonth(new Date());
  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));

  let currentMonthExpensesTotal = 0;
  let lastMonthExpensesTotal = 0;
  const monthlyMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();
  const categorySpentMap = new Map<string, number>();

  allExpenses.forEach(expense => {
    const expenseDate = new Date(expense.expense_date);
    const monthKey = format(expenseDate, 'MMM yy');
    
    // Monthly trend data
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + expense.amount);
    
    // Category spending data
    categoryMap.set(expense.category, (categoryMap.get(expense.category) || 0) + expense.amount);
    categorySpentMap.set(expense.category, (categorySpentMap.get(expense.category) || 0) + expense.amount);

    // Comparison data
    if (expenseDate >= currentMonthStart) {
      currentMonthExpensesTotal += expense.amount;
    } else if (expenseDate >= lastMonthStart) {
      lastMonthExpensesTotal += expense.amount;
    }
  });

  // --- Comparison Calculation ---
  const expenseDifference = currentMonthExpensesTotal - lastMonthExpensesTotal;
  const expenseChangePercent = lastMonthExpensesTotal > 0 
    ? (expenseDifference / lastMonthExpensesTotal) * 100 
    : (currentMonthExpensesTotal > 0 ? 100 : 0);

  const comparison: ComparisonData = {
    currentMonthExpenses: currentMonthExpensesTotal,
    lastMonthExpenses: lastMonthExpensesTotal,
    expenseDifference,
    expenseChangePercent,
  };

  // --- Budget Usage Calculation ---
  const budgets = data?.budgets || [];
  const budgetUsage: BudgetUsage[] = budgets.map(budget => {
    const spent = categorySpentMap.get(budget.category) || 0;
    const budgeted = budget.amount;
    const percentage = budgeted > 0 ? (spent / budgeted) * 100 : (spent > 0 ? 1000 : 0);
    
    let status: 'ok' | 'warning' | 'danger' = 'ok';
    if (percentage >= 100) {
      status = 'danger';
    } else if (percentage >= 80) {
      status = 'warning';
    }

    return {
      category: budget.category,
      budgeted,
      spent,
      percentage: Math.min(percentage, 1000), // Cap display percentage for safety
      status,
    };
  });

  // --- Final Data Structures ---
  const monthlyExpenses = Array.from(monthlyMap.entries()).map(([month, expenses]) => ({ month, expenses }));
  const categoryExpenses = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  const topCategories = [...categoryExpenses].sort((a, b) => b.value - a.value);

  return {
    totalIncome,
    totalExpenses,
    remainingBalance,
    monthlyExpenses,
    categoryExpenses,
    comparison,
    budgetUsage,
    topCategories,
    isLoading: isLoading || isSessionLoading,
  };
};