import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSession } from '@/integrations/supabase/session-context';
import { supabase } from '@/integrations/supabase/client';
import { Bill, BillFormValues, BillCategories, PaymentStatuses } from '@/types/bill';
import { Loader2, Plus, Filter, Search, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { showError, showSuccess } from '@/utils/toast';
import BillForm from '@/components/BillForm';
import BillItem from '@/components/BillItem';
import { AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { format, startOfMonth, subMonths } from 'date-fns';
import SummaryCard from '@/components/SummaryCard';

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const BillManagement = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<BillFormValues | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string>('Pending');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBills = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('essential_bills')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (error) {
      showError('Failed to fetch bills: ' + error.message);
    } else {
      setBills(data as Bill[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [user]);

  const handleFormSubmit = async (data: BillFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const billData = {
      ...data,
      user_id: user.id,
      amount: data.amount,
      due_date: format(data.due_date, 'yyyy-MM-dd'),
      last_paid_date: data.last_paid_date ? format(data.last_paid_date, 'yyyy-MM-dd') : null,
      bill_url: data.bill_url || null,
      description: data.description || null,
    };

    try {
      if (editingBill?.id) {
        // Update existing bill
        const { error } = await supabase
          .from('essential_bills')
          .update(billData)
          .eq('id', editingBill.id)
          .select();

        if (error) throw error;
        showSuccess('Bill updated successfully!');
      } else {
        // Add new bill
        const { error } = await supabase
          .from('essential_bills')
          .insert(billData)
          .select();

        if (error) throw error;
        showSuccess('Essential bill added successfully!');
      }
      
      await fetchBills();
      setIsModalOpen(false);
      setEditingBill(undefined);
    } catch (error: any) {
      showError('Operation failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;

    try {
      const { error } = await supabase
        .from('essential_bills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess('Bill deleted successfully!');
      setBills(prev => prev.filter(b => b.id !== id));
    } catch (error: any) {
      showError('Deletion failed: ' + error.message);
    }
  };

  const handleEdit = (bill: Bill) => {
    const billForForm: BillFormValues = {
      ...bill,
      amount: parseFloat(String(bill.amount)),
      due_date: new Date(bill.due_date),
      last_paid_date: bill.last_paid_date ? new Date(bill.last_paid_date) : null,
    };
    setEditingBill(billForForm);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBill(undefined);
    setIsModalOpen(true);
  };

  const handleMarkPaid = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('essential_bills')
        .update({ 
          payment_status: 'Paid', 
          last_paid_date: format(new Date(), 'yyyy-MM-dd') 
        })
        .eq('id', id);

      if (error) throw error;
      showSuccess('Bill marked as Paid!');
      await fetchBills();
    } catch (error: any) {
      showError('Failed to mark bill as paid: ' + error.message);
    }
  };

  const filteredBills = useMemo(() => {
    let filtered = bills;

    // 1. Status Filter
    if (filterStatus !== 'All') {
      filtered = filtered.filter(b => b.payment_status === filterStatus);
    }

    // 2. Search Filter (Title or Description)
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(lowerCaseSearch) || 
        b.description?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return filtered;
  }, [bills, filterStatus, searchTerm]);

  // --- Analytics Calculation ---
  const currentMonth = startOfMonth(new Date());
  const lastMonth = startOfMonth(subMonths(new Date(), 1));

  const currentMonthBills = bills.filter(b => new Date(b.due_date) >= currentMonth);
  const lastMonthBills = bills.filter(b => new Date(b.due_date) >= lastMonth && new Date(b.due_date) < currentMonth);

  const totalCurrentMonthBills = currentMonthBills.reduce((sum, b) => sum + b.amount, 0);
  const totalLastMonthBills = lastMonthBills.reduce((sum, b) => sum + b.amount, 0);
  
  const pendingBills = bills.filter(b => b.payment_status === 'Pending');
  const overdueBills = pendingBills.filter(b => new Date(b.due_date) < new Date());

  const billDifference = totalCurrentMonthBills - totalLastMonthBills;
  const billChangePercent = totalLastMonthBills > 0 
    ? (billDifference / totalLastMonthBills) * 100 
    : (totalCurrentMonthBills > 0 ? 100 : 0);

  const trendIcon = billDifference > 0 ? TrendingUp : (billDifference < 0 ? TrendingDown : Zap);
  const trendColor = billDifference > 0 ? "text-destructive" : (billDifference < 0 ? "text-green-500" : "text-muted-foreground");

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
        <h1 className="text-3xl font-bold flex items-center">
          <Zap className="mr-3 h-7 w-7 text-blue-500" /> Essential Bills Tracker
        </h1>
        <p className="text-muted-foreground">Manage recurring payments, due dates, and payment status.</p>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Bills This Month"
            value={formatCurrency(totalCurrentMonthBills)}
            icon={DollarSign}
            colorClass="text-blue-500"
            delay={0.1}
          />
          <SummaryCard
            title="Pending Bills"
            value={pendingBills.length}
            icon={Filter}
            colorClass="text-yellow-500"
            delay={0.2}
          />
          <SummaryCard
            title="Overdue Bills"
            value={overdueBills.length}
            icon={AlertTriangle}
            colorClass="text-destructive"
            delay={0.3}
          />
          <SummaryCard
            title="Monthly Trend"
            value={`${billChangePercent.toFixed(1)}%`}
            icon={trendIcon}
            colorClass={trendColor}
            delay={0.4}
          />
        </div>

        {/* Controls and Filters */}
        <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Add Button */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Bill
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingBill ? 'Edit Essential Bill' : 'Add New Essential Bill'}</DialogTitle>
              </DialogHeader>
              <BillForm 
                initialData={editingBill} 
                onSubmit={handleFormSubmit} 
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>

          {/* Filters */}
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

            {/* Status Filter */}
            <Select onValueChange={setFilterStatus} defaultValue="Pending">
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {PaymentStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Bill List */}
        {filteredBills.length === 0 ? (
          <div className="text-center p-10 text-muted-foreground border rounded-lg">
            No bills found matching the current filter.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {filteredBills.map((bill) => (
                <BillItem 
                  key={bill.id} 
                  bill={bill} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                  onMarkPaid={handleMarkPaid}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {/* Analytics Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Bill Analytics & Insights</CardTitle>
            <CardDescription>Category-wise spending and trend analysis (Coming Soon).</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Charts showing essential bills as a percentage of total family expenses will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BillManagement;