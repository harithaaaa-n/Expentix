import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import LottieAnimation from '@/components/LottieAnimation';
import floatingCoinData from '/public/lottie/floating-coin.json';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 px-4 md:px-8">
      {/* Background Gradient and Floating Shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e0f7fa] via-[#e3f2fd] to-[#ede7f6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/90">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300/50 dark:bg-blue-700/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-green-300/50 dark:bg-green-700/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"
        />
      </div>

      <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center md:text-left space-y-6"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 leading-tight"
            variants={itemVariants}
          >
            Track Smarter. Spend Wiser. Live Happier.
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto md:mx-0"
            variants={itemVariants}
          >
            A new-age family expense tracker that blends insights, design, and simplicity.
          </motion.p>

          <motion.div
            className="flex justify-center md:justify-start space-x-4 pt-4"
            variants={itemVariants}
          >
            <Link to="/signup">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-indigo-500 to-sky-500 text-white rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300"
              >
                🌟 Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                👁️ See It In Action
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Right 3D/Lottie Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="hidden md:flex justify-center items-center h-96 p-8 bg-white/50 dark:bg-gray-900/50 rounded-3xl shadow-2xl backdrop-blur-md border border-white/30 dark:border-gray-700/50"
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