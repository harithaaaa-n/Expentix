import React from 'react';
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, BarChart3, Lightbulb, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const MissionCard: React.FC<{ icon: React.ElementType, title: string, delay: number, color: string }> = ({ icon: Icon, title, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.6, delay }}
    className={cn(
      "rounded-xl transition-all duration-300 h-full",
      "bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/50 shadow-lg backdrop-blur-md"
    )}
  >
    <Card className="bg-transparent border-none shadow-none p-6 h-full">
      <CardHeader className="p-0 flex-row items-center space-x-4">
        <div className={cn("p-3 rounded-full w-fit", color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-deep-slate dark:text-white">{title}</CardTitle>
      </CardHeader>
    </Card>
  </motion.div>
);

const About = () => {
  const missionPoints = [
    { icon: Wallet, title: "Track your daily spends beautifully 🌿", color: "bg-mint-green" },
    { icon: BarChart3, title: "Discover patterns behind your habits 🔍", color: "bg-sky-blue" },
    { icon: Lightbulb, title: "Make smarter, mindful lifestyle choices 💫", color: "bg-lavender-violet" },
    { icon: Heart, title: "Grow with your family, not just your wallet ❤️", color: "bg-lime-glow" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background Gradient Container */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-mint-green/30 via-aqua-blue/30 to-lavender-violet/30 dark:from-deep-slate dark:via-gray-900 dark:to-deep-slate" />
      
      <LandingHeader />
      <main className="relative z-10 flex-grow flex items-center">
        <section className="py-24 px-4 md:px-8 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-deep-slate dark:text-gray-50 leading-tight"
            >
              Our Mission: <span className="text-sky-blue dark:text-aqua-blue">Simplify the Way You Understand Spending.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-xl md:text-2xl text-muted-grey-blue dark:text-muted-foreground max-w-3xl mx-auto"
            >
              We’re on a mission to redefine personal finance — making it calmer, simpler, and more meaningful.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-left"
            >
              <h2 className="text-2xl font-bold text-deep-slate dark:text-primary mb-6">Expentix empowers you to:</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {missionPoints.map((point, index) => (
                  <MissionCard key={index} {...point} delay={0.6 + index * 0.2} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default About;