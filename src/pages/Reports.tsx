import React, { useState } from "react";
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/integrations/supabase/session-context';
import { Expense } from '@/types/expense';
import { Income } from '@/types/income';
import { format } from 'date-fns';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

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
  
  const { user } = useSession();
  const [isExporting, setIsExporting] = useState(false);

  const fetchAllTransactions = async () => {
    if (!user) return { expenses: [], income: [] };
    const [expenseRes, incomeRes] = await Promise.all([
        supabase.from('expenses').select('*').eq('user_id', user.id),
        supabase.from('income').select('*').eq('user_id', user.id)
    ]);
    if (expenseRes.error || incomeRes.error) {
        showError("Failed to fetch data for export.");
        throw new Error("Failed to fetch data");
    }
    return {
        expenses: expenseRes.data as Expense[],
        income: incomeRes.data as Income[]
    };
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
        const { expenses, income } = await fetchAllTransactions();
        
        const headers = ['Date', 'Type', 'Title/Source', 'Amount (INR)', 'Category', 'Description'];
        
        const expenseRows = expenses.map(e => [
            format(new Date(e.expense_date), 'dd-MMM-yyyy'),
            'Expense',
            e.title,
            -e.amount,
            e.category,
            e.description || ''
        ]);

        const incomeRows = income.map(i => [
            format(new Date(i.date), 'dd-MMM-yyyy'),
            'Income',
            i.source,
            i.amount,
            i.source, // Category for income can be the source itself
            i.description || ''
        ]);

        const allRows = [...expenseRows, ...incomeRows]
            .sort((a, b) => new Date(b[0] as string).getTime() - new Date(a[0] as string).getTime());

        const csvContent = [
            headers.join(','),
            ...allRows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Expentix_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess("CSV export successful!");

    } catch (error) {
        // Error is already shown in fetch function
    } finally {
        setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
        const { expenses, income } = await fetchAllTransactions();
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text("Expentix Financial Report", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated for: ${user?.email}`, 14, 30);
        doc.text(`Generated on: ${format(new Date(), 'dd MMM, yyyy')}`, 14, 36);

        // Summary
        const totalIncomeVal = income.reduce((sum, i) => sum + i.amount, 0);
        const totalExpensesVal = expenses.reduce((sum, e) => sum + e.amount, 0);
        const balance = totalIncomeVal - totalExpensesVal;

        autoTable(doc, {
            startY: 45,
            head: [['Metric', 'Amount (INR)']],
            body: [
                ['Total Income', formatCurrency(totalIncomeVal)],
                ['Total Expenses', formatCurrency(totalExpensesVal)],
                ['Remaining Balance', formatCurrency(balance)],
            ],
            theme: 'grid',
            headStyles: { fillColor: [58, 134, 255] }
        });

        // Transactions Table
        const tableBody = [...expenses, ...income]
            .sort((a, b) => new Date((b as Expense).expense_date || (b as Income).date).getTime() - new Date((a as Expense).expense_date || (a as Income).date).getTime())
            .map(item => {
                if ('expense_date' in item) { // It's an Expense
                    return [format(new Date(item.expense_date), 'dd MMM, yy'), 'Expense', item.title, formatCurrency(-item.amount), item.category];
                } else { // It's an Income
                    return [format(new Date(item.date), 'dd MMM, yy'), 'Income', item.source, formatCurrency(item.amount), 'N/A'];
                }
            });

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 15,
            head: [['Date', 'Type', 'Title/Source', 'Amount', 'Category']],
            body: tableBody,
            theme: 'striped',
            headStyles: { fillColor: [58, 134, 255] },
            didDrawCell: (data) => {
                if (data.column.index === 3 && data.cell.section === 'body') {
                    const text = data.cell.text[0];
                    if (text.includes('-')) {
                        doc.setTextColor(220, 38, 38); // Red for expenses
                    } else {
                        doc.setTextColor(22, 163, 74); // Green for income
                    }
                }
            },
            didDrawPage: (data) => {
                const pageCount = doc.getNumberOfPages();
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
            }
        });

        doc.save(`Expentix_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        showSuccess("PDF export successful!");

    } catch (error) {
        console.error("PDF Export Error:", error);
        showError("PDF export failed. Please try again.");
    } finally {
        setIsExporting(false);
    }
  };

  const generateInsights = React.useCallback(() => {
    const insights = [];
    let delay = 0.2;

    if (comparison.expenseChangePercent > 5) {
      insights.push({ icon: <TrendingUp className="h-5 w-5 text-red-500" />, text: `Spending is up by ${comparison.expenseChangePercent.toFixed(0)}% compared to last month.`, type: 'negative', delay: (delay += 0.2) });
    } else if (comparison.expenseChangePercent < -5) {
      insights.push({ icon: <TrendingDown className="h-5 w-5 text-green-500" />, text: `Great job! Spending is down by ${Math.abs(comparison.expenseChangePercent).toFixed(0)}% this month.`, type: 'positive', delay: (delay += 0.2) });
    }

    if (topCategories.length > 0 && totalExpenses > 0) {
      const topCategory = topCategories[0];
      const percentageOfTotal = (topCategory.value / totalExpenses) * 100;
      if (percentageOfTotal > 25) {
        insights.push({ icon: <Pizza className="h-5 w-5 text-yellow-500" />, text: `${topCategory.name} makes up ${percentageOfTotal.toFixed(0)}% of your total expenses.`, type: 'neutral', delay: (delay += 0.2) });
      }
    }
    
    const overspentBudgets = budgetUsage.filter(b => b.status === 'danger');
    if (overspentBudgets.length > 0) {
        insights.push({ icon: <TrendingUp className="h-5 w-5 text-red-500" />, text: `You've gone over budget in ${overspentBudgets.length} categor${overspentBudgets.length > 1 ? 'ies' : 'y'}.`, type: 'negative', delay: (delay += 0.2) });
    } else if (budgetUsage.length > 0) {
        insights.push({ icon: <PiggyBank className="h-5 w-5 text-green-500" />, text: "You're on track with all your budgets this month. Keep it up!", type: 'positive', delay: (delay += 0.2) });
    }

    return insights;
  }, [comparison, topCategories, totalExpenses, budgetUsage]);

  const insights = generateInsights();

  if (isFinancialLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground">Your detailed financial summary and insights.</p>
        </div>
        <div className="flex space-x-2 self-start md:self-center">
          <Button variant="outline" onClick={handleExportCsv} disabled={isExporting}>{isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileJson className="h-4 w-4 mr-2" />} Export CSV</Button>
          <Button onClick={handleExportPdf} disabled={isExporting}>{isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />} Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6"><ComparisonCard data={comparison} /><TopCategoriesList data={topCategories} totalExpenses={totalExpenses} /></div>
        <div className="lg:col-span-2 space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><BudgetUtilizationChart budgetUsage={budgetUsage} /><CategoryPieChart data={categoryExpenses} /></div><MonthlyExpenseChart data={monthlyExpenses} /></div>
      </div>

      <Card>
          <CardHeader><CardTitle>💡 Smart Insights</CardTitle>
              <CardContent className="p-0 pt-4">
                  {insights.length > 0 ? (<div className="grid gap-4 md:grid-cols-2">{insights.map((insight, index) => (<InsightCard key={index} {...insight} />))}</div>) : (<p className="text-muted-foreground text-center p-4">Not enough data to generate insights yet. Keep tracking!</p>)}
              </CardContent>
          </CardHeader>
      </Card>
    </motion.div>
  );
};

export default Reports;