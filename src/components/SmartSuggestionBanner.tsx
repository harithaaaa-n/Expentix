import React from 'react';
import { useFinancialSummary } from '@/hooks/use-financial-summary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ICON_MAP = {
  warning: AlertTriangle,
  danger: XCircle,
  ok: CheckCircle,
};

const COLOR_MAP = {
  warning: 'border-yellow-500 text-yellow-700 bg-yellow-50 dark:text-yellow-300 dark:bg-yellow-900/30',
  danger: 'border-destructive text-destructive bg-red-50 dark:bg-red-900/30',
  ok: 'border-green-500 text-green-700 bg-green-50 dark:bg-green-900/30',
};

const SmartSuggestionBanner: React.FC = () => {
  const { budgetUsage, isLoading } = useFinancialSummary();

  if (isLoading) return null;

  // Find the most critical budget alert (Danger > Warning)
  const criticalAlert = budgetUsage
    .filter(b => b.percentage >= 80)
    .sort((a, b) => {
      if (a.status === 'danger' && b.status !== 'danger') return -1;
      if (a.status !== 'danger' && b.status === 'danger') return 1;
      return b.percentage - a.percentage;
    })[0];

  if (!criticalAlert) {
    // If no critical alerts, show a positive message if there are budgets set
    if (budgetUsage.length > 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert className={cn("border-green-500 text-green-700 bg-green-50 dark:bg-green-900/30")}>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Looking Good!</AlertTitle>
            <AlertDescription>
              Your spending is currently well within your set budgets for this month. Keep up the great work!
            </AlertDescription>
          </Alert>
        </motion.div>
      );
    }
    return null; // No budgets set, no banner needed
  }

  const { category, percentage, spent, budgeted, status } = criticalAlert;
  const Icon = ICON_MAP[status];
  const colorClass = COLOR_MAP[status];
  
  const message = status === 'danger'
    ? `You have exceeded your ${category} budget by ${((spent - budgeted) / budgeted * 100).toFixed(0)}%! Consider cutting back.`
    : `You've spent ${percentage.toFixed(1)}% of your ${category} budget ($${spent.toFixed(2)} / $${budgeted.toFixed(2)}) this month. Be mindful!`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Alert className={cn("border-l-4", colorClass)}>
          <Icon className="h-4 w-4" />
          <AlertTitle>{status === 'danger' ? 'Budget Alert!' : 'Budget Warning'}</AlertTitle>
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartSuggestionBanner;