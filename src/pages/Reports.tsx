import { useFinancialSummary } from "@/hooks/use-financial-summary";
import { Loader2, FileText, FileJson, TrendingUp, TrendingDown, Pizza, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";
import MonthlyExpenseChart from "@/components/MonthlyExpenseChart";
import ComparisonCard from "@/components/ComparisonCard";
import TopCategoriesList from "@/components/TopCategoriesList";
import BudgetUtilizationChart from "@/components/BudgetUtilizationChart";
import InsightCard from "@/components/InsightCard";
import CategoryPieChart from "@/components/CategoryPieChart";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { showError, showSuccess } from "@/utils/toast";
import React from "react";

const Reports = () => {
  const { 
    monthlyExpenses, 
    comparison,
    topCategories,
    totalExpenses,
    budgetUsage,
    categoryExpenses,
    isLoading: isFinancialLoading 
  } = useFinancialSummary();

  const handleExport = (format: 'pdf' | 'csv') => {
    showSuccess(`Exporting data as ${format.toUpperCase()}... (Feature coming soon!)`);
  };

  const generateInsights = React.useCallback(() => {
    const insights = [];
    let delay = 0.2;

    // Insight 1: Overall spending trend
    if (comparison.expenseChangePercent > 5) {
      insights.push({
        icon: <TrendingUp className="h-5 w-5 text-red-500" />,
        text: `Spending is up by ${comparison.expenseChangePercent.toFixed(0)}% compared to last month.`,
        type: 'negative',
        delay: (delay += 0.2),
      });
    } else if (comparison.expenseChangePercent < -5) {
      insights.push({
        icon: <TrendingDown className="h-5 w-5 text-green-500" />,
        text: `Great job! Spending is down by ${Math.abs(comparison.expenseChangePercent).toFixed(0)}% this month.`,
        type: 'positive',
        delay: (delay += 0.2),
      });
    }

    // Insight 2: Top spending category
    if (topCategories.length > 0 && totalExpenses > 0) {
      const topCategory = topCategories[0];
      const percentageOfTotal = (topCategory.value / totalExpenses) * 100;
      if (percentageOfTotal > 25) {
        insights.push({
          icon: <Pizza className="h-5 w-5 text-yellow-500" />,
          text: `${topCategory.name} makes up ${percentageOfTotal.toFixed(0)}% of your total expenses.`,
          type: 'neutral',
          delay: (delay += 0.2),
        });
      }
    }
    
    // Insight 3: Budget status
    const overspentBudgets = budgetUsage.filter(b => b.status === 'danger');
    if (overspentBudgets.length > 0) {
        insights.push({
            icon: <TrendingUp className="h-5 w-5 text-red-500" />,
            text: `You've gone over budget in ${overspentBudgets.length} categor${overspentBudgets.length > 1 ? 'ies' : 'y'}.`,
            type: 'negative',
            delay: (delay += 0.2),
        });
    } else if (budgetUsage.length > 0) {
        insights.push({
            icon: <PiggyBank className="h-5 w-5 text-green-500" />,
            text: "You're on track with all your budgets this month. Keep it up!",
            type: 'positive',
            delay: (delay += 0.2),
        });
    }

    return insights;
  }, [comparison, topCategories, totalExpenses, budgetUsage]);

  const insights = generateInsights();

  if (isFinancialLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground">Your detailed financial summary and insights.</p>
        </div>
        <div className="flex space-x-2 self-start md:self-center">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <FileJson className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <ComparisonCard data={comparison} />
          <TopCategoriesList data={topCategories} totalExpenses={totalExpenses} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BudgetUtilizationChart budgetUsage={budgetUsage} />
              <CategoryPieChart data={categoryExpenses} />
          </div>
          <MonthlyExpenseChart data={monthlyExpenses} />
        </div>
      </div>

      {/* Smart Insights Section */}
      <Card>
          <CardHeader>
              <CardTitle>💡 Smart Insights</CardTitle>
              <CardContent className="p-0 pt-4">
                  {insights.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                          {insights.map((insight, index) => (
                              <InsightCard key={index} {...insight} />
                          ))}
                      </div>
                  ) : (
                      <p className="text-muted-foreground text-center p-4">
                          Not enough data to generate insights yet. Keep tracking!
                      </p>
                  )}
              </CardContent>
          </CardHeader>
      </Card>

    </motion.div>
  );
};

export default Reports;