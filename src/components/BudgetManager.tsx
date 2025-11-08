import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Budget, BudgetFormValues, BudgetSchema } from '@/types/settings';
import { ExpenseCategories } from '@/types/expense';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, DollarSign, Trash2, Edit, CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/integrations/supabase/session-context';
import { showError, showSuccess } from '@/utils/toast';
import { format, startOfMonth, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// --- Form Component ---
interface BudgetFormProps {
  initialData?: BudgetFormValues;
  onSubmit: (data: BudgetFormValues) => void;
  isSubmitting: boolean;
  existingCategories: string[];
}

const BudgetForm: React.FC<BudgetFormProps> = ({ initialData, onSubmit, isSubmitting, existingCategories }) => {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(BudgetSchema),
    defaultValues: initialData || {
      category: ExpenseCategories[0],
      amount: 0,
      month: startOfMonth(new Date()),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        amount: parseFloat(String(initialData.amount)),
        month: new Date(initialData.month),
      });
    }
  }, [initialData, form.reset]);

  const availableCategories = useMemo(() => {
    if (initialData) return ExpenseCategories; // Allow editing existing category
    
    return ExpenseCategories.filter(cat => !existingCategories.includes(cat));
  }, [existingCategories, initialData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!!initialData} // Cannot change category when editing
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Month */}
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Month</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={!!initialData} // Cannot change month when editing
                      >
                        {field.value ? (
                          format(field.value, "MMM yyyy")
                        ) : (
                          <span>Pick a month</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => field.onChange(date ? startOfMonth(date) : undefined)}
                      captionLayout="dropdown-buttons"
                      fromYear={2020}
                      toYear={new Date().getFullYear() + 1}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="500.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting || availableCategories.length === 0 && !initialData}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : initialData ? (
            'Save Budget'
          ) : (
            'Set Budget'
          )}
        </Button>
        {availableCategories.length === 0 && !initialData && (
          <p className="text-sm text-destructive text-center">All categories already have a budget set for this month.</p>
        )}
      </form>
    </Form>
  );
};

// --- Manager Component ---
const BudgetManager: React.FC = () => {
  const { user } = useSession();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetFormValues | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()));

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const fetchBudgets = async (month: Date) => {
    if (!user) return;
    setIsLoading(true);
    
    const monthString = format(month, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', monthString)
      .order('category', { ascending: true });

    if (error) {
      showError('Failed to fetch budgets: ' + error.message);
    } else {
      setBudgets(data as Budget[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchBudgets(selectedMonth);
    }
  }, [user, selectedMonth]);

  const handleFormSubmit = async (data: BudgetFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const budgetMonth = startOfMonth(data.month);
    const budgetData = {
      ...data,
      user_id: user.id,
      amount: data.amount,
      month: format(budgetMonth, 'yyyy-MM-dd'),
    };

    try {
      if (editingBudget?.id) {
        // Update existing budget
        const { error } = await supabase
          .from('budgets')
          .update(budgetData)
          .eq('id', editingBudget.id)
          .select();

        if (error) throw error;
        showSuccess('Budget updated successfully!');
      } else {
        // Add new budget
        const { error } = await supabase
          .from('budgets')
          .insert(budgetData)
          .select();

        if (error) throw error;
        showSuccess('Budget set successfully!');
      }
      
      // Refresh list for the current selected month
      setSelectedMonth(budgetMonth); 
      await fetchBudgets(budgetMonth);
      setIsModalOpen(false);
      setEditingBudget(undefined);
    } catch (error: any) {
      // Handle unique constraint violation (user_id, category, month)
      if (error.code === '23505') {
        showError(`A budget for ${data.category} in ${format(data.month, 'MMM yyyy')} already exists.`);
      } else {
        showError('Operation failed: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess('Budget deleted successfully!');
      setBudgets(prev => prev.filter(b => b.id !== id));
    } catch (error: any) {
      showError('Deletion failed: ' + error.message);
    }
  };

  const handleEdit = (budget: Budget) => {
    // Convert month string back to Date object for the form
    const budgetForForm: BudgetFormValues = {
      ...budget,
      amount: parseFloat(String(budget.amount)),
      month: parseISO(budget.month),
    };
    setEditingBudget(budgetForForm);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBudget(undefined);
    setIsModalOpen(true);
  };

  const existingCategoriesForMonth = budgets.map(b => b.category);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Monthly Budgets</CardTitle>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedMonth, "MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedMonth}
                onSelect={(date) => date && setSelectedMonth(startOfMonth(date))}
                captionLayout="dropdown-buttons"
                fromYear={2020}
                toYear={new Date().getFullYear() + 1}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" /> Set Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingBudget ? 'Edit Budget' : 'Set New Budget'}</DialogTitle>
              </DialogHeader>
              <BudgetForm 
                initialData={editingBudget} 
                onSubmit={handleFormSubmit} 
                isSubmitting={isSubmitting}
                existingCategories={existingCategoriesForMonth}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : budgets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No budgets set for {format(selectedMonth, 'MMM yyyy')}.</p>
        ) : (
          <div className="space-y-3">
            {budgets.map((budget) => (
              <div key={budget.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md border">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">{budget.category}</p>
                    <p className="text-xs text-muted-foreground">Budget for {format(parseISO(budget.month), 'MMM yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-primary">
                    {formatCurrency(parseFloat(String(budget.amount)))}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id!)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetManager;