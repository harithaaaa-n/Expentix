import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LottieAnimation from '@/components/LottieAnimation';
import floatingCoinData from '/public/lottie/floating-coin.json';

const CtaSection: React.FC = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-muted/50 dark:bg-gray-900 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="p-8 md:p-12 rounded-3xl shadow-2xl bg-card border border-border/50 space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Start tracking your smart spending today 💫
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of families who found clarity and confidence with Expentix.
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="text-xl px-10 py-7 bg-gradient-to-r from-indigo-600 to-sky-600 text-white rounded-xl shadow-lg hover:scale-[1.05] transition-transform duration-300 shadow-indigo-500/50"
            >
              Join Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Animated Rupee Symbols (Lottie Placeholder) */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 w-24 h-24">
          <LottieAnimation animationData={floatingCoinData} speed={0.5} />
        </div>
        <div className="absolute bottom-20 right-20 w-32 h-32">
          <LottieAnimation animationData={floatingCoinData} speed={0.7} />
        </div>
        <div className="absolute top-1/2 right-10 w-16 h-16">
          <LottieAnimation animationData={floatingCoinData} speed={0.4} />
        </div>
      </div>
    </section>
  );
};

export default CtaSection;