import React from 'react';
import { useParams } from 'react-router-dom';
import { useShareResolver } from '@/hooks/use-share-resolver';
import { useFinancialSummary } from '@/hooks/use-financial-summary';
import { Loader2, AlertTriangle, DollarSign, TrendingDown, Wallet, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import SummaryCard from '@/components/SummaryCard';
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const SharedDashboard: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  
  const { data: ownerUserId, isLoading: isResolving, isError: isResolveError } = useShareResolver(shareId || null);

  const { 
    totalIncome, 
    totalExpenses, 
    remainingBalance, 
    monthlyExpenses, 
    categoryExpenses, 
    isLoading: isFinancialLoading 
  } = useFinancialSummary(ownerUserId);

  const isLoading = isResolving || isFinancialLoading;
  const budgetUsedPercentage = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  if (isResolveError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Invalid Share Link</AlertTitle>
          <AlertDescription>
            The shared link is invalid or has expired. Please check the URL.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!ownerUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Could not find financial data associated with this share ID.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <Card className="p-6 text-center bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30">
          <CardHeader className="p-0">
            <CardTitle className="text-3xl font-bold text-primary">
              Family Financial Overview (Shared)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 text-muted-foreground">
            This is a read-only view of the family's financial summary.
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Income 💰"
            value={formatCurrency(totalIncome)}
            icon={Wallet}
            colorClass="text-green-500"
            delay={0.2}
          />
          <SummaryCard
            title="Total Expenses 💸"
            value={formatCurrency(totalExpenses)}
            icon={TrendingDown}
            colorClass="text-red-500"
            delay={0.4}
          />
          <SummaryCard
            title="Remaining Balance 💵"
            value={formatCurrency(remainingBalance)}
            icon={DollarSign}
            colorClass={remainingBalance >= 0 ? "text-blue-500" : "text-destructive"}
            delay={0.6}
          />
          <SummaryCard
            title="Budget Used % 📊"
            value={`${budgetUsedPercentage}%`}
            icon={Percent}
            colorClass={budgetUsedPercentage > 100 ? "text-destructive" : "text-yellow-500"}
            delay={0.8}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MonthlyExpenseChart data={monthlyExpenses} />
          </div>
          <CategoryPieChart data={categoryExpenses} />
        </div>
        
        <Separator />
        
        <div className="text-center text-sm text-muted-foreground">
          Data provided by Expentix. This view is read-only.
        </div>
      </motion.div>
    </div>
  );
};

export default SharedDashboard;