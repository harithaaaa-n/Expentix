import React from 'react';
import { Income } from '@/types/income';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Tag, Calendar, Trash2, Edit, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IncomeItemProps {
  income: Income;
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const IncomeItem: React.FC<IncomeItemProps> = ({ income, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow border-green-500/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-start">
            {income.source}
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(income.amount)}
            </span>
          </CardTitle>
          <CardDescription className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(income.date), 'PPP')}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-medium">{income.source}</span>
          </div>
          
          {income.description && (
            <p className="text-sm text-muted-foreground italic">
              {income.description}
            </p>
          )}

          <div className="flex justify-end space-x-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => onEdit(income)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(income.id!)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IncomeItem;