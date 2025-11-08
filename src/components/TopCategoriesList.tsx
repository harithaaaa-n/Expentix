import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { ColoredProgress } from './ColoredProgress';

interface CategoryExpenseData {
  name: string;
  value: number;
}

interface TopCategoriesListProps {
  data: CategoryExpenseData[];
  totalExpenses: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const CATEGORY_COLORS: { [key: string]: string } = {
  'Food': 'bg-red-500',
  'Housing': 'bg-blue-500',
  'Transport': 'bg-amber-500',
  'Entertainment': 'bg-emerald-500',
  'Utilities': 'bg-violet-500',
  'Healthcare': 'bg-pink-500',
  'Personal': 'bg-indigo-500',
  'Other': 'bg-slate-500',
};

const TopCategoriesList: React.FC<TopCategoriesListProps> = ({ data, totalExpenses }) => {
  const top3 = data.slice(0, 3);
  const maxExpense = top3.length > 0 ? top3[0].value : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Top 3 Spending Categories
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="space-y-4">
          {top3.length > 0 ? (
            top3.map((category, index) => {
              const percentage = totalExpenses > 0 ? (category.value / totalExpenses) * 100 : 0;
              const progressValue = (category.value / maxExpense) * 100;
              const colorClass = CATEGORY_COLORS[category.name] || CATEGORY_COLORS['Other'];

              return (
                <div key={category.name} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${colorClass}`} />
                      {category.name}
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(category.value)}
                    </span>
                  </div>
                  <ColoredProgress value={progressValue} className="h-2" indicatorClassName={colorClass} />
                  <p className="text-xs text-muted-foreground text-right">
                    {percentage.toFixed(1)}% of total expenses
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              No expense data to analyze.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TopCategoriesList;