import React from 'react';
import { Bill } from '@/types/bill';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isPast } from 'date-fns';
import { Calendar, DollarSign, Trash2, Edit, FileText, Zap, Home, Droplet, Heart, ShoppingCart, Fuel, GraduationCap, AlertTriangle, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BillItemProps {
  bill: Bill;
  onEdit: (bill: Bill) => void;
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
    case 'Rent/Mortgage': return Home;
    case 'Water': return Droplet;
    case 'Gas': return Flame; // Changed from Gas to Flame
    case 'Medical': return Heart;
    case 'Grocery': return ShoppingCart;
    case 'Fuel/Transport': return Fuel;
    case 'Education': return GraduationCap;
    default: return DollarSign;
  }
};

const getStatusBadge = (status: Bill['payment_status'], dueDate: string) => {
  const isOverdue = status === 'Pending' && isPast(new Date(dueDate));
  
  if (isOverdue) {
    return <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">Overdue</Badge>;
  }

  switch (status) {
    case 'Paid':
      return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
    case 'Pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'Overdue':
      return <Badge variant="destructive">Overdue</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const BillItem: React.FC<BillItemProps> = ({ bill, onEdit, onDelete, onMarkPaid }) => {
  const Icon = getCategoryIcon(bill.category);
  const isPending = bill.payment_status === 'Pending';
  const isOverdue = isPending && isPast(new Date(bill.due_date));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "hover:shadow-lg transition-shadow",
        isOverdue ? "border-destructive ring-2 ring-destructive/50" : "border-border"
      )}>
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <Icon className={cn("h-5 w-5", isOverdue ? "text-destructive" : "text-primary")} />
              <span>{bill.title}</span>
            </div>
            <span className="text-2xl font-bold text-destructive">
              {formatCurrency(bill.amount)}
            </span>
          </CardTitle>
          <CardDescription className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Due: {format(new Date(bill.due_date), 'PPP')}</span>
            </div>
            {getStatusBadge(bill.payment_status, bill.due_date)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm border-t pt-3">
            <span className="text-muted-foreground">Recurrence:</span>
            <span className="font-medium">{bill.recurrence}</span>
          </div>
          
          {bill.description && (
            <p className="text-sm text-muted-foreground italic">
              {bill.description}
            </p>
          )}

          <div className="flex justify-between items-center pt-2 border-t">
            {bill.bill_url ? (
              <a href={bill.bill_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center">
                <FileText className="h-3 w-3 mr-1" /> View Bill/Receipt
              </a>
            ) : (
              <span className="text-xs text-muted-foreground">No bill attached</span>
            )}
            <div className="space-x-2">
              {isPending && (
                <Button variant="outline" size="sm" onClick={() => onMarkPaid(bill.id!)} className="text-green-600 border-green-600/50 hover:bg-green-500/10">
                  Mark Paid
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

export default BillItem;