import React from 'react';
import LandingNavbar from './LandingNavbar.tsx';
import HeroSection from './HeroSection.tsx';
import FeaturesSection from './FeaturesSection.tsx';
import TestimonialsSection from './TestimonialsSection.tsx';
import CtaFooter from './CtaFooter.tsx';
import { MadeWithDyad } from '../made-with-dyad';

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 opacity-50 dark:opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-mint-light via-lavender-light to-sky-light dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        
        {/* Subtle Floating Rupee Mascot */}
        <div className="absolute top-1/4 left-1/4 text-6xl opacity-10 animate-pulse-slow pointer-events-none">
          <span role="img" aria-label="rupee">₹</span>
        </div>
        <div className="absolute bottom-1/3 right-1/4 text-5xl opacity-10 animate-pulse-slow delay-1000 pointer-events-none">
          <span role="img" aria-label="coin">🪙</span>
        </div>
      </div>

      <LandingNavbar />
      
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaFooter />
      </main>
      
      <MadeWithDyad />
    </div>
  );
};

export default LandingPage;