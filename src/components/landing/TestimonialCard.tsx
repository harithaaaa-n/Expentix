import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  avatarUrl?: string;
  delay: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, title, avatarUrl, delay }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: delay }}
      className={cn(
        "rounded-xl backdrop-blur-md transition-all duration-300 h-full",
        "bg-white/50 dark:bg-gray-900/50 border border-white/30 dark:border-gray-700/50 shadow-xl hover:shadow-2xl"
      )}
    >
      <Card className="bg-transparent border-none shadow-none p-6 h-full flex flex-col justify-between">
        <Quote className="h-6 w-6 text-primary/70 mb-4" />
        <CardContent className="p-0 flex-grow">
          <p className="text-lg italic text-foreground mb-6">
            "{quote}"
          </p>
        </CardContent>
        <div className="flex items-center pt-4 border-t border-border/50">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-primary">{name}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;