import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LottieAnimation from '@/components/LottieAnimation';
import floatingCoinData from '/public/lottie/floating-coin.json';
import { cn } from '@/lib/utils';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
};

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-16 sm:py-24 px-4 md:px-6 lg:px-8">
      <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center md:text-left space-y-6"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-deep-slate dark:text-gray-50 leading-tight"
            variants={itemVariants}
          >
            Not How Much You Spend. <span className="text-sky-blue dark:text-aqua-blue">How Well You Spend.</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-muted-grey-blue dark:text-muted-foreground max-w-xl mx-auto md:mx-0"
            variants={itemVariants}
          >
            A new-age lifestyle tracker that helps you understand your choices, habits, and balance.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4"
            variants={itemVariants}
          >
            <Link to="/signup">
              <Button
                size="lg"
                className={cn(
                  "w-full sm:w-auto text-lg px-8 py-6 rounded-xl shadow-lg transition-transform duration-300",
                  "bg-gradient-to-r from-sky-blue to-mint-green text-white hover:scale-[1.02] shadow-sky-blue/50"
                )}
              >
                🌟 Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button 
                size="lg" 
                variant="outline" 
                className={cn(
                  "w-full sm:w-auto text-lg px-8 py-6 bg-white/20 backdrop-blur-md border-white/30 text-deep-slate dark:text-white",
                  "hover:bg-white/30 transition-colors"
                )}
              >
                Explore Features
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Right 3D/Lottie Visual - Glassmorphic container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className={cn(
            "hidden md:flex justify-center items-center h-96 p-8 rounded-3xl shadow-2xl backdrop-blur-md border border-white/30",
            "bg-white/20 dark:bg-gray-900/20"
          )}
        >
          <LottieAnimation
            animationData={floatingCoinData}
            className="w-full h-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;