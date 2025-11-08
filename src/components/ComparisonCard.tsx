import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ComparisonData {
  currentMonthExpenses: number;
  lastMonthExpenses: number;
  expenseDifference: number;
  expenseChangePercent: number;
}

interface ComparisonCardProps {
  data: ComparisonData;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const ComparisonCard: React.FC<ComparisonCardProps> = ({ data }) => {
  const { currentMonthExpenses, lastMonthExpenses, expenseDifference, expenseChangePercent } = data;

  const isIncrease = expenseDifference > 0;
  const Icon = isIncrease ? ArrowUp : (expenseDifference < 0 ? ArrowDown : Minus);
  const colorClass = isIncrease ? 'text-destructive' : (expenseDifference < 0 ? 'text-green-500' : 'text-muted-foreground');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            This Month vs Last Month
          </CardTitle>
          <Icon className={cn("h-4 w-4", colorClass)} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {formatCurrency(currentMonthExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">
            Current Month Expenses
          </p>
          
          <div className="mt-4 pt-3 border-t border-border">
            <div className={cn("flex items-center text-sm font-medium", colorClass)}>
              <Icon className="h-4 w-4 mr-1" />
              {expenseChangePercent.toFixed(1)}% 
              <span className="ml-1 text-xs text-muted-foreground">
                ({formatCurrency(Math.abs(expenseDifference))})
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isIncrease ? 'Increase' : (expenseDifference < 0 ? 'Decrease' : 'No change')} from last month ({formatCurrency(lastMonthExpenses)})
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComparisonCard;