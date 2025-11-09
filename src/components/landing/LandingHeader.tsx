import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wallet, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useSession } from '@/integrations/supabase/session-context';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Showcase', href: '#showcase' },
  { name: 'Testimonials', href: '#testimonials' },
];

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: () => void }> = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-md font-medium text-muted-foreground hover:text-primary transition-colors"
  >
    {children}
  </a>
);

const LandingHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
            <Wallet className="h-7 w-7 text-blue-500" />
            <span>HomeExpense+</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <NavLink key={link.name} href={link.href}>{link.name}</NavLink>
              ))}
            </nav>
          )}

          {/* Auth Buttons & Mobile Menu Trigger */}
          <div className="flex items-center space-x-3">
            {!isMobile ? (
              <>
                {user ? (
                  <Link to="/dashboard">
                    <Button>Go to Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost">Login</Button>
                    </Link>
                    <Link to="/signup">
                      <Button>Sign Up</Button>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs bg-background p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8">
                       <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                          <Wallet className="h-6 w-6 text-blue-500" />
                          <span>HomeExpense+</span>
                        </Link>
                      <SheetClose asChild>
                         <Button variant="ghost" size="icon">
                            <X className="h-6 w-6" />
                          </Button>
                      </SheetClose>
                    </div>
                    <nav className="flex flex-col space-y-6">
                      {navLinks.map(link => (
                         <SheetClose asChild key={link.name}>
                            <NavLink href={link.href}>{link.name}</NavLink>
                         </SheetClose>
                      ))}
                    </nav>
                    <div className="mt-auto pt-6 border-t border-border space-y-3">
                       {user ? (
                         <SheetClose asChild>
                           <Link to="/dashboard" className="w-full">
                             <Button className="w-full">Go to Dashboard</Button>
                           </Link>
                         </SheetClose>
                       ) : (
                         <>
                           <SheetClose asChild>
                             <Link to="/login" className="w-full">
                               <Button variant="outline" className="w-full">Login</Button>
                             </Link>
                           </SheetClose>
                           <SheetClose asChild>
                             <Link to="/signup" className="w-full">
                               <Button className="w-full">Sign Up</Button>
                             </Link>
                           </SheetClose>
                         </>
                       )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default LandingHeader;