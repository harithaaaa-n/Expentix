import DashboardLayout from "@/components/DashboardLayout";
import SummaryCard from "@/components/SummaryCard";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import { useSession } from "@/integrations/supabase/session-context";
import { Loader2, DollarSign, Wallet, TrendingDown, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { useFinancialSummary } from "@/hooks/use-financial-summary";
import SmartSuggestionBanner from "@/components/SmartSuggestionBanner";
import DailyReminderBanner from "@/components/DailyReminderBanner";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const Dashboard = () => {
  const { user } = useSession();
  const { 
    totalIncome, 
    totalExpenses, 
    remainingBalance, 
    monthlyExpenses, 
    categoryExpenses, 
    isLoading: isFinancialLoading 
  } = useFinancialSummary();

  const budgetUsedPercentage = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  if (isFinancialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This should ideally be handled by Index.tsx redirect, but we ensure safety here.
    return <p>Redirecting...</p>;
  }

  return (
    <DashboardLayout totalBalance={remainingBalance}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold mb-4 hidden md:block">
          Welcome back, {user.email?.split('@')[0]}!
        </h1>
        
        {/* Smart Suggestion Banner */}
        <SmartSuggestionBanner />

        {/* Daily Reminder Banner */}
        <DailyReminderBanner />

        {/* Summary Cards */}
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

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MonthlyExpenseChart data={monthlyExpenses} />
          </div>
          <CategoryPieChart data={categoryExpenses} />
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;