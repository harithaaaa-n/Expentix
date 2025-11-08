import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";
import { format, subMonths } from "date-fns";

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
  recentExpenses: Expense[];
  comparison: ComparisonData;
  topCategories: CategoryExpenseData[];
  totalExpenses: number;
  budgetUsage: BudgetUsage[];
  isLoading: boolean;
}

const fetchFinancialData = async (userId: string) => {
  const currentDate = new Date();
  const lastMonthDate = subMonths(currentDate, 1);
  
  const currentMonthString = format(currentDate, 'yyyy-MM');
  const lastMonthString = format(lastMonthDate, 'yyyy-MM');

  const [incomeResult, expenseResult, lastMonthExpenseResult, budgetResult] = await Promise.all([
    supabase.from('income').select('amount').eq('user_id', userId),
    supabase.from('expenses').select('id, title, amount, expense_date, category, payment_type, description').eq('user_id', userId).order('expense_date', { ascending: false }),
    supabase.from('expenses').select('amount').eq('user_id', userId).like('expense_date', `${lastMonthString}%`),
    supabase.from('budgets').select('category, amount').eq('user_id', userId).eq('month', format(currentDate, 'yyyy-MM-dd')),
  ]);

  if (incomeResult.error) throw incomeResult.error;
  if (expenseResult.error) throw expenseResult.error;
  if (lastMonthExpenseResult.error) throw lastMonthExpenseResult.error;
  if (budgetResult.error) throw budgetResult.error;

  return { 
    income: incomeResult.data, 
    expenses: expenseResult.data,
    lastMonthExpenses: lastMonthExpenseResult.data,
    budgets: budgetResult.data
  };
};

export const useFinancialSummary = (userId?: string): FinancialSummary => {
  const { user, isLoading: isSessionLoading } = useSession();
  const effectiveUserId = userId || user?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['financialSummary', effectiveUserId],
    queryFn: () => fetchFinancialData(effectiveUserId!),
    enabled: !!effectiveUserId,
  });

  if (isError) {
    console.error("Failed to fetch financial data.");
  }

  const expensesData = data?.expenses || [];
  const lastMonthExpensesData = data?.lastMonthExpenses || [];
  const budgetsData = data?.budgets || [];
  
  const totalIncome = data?.income?.reduce((sum, record) => sum + record.amount, 0) || 0;
  const totalExpenses = expensesData.reduce((sum, record) => sum + record.amount, 0) || 0;
  const remainingBalance = totalIncome - totalExpenses;

  // Monthly expenses calculation
  const monthlyMap = new Map<string, number>();
  expensesData.forEach(expense => {
    const monthKey = format(new Date(expense.expense_date), 'MMM yy');
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + expense.amount);
  });

  const monthlyExpenses = Array.from(monthlyMap.entries()).map(([month, expenses]) => ({ month, expenses }));

  // Category expenses calculation
  const categoryMap = new Map<string, number>();
  expensesData.forEach(expense => {
    categoryMap.set(expense.category, (categoryMap.get(expense.category) || 0) + expense.amount);
  });

  const categoryExpenses = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  
  // Recent Expenses (Top 5)
  const recentExpenses = expensesData.slice(0, 5) as Expense[];

  // Comparison data
  const currentMonthExpenses = expensesData
    .filter(e => format(new Date(e.expense_date), 'yyyy-MM') === format(new Date(), 'yyyy-MM'))
    .reduce((sum, e) => sum + e.amount, 0);
    
  const lastMonthExpenses = lastMonthExpensesData.reduce((sum, e) => sum + e.amount, 0);
  const expenseDifference = currentMonthExpenses - lastMonthExpenses;
  const expenseChangePercent = lastMonthExpenses !== 0 ? (expenseDifference / lastMonthExpenses) * 100 : 0;
  
  const comparison: ComparisonData = {
    currentMonthExpenses,
    lastMonthExpenses,
    expenseDifference,
    expenseChangePercent
  };

  // Top categories (sorted by value, top 3)
  const topCategories = [...categoryExpenses]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  // Budget usage calculation
  const budgetUsage: BudgetUsage[] = budgetsData.map(budget => {
    const spent = categoryMap.get(budget.category) || 0;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    
    let status: 'ok' | 'warning' | 'danger' = 'ok';
    if (percentage >= 100) status = 'danger';
    else if (percentage >= 80) status = 'warning';
    
    return {
      category: budget.category,
      budgeted: budget.amount,
      spent,
      percentage,
      status
    };
  });

  return {
    totalIncome,
    totalExpenses,
    remainingBalance,
    monthlyExpenses,
    categoryExpenses,
    recentExpenses,
    comparison,
    topCategories,
    totalExpenses: totalExpenses, // Duplicate for compatibility
    budgetUsage,
    isLoading: isLoading || isSessionLoading,
  };
};