import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface BudgetUsageData {
  category: string;
  spent: number;
  budgeted: number;
}

interface BudgetUtilizationChartProps {
  budgetUsage: BudgetUsageData[];
}

const BudgetUtilizationChart: React.FC<BudgetUtilizationChartProps> = ({ budgetUsage }) => {
  const totalBudgeted = budgetUsage.reduce((acc, item) => acc + item.budgeted, 0);
  const totalSpent = budgetUsage.reduce((acc, item) => acc + item.spent, 0);
  const utilizationPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const data = [
    { name: 'Spent', value: totalSpent },
    { name: 'Remaining', value: Math.max(0, totalBudgeted - totalSpent) },
  ];

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>This Month's Budget</CardTitle>
          <CardDescription>Total: {formatCurrency(totalBudgeted)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                <Cell key={`cell-0`} fill="hsl(var(--primary))" />
                <Cell key={`cell-1`} fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {utilizationPercentage.toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground">Utilized</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BudgetUtilizationChart;