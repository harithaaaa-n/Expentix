import DashboardLayout from "@/components/DashboardLayout";
import SummaryCard from "@/components/SummaryCard";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import { useSession } from "@/integrations/supabase/session-context";
import { Loader2, DollarSign, Wallet, TrendingDown, Percent } from "lucide-react";
import { motion } from "framer-motion";

const mockSummaryData = {
  totalIncome: 5000,
  totalExpenses: 1500,
  remainingBalance: 3500,
  budgetUsedPercentage: 30,
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const Dashboard = () => {
  const { isLoading, user } = useSession();

  if (isLoading) {
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
    <DashboardLayout totalBalance={mockSummaryData.remainingBalance}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold mb-4 hidden md:block">
          Welcome back, {user.email?.split('@')[0]}!
        </h1>
        
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Income 💰"
            value={formatCurrency(mockSummaryData.totalIncome)}
            icon={Wallet}
            colorClass="text-green-500"
            delay={0.2}
          />
          <SummaryCard
            title="Total Expenses 💸"
            value={formatCurrency(mockSummaryData.totalExpenses)}
            icon={TrendingDown}
            colorClass="text-red-500"
            delay={0.4}
          />
          <SummaryCard
            title="Remaining Balance 💵"
            value={formatCurrency(mockSummaryData.remainingBalance)}
            icon={DollarSign}
            colorClass={mockSummaryData.remainingBalance >= 0 ? "text-blue-500" : "text-destructive"}
            delay={0.6}
          />
          <SummaryCard
            title="Budget Used % 📊"
            value={`${mockSummaryData.budgetUsedPercentage}%`}
            icon={Percent}
            colorClass="text-yellow-500"
            delay={0.8}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MonthlyExpenseChart />
          </div>
          <CategoryPieChart />
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;