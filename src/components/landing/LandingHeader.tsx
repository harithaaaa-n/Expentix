import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, Wallet } from 'lucide-react';
import { useSession } from '@/integrations/supabase/session-context';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'Reports', href: '#reports' },
  { name: 'Family', href: '#family' },
];

const NavItems: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
  <>
    {navLinks.map(link => (
      isMobile ? (
        <SheetClose asChild key={link.name}>
          <a href={link.href} className="hover:text-sky-blue text-lg text-deep-slate dark:text-white">{link.name}</a>
        </SheetClose>
      ) : (
        <a key={link.name} href={link.href} className="hover:text-sky-blue text-muted-grey-blue dark:text-muted-foreground">{link.name}</a>
      )
    ))}
  </>
);

const ActionButton: React.FC<{ user: any, isMobile?: boolean }> = ({ user, isMobile }) => {
  const buttonContent = user ? 'Go to Dashboard' : 'Get Started';
  const buttonLink = user ? '/dashboard' : '/signup';

  const button = (
    <Link to={buttonLink}>
      <Button 
        className={cn(
          "bg-gradient-to-r from-sky-blue to-mint-green text-white px-5 py-2 rounded-xl hover:scale-105 transition shadow-md shadow-sky-blue/30",
          isMobile && "w-full"
        )}
      >
        {buttonContent}
      </Button>
    </Link>
  );

  return isMobile ? <SheetClose asChild>{button}</SheetClose> : button;
};

const TextLogo: React.FC = () => (
  <div className="flex items-center gap-2">
    <Wallet className="h-8 w-8 text-sky-blue" />
    <div>
      <h1 className="text-xl font-bold text-deep-slate dark:text-primary">Expentix</h1>
      <p className="text-xs text-muted-grey-blue dark:text-muted-foreground">Track Smarter. Spend Wiser.</p>
    </div>
  </div>
);

const LandingHeader: React.FC = () => {
  const { user } = useSession();
  const isMobile = useIsMobile();

  return (
    <header className={cn(
      "sticky top-0 z-50 flex items-center justify-between px-8 py-4 transition-colors duration-300",
      "bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg shadow-[0_2px_15px_rgba(0,0,0,0.05)] border-b border-white/30 dark:border-gray-700/50"
    )}>
      <div className="flex items-center gap-2">
        <Link to="/">
          <TextLogo />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6 font-medium">
        <NavItems />
        <ActionButton user={user} />
      </nav>

      {/* Mobile Navigation */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-deep-slate dark:text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-l border-white/30 dark:border-gray-700/50">
            <nav className="flex flex-col items-center gap-8 font-medium mt-16">
              <NavItems isMobile />
              <ActionButton user={user} isMobile />
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </header>
  );
};

export default LandingHeader;