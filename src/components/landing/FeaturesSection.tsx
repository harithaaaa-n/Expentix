import React from 'react';
import GlassCard from './GlassCard.tsx';
import { DollarSign, BarChart3, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: DollarSign,
    title: "Track Every Rupee 💸",
    description: "Effortlessly log daily expenses with smart categorization and receipt uploads. Because every rupee matters.",
    delay: 0.2,
  },
  {
    icon: BarChart3,
    title: "Visual Reports & Insights 📊",
    description: "Understand your spending habits with beautiful monthly charts, budget usage, and comparison reports.",
    delay: 0.4,
  },
  {
    icon: Users,
    title: "Manage Family Budgets 👨‍👩‍👧",
    description: "Set shared budgets and track contributions across family members for complete financial transparency.",
    delay: 0.6,
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16"
      >
        Why You’ll Love HomeExpense+ <Heart className="inline h-8 w-8 text-red-500" />
      </motion.h2>

      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <GlassCard key={feature.title} delay={feature.delay}>
            <feature.icon className="h-10 w-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;