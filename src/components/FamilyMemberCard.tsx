import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, TrendingDown, TrendingUp, Tag, Loader2, Plus, Minus, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { FamilyMember } from '@/types/settings';
import { useFinancialSummary } from '@/hooks/use-financial-summary';
import { cn } from '@/lib/utils';
import { ColoredProgress } from './ColoredProgress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MemberTransactionForm from './MemberTransactionForm';
import { Button } from '@/components/ui/button';

interface FamilyMemberCardProps {
  member: FamilyMember;
  ownerName: string;
  ownerId: string;
  allMembers: FamilyMember[];
  onTransactionSuccess: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({ member, ownerName, ownerId, allMembers, onTransactionSuccess }) => {
  // Use the owner's ID as the targetUserId, but filter by member.id for individual stats
  const { 
    totalIncome, 
    totalExpenses, 
    remainingBalance, 
    budgetUsage, 
    topCategories, 
    isLoading 
  } = useFinancialSummary(member.user_id, member.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialType, setInitialType] = useState<'expense' | 'income'>('expense');

  const handleOpenModal = (type: 'expense' | 'income') => {
    setInitialType(type);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    onTransactionSuccess(); // Trigger refetch in parent
  };

  const totalBudgeted = budgetUsage.reduce((sum, b) => sum + b.budgeted, 0);
  const totalSpent = budgetUsage.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  
  const progressColor = totalPercentage > 100 ? 'bg-destructive' : (totalPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500');
  const progressValue = Math.min(100, totalPercentage);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn(
        "h-full flex flex-col hover:shadow-xl transition-shadow backdrop-blur-sm",
        totalPercentage > 100 ? "border-destructive/50" : "border-border"
      )}>
        <CardHeader className="flex flex-row items-center space-x-4 pb-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatar_url || ''} alt={member.name} />
            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{member.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{member.relation || 'Family Member'}</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 pt-4 border-t flex-grow">
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <>
              {/* Summary Row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-green-500/10 rounded-md">
                  <p className="text-xs text-muted-foreground">Income</p>
                  <p className="font-semibold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="p-2 bg-red-500/10 rounded-md">
                  <p className="text-xs text-muted-foreground">Expense</p>
                  <p className="font-semibold text-destructive">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-md">
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className={cn("font-semibold", remainingBalance >= 0 ? "text-blue-600" : "text-destructive")}>
                    {formatCurrency(remainingBalance)}
                  </p>
                </div>
              </div>

              {/* Budget Progress */}
              {totalBudgeted > 0 && (
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium flex items-center">
                      {totalPercentage > 100 && <AlertTriangle className="h-4 w-4 mr-1 text-destructive" />}
                      Budget Used
                    </span>
                    <span className="font-semibold text-primary">
                      {totalPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <ColoredProgress value={progressValue} className="h-2" indicatorClassName={progressColor} />
                  <p className="text-xs text-muted-foreground text-right">
                    {formatCurrency(totalSpent)} / {formatCurrency(totalBudgeted)}
                  </p>
                </div>
              )}

              {/* Top Category */}
              {topCategories.length > 0 && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Tag className="h-4 w-4 mr-2 text-primary" />
                    Top Category
                  </span>
                  <span className="font-semibold">
                    {topCategories[0].name}
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
        
        {/* Action Buttons */}
        <div className="p-4 pt-0 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-green-600 border-green-600/50 hover:bg-green-500/10"
            onClick={() => handleOpenModal('income')}
          >
            <Plus className="h-4 w-4 mr-1" /> Income
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-destructive border-destructive/50 hover:bg-red-500/10"
            onClick={() => handleOpenModal('expense')}
          >
            <Minus className="h-4 w-4 mr-1" /> Expense
          </Button>
        </div>
      </Card>

      {/* Transaction Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Log Transaction for {member.name}</DialogTitle>
          </DialogHeader>
          <MemberTransactionForm 
            members={allMembers}
            ownerName={ownerName}
            ownerId={ownerId}
            initialMemberId={member.id}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FamilyMemberCard;