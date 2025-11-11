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
      className="relative group h-full" // Main container for hover effect
    >
      {/* Glow element */}
      <div
        className={cn(
          "absolute -inset-1 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300",
          color
        )}
      />
      {/* Card content */}
      <div
        className={cn(
          "relative rounded-xl transition-all duration-300 h-full group-hover:scale-[1.02]",
          "bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/50 shadow-lg backdrop-blur-md"
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
      </div>
    </motion.div>
  );
};

export default FeatureCard;