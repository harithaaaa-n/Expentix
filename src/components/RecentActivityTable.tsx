import React from 'react';
import { Expense } from '@/types/expense';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Tag, DollarSign, Calendar, CreditCard, Wallet, Banknote, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RecentActivityTableProps {
  expenses: Expense[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const getPaymentIcon = (type: string | null) => {
  switch (type) {
    case 'Credit Card':
      return <CreditCard className="h-4 w-4 text-blue-500" />;
    case 'Debit Card':
      return <CreditCard className="h-4 w-4 text-indigo-500" />;
    case 'Cash':
      return <Banknote className="h-4 w-4 text-green-500" />;
    case 'UPI/Digital Wallet':
      return <Smartphone className="h-4 w-4 text-purple-500" />;
    case 'Bank Transfer':
      return <Wallet className="h-4 w-4 text-yellow-500" />;
    default:
      return <DollarSign className="h-4 w-4 text-muted-foreground" />;
  }
};

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({ expenses }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>📅 Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No recent expenses found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense, index) => (
                  <TableRow key={expense.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span>{expense.category}</span>
                    </TableCell>
                    <TableCell className="text-sm truncate max-w-xs">
                      {expense.title}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(expense.expense_date), 'MMM dd')}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-destructive">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivityTable;