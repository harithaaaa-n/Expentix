import { useSession } from "@/integrations/supabase/session-context";
import { Loader2 } from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ShowcaseSection from "@/components/landing/ShowcaseSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CtaSection from "@/components/landing/CtaSection";
import LandingFooter from "@/components/landing/LandingFooter";

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
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />
      <main>
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