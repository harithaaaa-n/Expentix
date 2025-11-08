import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LandingContent = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-background p-4 md:p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl w-full text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary mb-4"
          variants={itemVariants}
        >
          HomeExpense<span className="text-blue-600">+</span>
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-3xl text-muted-foreground mb-8 font-medium"
          variants={itemVariants}
        >
          Track your daily spending. Save smartly. Live freely.
        </motion.p>

        {/* Hero Section Illustration Placeholder */}
        <motion.div 
          className="mb-12 flex justify-center"
          variants={itemVariants}
        >
          <div className="w-full max-w-md h-64 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center border border-border">
            <Wallet className="w-20 h-20 text-blue-500" />
            <p className="ml-4 text-lg text-muted-foreground">Family Finance Illustration</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex justify-center space-x-4"
          variants={itemVariants}
        >
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Login
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingContent;