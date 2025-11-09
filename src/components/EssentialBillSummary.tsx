import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEssentialBills } from '@/hooks/use-essential-bills';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const EssentialBillSummary: React.FC = () => {
  const { summary, isLoading } = useEssentialBills();

  // Placeholder for trend analysis (since we don't have last month's data yet)
  const trend = {
    change: 500, // Mock change
    percent: 5.5, // Mock percent
    isIncrease: true,
  };

  const TrendIcon = trend.isIncrease ? TrendingUp : (trend.change < 0 ? TrendingDown : Minus);
  const trendColor = trend.isIncrease ? 'text-destructive' : (trend.change < 0 ? 'text-green-500' : 'text-muted-foreground');

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-32 animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Monthly Bills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Bill Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.currentMonthTotal)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated total for this month
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pending Bills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Bills
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(summary.pendingAmount)} pending payment
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trend Analysis (Placeholder) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bill Trend (vs Last Month)
            </CardTitle>
            <TrendIcon className={cn("h-4 w-4", trendColor)} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", trendColor)}>
              {trend.isIncrease ? '+' : ''}{trend.percent.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(Math.abs(trend.change))} difference
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EssentialBillSummary;