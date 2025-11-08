import React from 'react';
import GlassCard from './GlassCard.tsx';
import { Quote, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Finally, I understand where my money goes every month. The reports are incredibly clear.",
    name: "Priya, Chennai",
    delay: 0.2,
  },
  {
    quote: "Our family budget is now transparent and fun! No more awkward money talks.",
    name: "Dinesh, Coimbatore",
    delay: 0.4,
  },
  {
    quote: "Simple, beautiful, and trustworthy.",
    name: "Haritha, Bangalore 😉",
    delay: 0.6,
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16"
      >
        Loved by Smart Families Everywhere <Globe className="inline h-8 w-8 text-green-500" />
      </motion.h2>

      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <GlassCard key={testimonial.name} delay={testimonial.delay} className="flex flex-col justify-between">
            <Quote className="h-6 w-6 text-blue-500 mb-4" />
            <p className="text-lg italic text-gray-800 dark:text-gray-200 flex-grow">
              "{testimonial.quote}"
            </p>
            <p className="mt-4 font-semibold text-sm text-blue-600 dark:text-blue-400">
              — {testimonial.name}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;