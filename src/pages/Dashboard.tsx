import DashboardLayout from "@/components/DashboardLayout";
import SummaryCard from "@/components/SummaryCard";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import RecentActivityTable from "@/components/RecentActivityTable";
import { useSession } from "@/integrations/supabase/session-context";
import { Loader2, DollarSign, Wallet, TrendingDown, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useFinancialSummary } from "@/hooks/use-financial-summary";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
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
    recentExpenses, // Added recentExpenses
    isLoading 
  } = useFinancialSummary();

  const budgetUsedPercentage = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold mb-4">
          Welcome back, {user?.email?.split('@')[0]} 👋
        </h1>
        
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={Wallet}
            colorClass="text-green-500"
            delay={0.2}
          />
          <SummaryCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            icon={TrendingDown}
            colorClass="text-red-500"
            delay={0.4}
          />
          <SummaryCard
            title="Remaining Balance"
            value={formatCurrency(remainingBalance)}
            icon={DollarSign}
            colorClass={remainingBalance >= 0 ? "text-blue-500" : "text-destructive"}
            delay={0.6}
          />
          <SummaryCard
            title="Budget Used"
            value={`${budgetUsedPercentage}%`}
            icon={Target}
            colorClass={budgetUsedPercentage > 100 ? "text-destructive" : "text-yellow-500"}
            delay={0.8}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlyExpenseChart data={monthlyExpenses} />
          <CategoryPieChart data={categoryExpenses} />
        </div>

        {/* Recent Activity */}
        <RecentActivityTable expenses={recentExpenses} />
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;