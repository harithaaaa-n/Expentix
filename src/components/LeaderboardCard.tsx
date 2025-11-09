import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, DollarSign, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { useMonthlyLeaderboard } from '@/hooks/use-monthly-leaderboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

const LeaderboardItem: React.FC<{ rank: number, name: string, value: string, avatarUrl: string | null, isPositive: boolean }> = ({ rank, name, value, avatarUrl, isPositive }) => {
  const initials = getInitials(name);
  
  const rankClasses = rank === 1 
    ? "bg-yellow-400 text-yellow-900" 
    : (rank === 2 ? "bg-gray-300 text-gray-800" : "bg-amber-700 text-amber-100");

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.1 }}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-sm font-bold", rankClasses)}>
          {rank}
        </div>
        <Avatar className="h-9 w-9">
          <AvatarImage src={avatarUrl || ''} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{name}</span>
      </div>
      <span className={cn("font-semibold text-lg", isPositive ? "text-green-600 dark:text-green-400" : "text-primary")}>
        {value}
      </span>
    </motion.div>
  );
};

const LeaderboardCard: React.FC = () => {
  const { leaderboardData, isLoading } = useMonthlyLeaderboard();

  const topSavers = [...leaderboardData]
    .sort((a, b) => b.netSavings - a.netSavings)
    .slice(0, 3);

  const topTrackers = [...leaderboardData]
    .sort((a, b) => b.expenseCount - a.expenseCount)
    .slice(0, 3);

  if (isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </Card>
    );
  }
  
  if (leaderboardData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Trophy className="mr-2 h-5 w-5 text-yellow-500" /> Monthly Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center p-4">
            Add family members and log transactions to start the competition!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Monthly Leaderboard
        </CardTitle>
        <CardDescription>
          See who is leading in savings and tracking diligence this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="saver" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saver" className="flex items-center"><TrendingUp className="h-4 w-4 mr-2" /> Top Savers</TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center"><Activity className="h-4 w-4 mr-2" /> Top Trackers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saver" className="mt-4 space-y-2">
            {topSavers.map((member, index) => (
              <LeaderboardItem
                key={member.id}
                rank={index + 1}
                name={member.name}
                value={formatCurrency(member.netSavings)}
                avatarUrl={member.avatar_url}
                isPositive={member.netSavings >= 0}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="tracker" className="mt-4 space-y-2">
            {topTrackers.map((member, index) => (
              <LeaderboardItem
                key={member.id}
                rank={index + 1}
                name={member.name}
                value={`${member.expenseCount} Expenses`}
                avatarUrl={member.avatar_url}
                isPositive={true}
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;