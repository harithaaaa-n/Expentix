import React from 'react';
import { Expense } from '@/types/expense';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Tag, DollarSign, Calendar, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-start">
            {expense.title}
            <span className={cn(
              "text-2xl font-bold",
              expense.amount > 0 ? "text-destructive" : "text-green-600"
            )}>
              {formatCurrency(expense.amount)}
            </span>
          </CardTitle>
          <CardDescription className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(expense.expense_date), 'PPP')}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-medium">{expense.category}</span>
            {expense.payment_type && (
              <span className="text-muted-foreground ml-2">({expense.payment_type})</span>
            )}
          </div>
          
          {expense.description && (
            <p className="text-sm text-muted-foreground italic">
              {expense.description}
            </p>
          )}

          <div className="flex justify-end space-x-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => onEdit(expense)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(expense.id!)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExpenseItem;