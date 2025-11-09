import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Zap } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Visualize Your Spending",
      description: "Interactive charts and reports that tell your financial story instantly. Understand where your money goes with beautiful data visualizations.",
      color: "bg-sky-blue", // Updated color
    },
    {
      icon: Users,
      title: "Manage Family Budgets",
      description: "Track together, grow together. Share expenses and budgets seamlessly with family members for complete financial transparency.",
      color: "bg-mint-green", // Updated color
    },
    {
      icon: Zap,
      title: "Save Smarter, Not Harder",
      description: "Get personalized monthly insights and smart suggestions to help you stay within budget and achieve your savings goals faster.",
      color: "bg-lavender-violet", // Updated color
    },
  ];

  return (
    <section id="features" className="py-24 px-4 md:px-8 relative z-10">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-deep-slate dark:text-primary"
        >
          Built to Make Budgeting Beautiful <span className="text-lime-glow">💸</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-grey-blue dark:text-muted-foreground mb-12 max-w-3xl mx-auto"
        >
          Stop dreading finance tracking. Start enjoying clarity.
        </motion.p>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;