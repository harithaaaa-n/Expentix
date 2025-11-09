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
        "rounded-xl transition-all duration-300 h-full",
        "bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/50 shadow-lg backdrop-blur-md" // Glassmorphic effect
      )}
    >
      <Card className="bg-transparent border-none shadow-none p-6 h-full">
        <CardHeader className="p-0 mb-4">
          <div className={cn("p-3 rounded-full w-fit", color)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="mt-3 text-xl font-bold text-deep-slate dark:text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-muted-grey-blue dark:text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;