import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSession } from '@/integrations/supabase/session-context';
import { supabase } from '@/integrations/supabase/client';
import { Expense, ExpenseFormValues, ExpenseCategories } from '@/types/expense';
import { Loader2, Plus, List, Table, Filter, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { showError, showSuccess } from '@/utils/toast';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseItem from '@/components/ExpenseItem';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

// --- Expense Table Component (for Table View) ---
interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onEdit, onDelete }) => {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="text-left text-sm font-medium text-muted-foreground">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Payment</th>
            <th className="px-4 py-2">Receipt</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <AnimatePresence initial={false} mode="popLayout">
            {expenses.map((expense) => (
              <motion.tr 
                key={expense.id} 
                className="hover:bg-muted/50 transition-colors"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-4 py-3 text-sm font-medium">{expense.title}</td>
                <td className={`px-4 py-3 text-sm font-semibold ${expense.amount > 0 ? "text-destructive" : "text-green-600"}`}>
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-3 text-sm">{expense.category}</td>
                <td className="px-4 py-3 text-sm">{format(new Date(expense.expense_date), 'MMM dd, yyyy')}</td>
                <td className="px-4 py-3 text-sm">{expense.payment_type || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">
                  {expense.receipt_url ? (
                    <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View
                    </a>
                  ) : 'No'}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(expense)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(expense.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};


const ExpenseManagement = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseFormValues | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const totalBalance = 0; // Placeholder for DashboardLayout

  const fetchExpenses = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('expense_date', { ascending: false });

    if (error) {
      showError('Failed to fetch expenses: ' + error.message);
    } else {
      setExpenses(data as Expense[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const handleFormSubmit = async (data: ExpenseFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const expenseData = {
      ...data,
      user_id: user.id,
      amount: data.amount, // Ensure amount is numeric
      expense_date: format(data.expense_date, 'yyyy-MM-dd'), // Format date for Supabase
      receipt_url: data.receipt_url || null,
    };

    try {
      if (editingExpense?.id) {
        // Update existing expense
        const { error } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', editingExpense.id)
          .select();

        if (error) throw error;
        showSuccess('Expense updated successfully!');
      } else {
        // Add new expense
        const { error } = await supabase
          .from('expenses')
          .insert(expenseData)
          .select();

        if (error) throw error;
        showSuccess('Expense added successfully!');
      }
      
      await fetchExpenses();
      setIsModalOpen(false);
      setEditingExpense(undefined);
    } catch (error: any) {
      showError('Operation failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess('Expense deleted successfully!');
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (error: any) {
      showError('Deletion failed: ' + error.message);
    }
  };

  const handleEdit = (expense: Expense) => {
    // Convert date string back to Date object for the form
    const expenseForForm: ExpenseFormValues = {
      ...expense,
      amount: parseFloat(String(expense.amount)),
      expense_date: new Date(expense.expense_date),
    };
    setEditingExpense(expenseForForm);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingExpense(undefined);
    setIsModalOpen(true);
  };

  const filteredExpenses = useMemo(() => {
    let filtered = expenses;

    // 1. Category Filter
    if (filterCategory !== 'All') {
      filtered = filtered.filter(e => e.category === filterCategory);
    }

    // 2. Search Filter (Title or Description)
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(lowerCaseSearch) || 
        e.description?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return filtered;
  }, [expenses, filterCategory, searchTerm]);


  if (isSessionLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout totalBalance={totalBalance}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Expense Management</h1>

        {/* Controls and Filters */}
        <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Add Button */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              </DialogHeader>
              <ExpenseForm 
                initialData={editingExpense} 
                onSubmit={handleFormSubmit} 
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>

          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search title/desc..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select onValueChange={setFilterCategory} defaultValue="All">
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {ExpenseCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <ToggleGroup type="single" value={viewMode} onValueChange={(value: 'table' | 'card') => value && setViewMode(value)} className="w-full sm:w-auto justify-center">
              <ToggleGroupItem value="card" aria-label="Toggle card view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label="Toggle table view">
                <Table className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Card>

        {/* Expense List/Table */}
        {filteredExpenses.length === 0 ? (
          <div className="text-center p-10 text-muted-foreground border rounded-lg">
            No expenses found. Start by adding a new one!
          </div>
        ) : (
          <>
            {viewMode === 'card' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence initial={false}>
                  {filteredExpenses.map((expense) => (
                    <ExpenseItem 
                      key={expense.id} 
                      expense={expense} 
                      onEdit={handleEdit} 
                      onDelete={handleDelete} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <Card>
                <ExpenseTable 
                  expenses={filteredExpenses} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExpenseManagement;