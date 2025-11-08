import React from 'react';
import { motion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Finally, an expense tracker that feels human. The design makes budgeting enjoyable.",
      name: "Priya Sharma",
      title: "Financial Analyst",
      delay: 0.1,
    },
    {
      quote: "HomeExpense+ made our family finances transparent and stress-free. Highly recommended!",
      name: "Dinesh Kumar",
      title: "Small Business Owner",
      delay: 0.3,
    },
    {
      quote: "The UI is so clean, it's addictive! I actually look forward to logging my expenses now. A game-changer.",
      name: "Haritha Menon",
      title: "Software Engineer",
      delay: 0.5,
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Background element for visual interest */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="w-96 h-96 bg-purple-300/50 dark:bg-purple-700/30 rounded-full absolute top-10 left-10 mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-primary"
        >
          Trusted by Families Everywhere
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto"
        >
          See what our users are saying about achieving financial peace of mind.
        </motion.p>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;