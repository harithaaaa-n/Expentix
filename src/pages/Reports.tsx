import DashboardLayout from "@/components/DashboardLayout";
import { useFinancialSummary } from "@/hooks/use-financial-summary";
import { Loader2, Download, FileText, FileJson } from "lucide-react";
import { motion } from "framer-motion";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import ComparisonCard from "@/components/ComparisonCard";
import TopCategoriesList from "@/components/TopCategoriesList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showError, showSuccess } from "@/utils/toast";

const Reports = () => {
  const { 
    remainingBalance, 
    monthlyExpenses, 
    categoryExpenses, 
    comparison,
    topCategories,
    totalExpenses,
    isLoading: isFinancialLoading 
  } = useFinancialSummary();

  const handleExport = (format: 'pdf' | 'csv') => {
    // Placeholder for export logic
    showSuccess(`Exporting data as ${format.toUpperCase()}... (Feature coming soon!)`);
    console.log(`Attempting to export data as ${format}`);
  };

  if (isFinancialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout totalBalance={remainingBalance}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <FileJson className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button onClick={() => handleExport('pdf')}>
              <FileText className="h-4 w-4 mr-2" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Key Metrics & Comparison */}
        <div className="grid gap-6 lg:grid-cols-3">
          <ComparisonCard data={comparison} />
          <div className="lg:col-span-2">
            <TopCategoriesList data={categoryExpenses} totalExpenses={totalExpenses} />
          </div>
        </div>

        {/* Detailed Charts */}
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

export default Reports;