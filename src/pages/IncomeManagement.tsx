import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSession } from '@/integrations/supabase/session-context';
import { supabase } from '@/integrations/supabase/client';
import { Income, IncomeFormValues, IncomeSources } from '@/types/income';
import { Loader2, Plus, List, Table, Filter, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { showError, showSuccess } from '@/utils/toast';
import IncomeForm from '@/components/IncomeForm';
import IncomeItem from '@/components/IncomeItem';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

// --- Income Table Component (for Table View) ---
interface IncomeTableProps {
  incomeRecords: Income[];
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const IncomeTable: React.FC<IncomeTableProps> = ({ incomeRecords, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="text-left text-sm font-medium text-muted-foreground">
            <th className="px-4 py-2">Source</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <AnimatePresence initial={false} mode="popLayout">
            {incomeRecords.map((income) => (
              <motion.tr 
                key={income.id} 
                className="hover:bg-muted/50 transition-colors"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-4 py-3 text-sm font-medium">{income.source}</td>
                <td className="px-4 py-3 text-sm font-semibold text-green-600">
                  {formatCurrency(income.amount)}
                </td>
                <td className="px-4 py-3 text-sm">{format(new Date(income.date), 'MMM dd, yyyy')}</td>
                <td className="px-4 py-3 text-sm truncate max-w-xs">{income.description || 'N/A'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(income)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(income.id!)}>
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


const IncomeManagement = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const [incomeRecords, setIncomeRecords] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeFormValues | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [filterSource, setFilterSource] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchIncome = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('income')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      showError('Failed to fetch income records: ' + error.message);
    } else {
      setIncomeRecords(data as Income[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchIncome();
    }
  }, [user]);

  const handleFormSubmit = async (data: IncomeFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const incomeData = {
      ...data,
      user_id: user.id,
      amount: data.amount,
      date: format(data.date, 'yyyy-MM-dd'), // Format date for Supabase
      description: data.description || null,
    };

    try {
      if (editingIncome?.id) {
        // Update existing income
        const { error } = await supabase
          .from('income')
          .update(incomeData)
          .eq('id', editingIncome.id)
          .select();

        if (error) throw error;
        showSuccess('Income record updated successfully!');
      } else {
        // Add new income
        const { error } = await supabase
          .from('income')
          .insert(incomeData)
          .select();

        if (error) throw error;
        showSuccess('Income record added successfully!');
      }
      
      await fetchIncome();
      setIsModalOpen(false);
      setEditingIncome(undefined);
    } catch (error: any) {
      showError('Operation failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this income record?')) return;

    try {
      const { error } = await supabase
        .from('income')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess('Income record deleted successfully!');
      setIncomeRecords(prev => prev.filter(i => i.id !== id));
    } catch (error: any) {
      showError('Deletion failed: ' + error.message);
    }
  };

  const handleEdit = (income: Income) => {
    // Convert date string back to Date object for the form
    const incomeForForm: IncomeFormValues = {
      ...income,
      amount: parseFloat(String(income.amount)),
      date: new Date(income.date),
    };
    setEditingIncome(incomeForForm);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingIncome(undefined);
    setIsModalOpen(true);
  };

  const filteredIncome = useMemo(() => {
    let filtered = incomeRecords;

    // 1. Source Filter
    if (filterSource !== 'All') {
      filtered = filtered.filter(i => i.source === filterSource);
    }

    // 2. Search Filter (Source or Description)
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(i => 
        i.source.toLowerCase().includes(lowerCaseSearch) || 
        i.description?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return filtered;
  }, [incomeRecords, filterSource, searchTerm]);


  if (isSessionLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Income Management</h1>

        {/* Controls and Filters */}
        <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Add Button */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Income
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingIncome ? 'Edit Income' : 'Add New Income'}</DialogTitle>
              </DialogHeader>
              <IncomeForm 
                initialData={editingIncome} 
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
                placeholder="Search source/desc..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Source Filter */}
            <Select onValueChange={setFilterSource} defaultValue="All">
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sources</SelectItem>
                {IncomeSources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
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

        {/* Income List/Table */}
        {filteredIncome.length === 0 ? (
          <div className="text-center p-10 text-muted-foreground border rounded-lg">
            No income records found. Start by adding a new one!
          </div>
        ) : (
          <>
            {viewMode === 'card' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence initial={false}>
                  {filteredIncome.map((income) => (
                    <IncomeItem 
                      key={income.id} 
                      income={income} 
                      onEdit={handleEdit} 
                      onDelete={handleDelete} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <Card>
                <IncomeTable 
                  incomeRecords={filteredIncome} 
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

export default IncomeManagement;