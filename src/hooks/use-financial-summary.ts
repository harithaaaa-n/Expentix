import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/integrations/supabase/session-context";
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
  recentExpenses: Expense[];
  isLoading: boolean;
}

const fetchFinancialData = async (userId: string) => {
  const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  
  const [incomeResult, expenseResult, budgetResult] = await Promise.all([
    supabase.from('income').select('amount').eq('user_id', userId),
    supabase.from('expenses').select('*').eq('user_id', userId).order('expense_date', { ascending: false }),
    supabase.from('budgets').select('category, amount').eq('user_id', userId).eq('month', currentMonthStart),
  ]);

  if (incomeResult.error) throw incomeResult.error;
  if (expenseResult.error) throw expenseResult.error;
  if (budgetResult.error) throw budgetResult.error;

  return { 
    income: incomeResult.data as { amount: number }[],
    expenses: expenseResult.data as Expense[],
    budgets: budgetResult.data as { category: string, amount: number }[]
  };
};

const useFinancialSummary = (targetUserId?: string | null): FinancialSummary => {
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

  const summary = React.useMemo(() => {
    const emptyState: Omit<FinancialSummary, 'isLoading'> = {
      totalIncome: 0,
      totalExpenses: 0,
      remainingBalance: 0,
      monthlyExpenses: [],
      categoryExpenses: [],
      comparison: { currentMonthExpenses: 0, lastMonthExpenses: 0, expenseDifference: 0, expenseChangePercent: 0 },
      budgetUsage: [],
      topCategories: [],
      recentExpenses: [],
    };

    if (!data) return emptyState;

    const { income, expenses, budgets } = data;

    const totalIncome = income.reduce((sum, record) => sum + record.amount, 0);
    const totalExpenses = expenses.reduce((sum, record) => sum + record.amount, 0);
    const remainingBalance = totalIncome - totalExpenses;

    const monthlyMap = new Map<string, number>();
    const categoryMap = new Map<string, number>();
    const categorySpentThisMonthMap = new Map<string, number>();

    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    let currentMonthExpensesTotal = 0;
    let lastMonthExpensesTotal = 0;

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.expense_date);
      const monthKey = format(expenseDate, 'MMM yy');
      
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + expense.amount);
      categoryMap.set(expense.category, (categoryMap.get(expense.category) || 0) + expense.amount);

      if (expenseDate >= currentMonthStart) {
        currentMonthExpensesTotal += expense.amount;
        categorySpentThisMonthMap.set(expense.category, (categorySpentThisMonthMap.get(expense.category) || 0) + expense.amount);
      } else if (expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd) {
        lastMonthExpensesTotal += expense.amount;
      }
    });

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

    const budgetUsage: BudgetUsage[] = budgets.map(budget => {
      const spent = categorySpentThisMonthMap.get(budget.category) || 0;
      const budgeted = budget.amount;
      const percentage = budgeted > 0 ? (spent / budgeted) * 100 : (spent > 0 ? 1000 : 0);
      
      let status: 'ok' | 'warning' | 'danger' = 'ok';
      if (percentage >= 100) status = 'danger';
      else if (percentage >= 80) status = 'warning';

      return { category: budget.category, budgeted, spent, percentage, status };
    });

    const categoryExpenses = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
    const topCategories = [...categoryExpenses].sort((a, b) => b.value - a.value);
    const monthlyExpenses = Array.from(monthlyMap.entries()).map(([month, expenses]) => ({ month, expenses }));
    const recentExpenses = expenses.slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      remainingBalance,
      monthlyExpenses,
      categoryExpenses,
      comparison,
      budgetUsage,
      topCategories,
      recentExpenses,
    };
  }, [data]);

  return { ...summary, isLoading: isLoading || isSessionLoading };
};

export { useFinancialSummary };