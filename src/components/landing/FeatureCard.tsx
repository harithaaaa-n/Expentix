import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.03, boxShadow: `0 10px 30px ${color}40` }}
      className={cn(
        "rounded-xl backdrop-blur-sm transition-all duration-300",
        "bg-white/50 dark:bg-gray-900/50 border border-white/30 dark:border-gray-700/50 shadow-lg"
      )}
    >
      <Card className="bg-transparent border-none shadow-none p-6 h-full">
        <CardHeader className="p-0 mb-4">
          <div className={cn("p-3 rounded-full w-fit", color)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="mt-3 text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;