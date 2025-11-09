import { useSession } from "@/integrations/supabase/session-context";
import { Loader2 } from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ShowcaseSection from "@/components/landing/ShowcaseSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CtaSection from "@/components/landing/CtaSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";

const Index = () => {
  const { isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background Gradient Container */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-mint-green/30 via-aqua-blue/30 to-lavender-violet/30 dark:from-deep-slate dark:via-gray-900 dark:to-deep-slate">
        {/* Floating Orbs / Blurred Shapes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-sky-blue/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float animation-delay-2000" />
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-lavender-violet/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float animation-delay-4000" />
          <div className="absolute top-[40%] right-[5%] w-48 h-48 bg-mint-green/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float animation-delay-6000" />
        </motion.div>
      </div>
      
      <LandingHeader />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ShowcaseSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;