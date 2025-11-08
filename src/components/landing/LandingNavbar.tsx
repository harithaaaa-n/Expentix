import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const LandingNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const NavItem: React.FC<{ href: string; name: string }> = ({ href, name }) => (
    <a 
      href={href} 
      onClick={scrollToSection(href.substring(1))}
      className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
    >
      {name}
    </a>
  );

  const AnimatedButton: React.FC<{ children: React.ReactNode; to: string; variant: 'default' | 'outline' }> = ({ children, to, variant }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        variant === 'default' && "relative overflow-hidden rounded-lg",
        variant === 'default' && "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400 before:to-purple-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
      )}
    >
      <Link to={to}>
        <Button 
          variant={variant} 
          className={cn(
            "relative z-10",
            variant === 'default' && "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
            variant === 'outline' && "bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 hover:bg-white/80 dark:hover:bg-gray-700/80"
          )}
        >
          {children}
        </Button>
      </Link>
    </motion.div>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 p-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 rounded-xl bg-white/30 backdrop-blur-xl shadow-lg border border-white/20 dark:bg-gray-900/30 dark:border-gray-700/30">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white">
          <DollarSign className="h-6 w-6 text-blue-600" />
          <span>HomeExpense<span className="text-blue-600">+</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <NavItem key={link.name} {...link} />
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <AnimatedButton to="/login" variant="outline">
            Login
          </AnimatedButton>
          <AnimatedButton to="/signup" variant="default">
            Sign Up
          </AnimatedButton>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-background/90 backdrop-blur-sm">
            <div className="flex flex-col space-y-4 pt-8">
              {navLinks.map(link => (
                <NavItem key={link.name} {...link} />
              ))}
              <div className="pt-4 border-t border-border space-y-3">
                <Link to="/login">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;