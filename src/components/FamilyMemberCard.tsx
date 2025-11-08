import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, TrendingDown, Tag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { FamilyMember } from '@/types/settings';
import { useFinancialSummary } from '@/hooks/use-financial-summary';

interface FamilyMemberCardProps {
  member: FamilyMember;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({ member }) => {
  // Fetch financial summary for the owner of this family group (the authenticated user)
  // NOTE: In a true collaborative setup, we would fetch data filtered by a 'member_id' 
  // or use RLS policies to allow members to see their own data. 
  // For this read-only view, we show the owner's data for context.
  // Since the current data model ties all expenses to the authenticated user (user.id), 
  // we will display the owner's data here, but label it for the member.
  
  // *** IMPORTANT: Since the current data model only stores expenses/income under the main user's ID, 
  // we cannot show individual member stats unless we change the database schema to include a 'member_id' 
  // on expenses/income tables. 
  // For now, we will show a placeholder summary based on the owner's data, 
  // but we will update the UI to reflect the member's identity. ***

  // For a true collaborative feature, we would need to implement:
  // 1. A way for family members to authenticate and log their own data.
  // 2. A way for the owner to view the combined data.
  
  // Since the user requested a collaborative space, I will assume the member card should show 
  // the member's *contribution* if they were logging data. 
  // For now, we will use placeholder data to illustrate the concept.

  // Placeholder data for demonstration
  const placeholderData = {
    totalExpenses: 15000 + Math.floor(Math.random() * 5000),
    topCategory: { name: member.name === 'Jane Doe' ? 'Food' : 'Transport', value: 5000 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
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
        <CardContent className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 mr-2 text-destructive" />
              Total Expenses
            </span>
            <span className="font-semibold text-destructive">
              {formatCurrency(placeholderData.totalExpenses)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-sm text-muted-foreground">
              <Tag className="h-4 w-4 mr-2 text-primary" />
              Top Category
            </span>
            <span className="font-semibold">
              {placeholderData.topCategory.name}
            </span>
          </div>
          <div className="pt-2">
            <a 
              href={`/share/${member.share_id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              View Shared Dashboard →
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FamilyMemberCard;