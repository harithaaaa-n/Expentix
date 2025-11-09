import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColoredProgress } from '../ColoredProgress';

const DashboardMockup: React.FC = () => {
  return (
    <div className="w-full h-full p-6 bg-white/30 dark:bg-gray-900/30 rounded-xl shadow-2xl border border-white/50 backdrop-blur-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-deep-slate dark:text-white">Monthly Overview</h3>
        <Wallet className="h-6 w-6 text-sky-blue" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card className="bg-white/50 dark:bg-gray-800/50 border-green-500/50 backdrop-blur-sm">
          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold text-deep-slate dark:text-white">₹85,000</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-gray-800/50 border-red-500/50 backdrop-blur-sm">
          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-destructive">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold text-deep-slate dark:text-white">₹42,500</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Interactive Chart Placeholder */}
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4">
        <h4 className="text-sm font-medium mb-2 text-deep-slate dark:text-white">Expense Trend (Last 6 Months)</h4>
        <div className="h-24 flex items-end space-x-2">
          {[10, 30, 50, 70, 60, 90].map((height, index) => (
            <div 
              key={index} 
              className="flex-1 bg-sky-blue/70 rounded-t-sm transition-all duration-500" 
              style={{ height: `${height}%` }} 
            />
          ))}
        </div>
      </Card>
      
      {/* Budget Progress Placeholder */}
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-deep-slate dark:text-white">Food Budget (85% Used)</h4>
        <ColoredProgress value={85} className="h-2" indicatorClassName="bg-red-500" />
      </div>
    </div>
  );
};

const FamilyMockup: React.FC = () => {
  return (
    <div className="w-full h-full p-6 bg-white/30 dark:bg-gray-900/30 rounded-xl shadow-2xl border border-white/50 backdrop-blur-lg flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-deep-slate dark:text-white">Family Tracking</h3>
        <Users className="h-6 w-6 text-mint-green" />
      </div>
      
      {/* Happy Family Image Placeholder */}
      <div className="flex-grow flex flex-col items-center justify-center bg-lavender-violet/20 rounded-lg border border-lavender-violet/50 p-4 text-center text-muted-grey-blue dark:text-muted-foreground">
        <div className="flex items-end justify-center space-x-1 text-lavender-violet">
            <User className="h-12 w-12" />
            <User className="h-16 w-16" />
            <User className="h-10 w-10" />
        </div>
        <p className="font-semibold mt-3 text-deep-slate dark:text-white">The Chen Family</p>
        <p className="text-sm">Shared goals, shared success.</p>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm font-medium text-deep-slate dark:text-white">
          <span>Michael (Owner)</span>
          <span className="text-green-600">₹42,500 Spent</span>
        </div>
        <div className="flex justify-between text-sm font-medium text-deep-slate dark:text-white">
          <span>Sarah (Spouse)</span>
          <span className="text-red-600">₹15,000 Spent</span>
        </div>
      </div>
    </div>
  );
};


const ShowcaseSection: React.FC = () => {
  const targetRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // Animation for the main dashboard mockup
  const rotateX = useTransform(scrollYProgress, [0, 1], [45, -45]);
  const translateY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.7, 1], [0, 1, 1, 0]);
  
  // Animation for the family mockup (slightly offset)
  const rotateXFamily = useTransform(scrollYProgress, [0, 1], [-45, 45]);
  const translateYFamily = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const opacityFamily = useTransform(scrollYProgress, [0.2, 0.5, 0.7, 1], [0, 1, 1, 0]);


  return (
    <section ref={targetRef} id="reports" className="py-32 px-4 md:px-8 relative z-10">
      <div className="max-w-6xl mx-auto text-center space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-deep-slate dark:text-primary">
            Your data. Your design. Your peace of mind.
          </h2>
          <p className="text-xl text-muted-grey-blue dark:text-muted-foreground max-w-3xl mx-auto">
            Experience financial clarity through a beautifully designed, interactive interface.
          </p>
        </motion.div>

        {/* 3D Simulated Mockups Grid */}
        <div className="grid md:grid-cols-2 gap-8 h-[600px] relative">
          
          {/* Dashboard Mockup (Expenses Image) */}
          <div className="perspective-1000 flex justify-center items-center absolute inset-0 md:relative md:inset-auto">
            <motion.div
              style={{ rotateX, translateY, opacity }}
              className={cn(
                "w-full max-w-md h-[450px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)]",
                "transform-style-preserve-3d transition-shadow duration-500"
              )}
            >
              <DashboardMockup />
            </motion.div>
          </div>
          
          {/* Family Mockup (Happy Family Image) */}
          <div className="perspective-1000 flex justify-center items-center absolute inset-0 md:relative md:inset-auto mt-40 md:mt-0">
            <motion.div
              style={{ rotateX: rotateXFamily, translateY: translateYFamily, opacity: opacityFamily }}
              className={cn(
                "w-full max-w-md h-[450px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)]",
                "transform-style-preserve-3d transition-shadow duration-500"
              )}
            >
              <FamilyMockup />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;