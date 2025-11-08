import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardMockup: React.FC = () => {
  return (
    <div className="w-full h-full p-6 bg-card rounded-xl shadow-2xl border border-border/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Monthly Overview</h3>
        <Wallet className="h-6 w-6 text-primary" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold">₹85,000</div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-destructive">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold">₹42,500</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        Interactive Chart Placeholder
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

  const rotateX = useTransform(scrollYProgress, [0, 1], [45, -45]);
  const translateY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={targetRef} className="py-32 px-4 md:px-8 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto text-center space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Your data. Your design. Your peace of mind.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience financial clarity through a beautifully designed, interactive interface.
          </p>
        </motion.div>

        {/* 3D Simulated Mockup */}
        <div className="perspective-1000 h-[600px] flex justify-center items-center">
          <motion.div
            style={{ rotateX, translateY, opacity }}
            className={cn(
              "w-full max-w-3xl h-[450px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)]",
              "transform-style-preserve-3d transition-shadow duration-500"
            )}
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;