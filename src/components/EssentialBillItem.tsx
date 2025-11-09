import React from 'react';
import { EssentialBill } from '@/types/bills';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isPast, parseISO } from 'date-fns';
import { Zap, Home, Droplet, Flame, Heart, ShoppingCart, Fuel, GraduationCap, Globe, Clock, CheckCircle, AlertTriangle, XCircle, Trash2, Edit, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface EssentialBillItemProps {
  bill: EssentialBill;
  onEdit: (bill: EssentialBill) => void;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Electricity': return Zap;
    case 'Rent': return Home;
    case 'Water': return Droplet;
    case 'Gas': return Flame; // Changed Gas to Flame
    case 'Medical': return Heart;
    case 'Grocery': return ShoppingCart;
    case 'Fuel': return Fuel;
    case 'Education': return GraduationCap;
    case 'Internet': return Globe;
    default: return Clock;
  }
};

const getStatusBadge = (status: EssentialBill['payment_status']) => {
  switch (status) {
    case 'Paid': return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
    case 'Overdue': return <Badge variant="destructive">Overdue</Badge>;
    case 'Pending': 
    default: return <Badge variant="secondary">Pending</Badge>;
  }
};

const EssentialBillItem: React.FC<EssentialBillItemProps> = ({ bill, onEdit, onDelete, onMarkPaid }) => {
  const Icon = getCategoryIcon(bill.category);
  const isOverdue = bill.payment_status === 'Overdue';
  const isPaid = bill.payment_status === 'Paid';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "hover:shadow-lg transition-shadow border-l-4",
        isOverdue ? "border-destructive" : (isPaid ? "border-green-500" : "border-primary")
      )}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Icon className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-lg">{bill.title}</CardTitle>
                <CardDescription className="text-sm">{bill.category} ({bill.recurrence})</CardDescription>
              </div>
            </div>
            <span className="text-2xl font-bold text-destructive">
              {formatCurrency(bill.amount)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Due: {format(parseISO(bill.due_date), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-end">
              {getStatusBadge(bill.payment_status)}
            </div>
          </div>
          
          {bill.description && (
            <p className="text-sm text-muted-foreground italic border-t pt-2">
              {bill.description}
            </p>
          )}

          <div className="flex justify-between items-center pt-2 border-t">
            {bill.bill_url ? (
              <a href={bill.bill_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center">
                <FileText className="h-3 w-3 mr-1" /> View Bill
              </a>
            ) : (
              <span className="text-xs text-muted-foreground">No bill attached</span>
            )}
            <div className="space-x-2">
              {!isPaid && (
                <Button variant="outline" size="sm" onClick={() => onMarkPaid(bill.id!)} className="text-green-600 border-green-600/50 hover:bg-green-500/10">
                  <CheckCircle className="h-4 w-4 mr-1" /> Paid
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => onEdit(bill)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(bill.id!)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EssentialBillItem;