import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { MadeWithDyad } from '../made-with-dyad';

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link
    to={to}
    className="text-sm text-muted-foreground hover:text-primary transition-colors"
  >
    {children}
  </Link>
);

const SocialIcon: React.FC<{ href: string; icon: React.ElementType }> = ({ href, icon: Icon }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, rotate: 5 }}
    className="text-muted-foreground hover:text-primary transition-colors"
  >
    <Icon className="h-5 w-5" />
  </motion.a>
);

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-t from-[#f0f9ff] to-white dark:from-gray-950 dark:to-gray-900/50 backdrop-blur-sm border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          {/* Logo and Tagline */}
          <div className="space-y-2 text-center md:text-left">
            <motion.div
              whileHover={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center md:justify-start"
            >
              <img src="/Gemini_Generated_Image_4yfve64yfve64yfv.png" alt="Expentix Logo" className="h-12" />
            </motion.div>
            <p className="text-sm text-muted-foreground">
              Financial clarity for the modern family.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4">
            <div className="flex flex-col space-y-2">
              <span className="font-semibold text-primary mb-1">Product</span>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
              <FooterLink to="/reports">Reports</FooterLink>
              <FooterLink to="/settings">Settings</FooterLink>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-semibold text-primary mb-1">Company</span>
              <FooterLink to="#">About Us</FooterLink>
              <FooterLink to="#">Contact</FooterLink>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-semibold text-primary mb-1">Legal</span>
              <FooterLink to="#">Privacy Policy</FooterLink>
              <FooterLink to="#">Terms of Service</FooterLink>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-border/50" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Haritha.N. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <SocialIcon href="#" icon={Github} />
            <SocialIcon href="#" icon={Linkedin} />
            <SocialIcon href="#" icon={Twitter} />
          </div>
        </div>
        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default LandingFooter;