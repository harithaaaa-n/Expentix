import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: delay }}
      whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
      className={cn(
        "p-6 rounded-2xl border border-white/20 shadow-lg backdrop-blur-md bg-white/10 transition-all duration-300",
        "dark:bg-gray-900/10 dark:border-gray-700/30",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;