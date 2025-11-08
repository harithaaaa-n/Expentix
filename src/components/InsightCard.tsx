import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  icon: React.ReactNode;
  text: string;
  type: 'positive' | 'negative' | 'neutral';
  delay: number;
}

const typeClasses = {
  positive: 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300',
  negative: 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300',
  neutral: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300',
};

const InsightCard: React.FC<InsightCardProps> = ({ icon, text, type, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={cn("p-4 flex items-center space-x-4", typeClasses[type])}>
        <div className="p-2 rounded-full bg-background/50">
          {icon}
        </div>
        <p className="text-sm font-medium">{text}</p>
      </Card>
    </motion.div>
  );
};

export default InsightCard;