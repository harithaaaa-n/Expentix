import React from 'react';
import { Bill } from '@/types/bill';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { format, startOfMonth, subMonths } from 'date-fns';
import CategoryPieChart from './CategoryPieChart';
import MonthlyExpenseChart from './MonthlyExpenseChart';
import { ColoredProgress } from './ColoredProgress';

interface BillAnalyticsProps {
  bills: Bill[];
  currentMonthTotalExpenses: number;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const BillAnalytics: React.FC<BillAnalyticsProps> = ({ bills, currentMonthTotalExpenses }) => {
  // --- Data Processing ---

  // 1. Bill Category Breakdown (All-time for a better overview)
  const categoryMap = new Map<string, number>();
  bills.forEach(bill => {
    categoryMap.set(bill.category, (categoryMap.get(bill.category) || 0) + bill.amount);
  });
  const billCategoryData = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 2. Monthly Bill Trend (Last 6 months)
  const monthlyMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const month = startOfMonth(subMonths(new Date(), i));
    const monthKey = format(month, 'MMM yy');
    monthlyMap.set(monthKey, 0);
  }
  bills.forEach(bill => {
    const billDate = new Date(bill.due_date);
    if (billDate >= startOfMonth(subMonths(new Date(), 5))) {
      const monthKey = format(billDate, 'MMM yy');
      if (monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, monthlyMap.get(monthKey)! + bill.amount);
      }
    }
  });
  const billTrendData = Array.from(monthlyMap.entries()).map(([month, expenses]) => ({ month, expenses }));

  // 3. Bills as a Percentage of Total Expenses (Current Month)
  const currentMonthStart = startOfMonth(new Date());
  const totalBillsThisMonth = bills
    .filter(b => new Date(b.due_date) >= currentMonthStart)
    .reduce((sum, b) => sum + b.amount, 0);
  
  const percentageOfTotal = currentMonthTotalExpenses > 0 
    ? (totalBillsThisMonth / currentMonthTotalExpenses) * 100 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Bill Analytics & Insights</CardTitle>
          <CardDescription>Analyze your essential spending patterns and trends.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Percentage of Total Expenses */}
          <div className="space-y-2">
            <h3 className="text-md font-semibold">Bills vs. Total Expenses (This Month)</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">
                {formatCurrency(totalBillsThisMonth)} of {formatCurrency(currentMonthTotalExpenses)}
              </span>
              <span className="font-bold text-primary">{percentageOfTotal.toFixed(1)}%</span>
            </div>
            <ColoredProgress value={percentageOfTotal} className="h-2" indicatorClassName="bg-blue-500" />
            <p className="text-xs text-muted-foreground">
              Essential bills make up {percentageOfTotal.toFixed(1)}% of your total spending this month.
            </p>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-md font-semibold mb-2 text-center">Bill Category Breakdown</h3>
              <CategoryPieChart data={billCategoryData} />
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2 text-center">Monthly Bill Trend</h3>
              <MonthlyExpenseChart data={billTrendData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BillAnalytics;