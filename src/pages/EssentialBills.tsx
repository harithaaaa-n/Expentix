import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSession } from '@/integrations/supabase/session-context';
import { supabase } from '@/integrations/supabase/client';
import { EssentialBill, EssentialBillFormValues } from '@/types/bills';
import { Loader2, Plus, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { showError, showSuccess } from '@/utils/toast';
import EssentialBillForm from '@/components/EssentialBillForm';
import EssentialBillItem from '@/components/EssentialBillItem';
import EssentialBillSummary from '@/components/EssentialBillSummary';
import { useEssentialBills } from '@/hooks/use-essential-bills';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format, parseISO } from 'date-fns';

const EssentialBillsPage: React.FC = () => {
  const { user } = useSession();
  const { bills, isLoading, refetch } = useEssentialBills();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<EssentialBillFormValues | undefined>(undefined);

  const handleFormSubmit = async (data: EssentialBillFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const billData = {
      ...data,
      user_id: user.id,
      amount: data.amount,
      due_date: data.due_date ? format(data.due_date, 'yyyy-MM-dd') : null,
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
        showSuccess('Essential bill updated successfully!');
      } else {
        // Add new bill
        const { error } = await supabase
          .from('essential_bills')
          .insert(billData)
          .select();

        if (error) throw error;
        showSuccess('Essential bill added successfully!');
      }
      
      refetch();
      setIsModalOpen(false);
      setEditingBill(undefined);
    } catch (error: any) {
      showError('Operation failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this essential bill?')) return;

    try {
      const { error } = await supabase
        .from('essential_bills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess('Essential bill deleted successfully!');
      refetch();
    } catch (error: any) {
      showError('Deletion failed: ' + error.message);
    }
  };

  const handleEdit = (bill: EssentialBill) => {
    // Convert date strings back to Date objects for the form
    const billForForm: EssentialBillFormValues = {
      ...bill,
      amount: parseFloat(String(bill.amount)),
      due_date: parseISO(bill.due_date),
      last_paid_date: bill.last_paid_date ? parseISO(bill.last_paid_date) : null,
    };
    setEditingBill(billForForm);
    setIsModalOpen(true);
  };

  const handleMarkPaid = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('essential_bills')
        .update({ payment_status: 'Paid', last_paid_date: format(new Date(), 'yyyy-MM-dd') })
        .eq('id', id);

      if (error) throw error;
      showSuccess('Bill marked as Paid!');
      refetch();
    } catch (error: any) {
      showError('Failed to mark bill as paid: ' + error.message);
    }
  };

  const handleAdd = () => {
    setEditingBill(undefined);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Zap className="mr-3 h-7 w-7 text-yellow-500" /> Essential Bills Tracker
            </h1>
            <p className="text-muted-foreground">Manage recurring family expenses, due dates, and payment status.</p>
          </div>
          <div className="flex space-x-2 self-start md:self-center">
            <Button variant="outline" onClick={() => showSuccess("Exporting monthly bill report...")}>
              <FileText className="h-4 w-4 mr-2" /> Export Report
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Bill
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingBill ? 'Edit Essential Bill' : 'Add New Essential Bill'}</DialogTitle>
                </DialogHeader>
                <EssentialBillForm 
                  initialData={editingBill} 
                  onSubmit={handleFormSubmit} 
                  isSubmitting={isSubmitting}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <EssentialBillSummary />

        <Separator />

        {/* Bill List */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming & Pending Bills</CardTitle>
          </CardHeader>
          <CardContent>
            {bills.length === 0 ? (
              <div className="text-center p-10 text-muted-foreground">
                No essential bills tracked yet. Add your first recurring expense!
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence initial={false}>
                  {bills.map((bill) => (
                    <EssentialBillItem 
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
          </CardContent>
        </Card>
        
        {/* Placeholder for Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Essential Bills Trend Analysis</CardTitle>
            <CardDescription>Monthly spending trend for essential bills.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Trend Chart Placeholder (Requires historical data)</p>
          </CardContent>
        </Card>

      </motion.div>
    </DashboardLayout>
  );
};

export default EssentialBillsPage;