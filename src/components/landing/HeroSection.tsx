import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CreditCard, DollarSign, BarChart3 } from 'lucide-react';
import GlassCard from './GlassCard.tsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FloatingIcon: React.FC<{ icon: React.ElementType; size: number; delay: number; position: string; color: string }> = ({ icon: Icon, size, delay, position, color }) => (
  <motion.div
    className={`absolute ${position}`}
    animate={{
      y: [0, 10, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    }}
  >
    <Icon className={`w-${size} h-${size} ${color} opacity-70`} />
  </motion.div>
);

const HeroSection: React.FC = () => {
  const handleDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const features = document.getElementById('features');
    if (features) {
      features.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text Block */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center md:text-left"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 dark:text-white mb-6 leading-tight"
            variants={itemVariants}
          >
            Track Smarter. Spend Wiser. Live Happier.
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto md:mx-0"
            variants={itemVariants}
          >
            Your all-in-one personal and family expense tracker that makes money management easy, fun, and insightful.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex justify-center md:justify-start space-x-4"
            variants={itemVariants}
          >
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50 transition-all">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={handleDemoClick}>
              View Dashboard Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Side: Animated Illustration Placeholder */}
        <motion.div 
          className="relative w-full h-80 md:h-96 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Main Card/Illustration */}
          <GlassCard className="w-full h-full flex flex-col items-center justify-center p-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BarChart3 className="w-24 h-24 text-blue-500 mb-4" />
            </motion.div>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Insightful Financial Overview</p>
            <p className="text-sm text-muted-foreground mt-1">Animated charts coming soon!</p>
          </GlassCard>

          {/* Floating Icons */}
          <FloatingIcon icon={CreditCard} size={8} delay={0.5} position="top-10 left-5" color="text-pink-500" />
          <FloatingIcon icon={DollarSign} size={10} delay={1.5} position="bottom-10 right-5" color="text-green-500" />
          <FloatingIcon icon={BarChart3} size={6} delay={2.5} position="top-20 right-10" color="text-yellow-500" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;