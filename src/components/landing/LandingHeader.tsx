import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useSession } from '@/integrations/supabase/session-context';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

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
          <a href={link.href} className="hover:text-indigo-600 text-lg">{link.name}</a>
        </SheetClose>
      ) : (
        <a key={link.name} href={link.href} className="hover:text-indigo-600">{link.name}</a>
      )
    ))}
  </>
);

const ActionButton: React.FC<{ user: any, isMobile?: boolean }> = ({ user, isMobile }) => {
  const buttonContent = user ? 'Go to Dashboard' : 'Get Started';
  const buttonLink = user ? '/dashboard' : '/signup';

  const button = (
    <Link to={buttonLink}>
      <Button className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white px-5 py-2 rounded-xl hover:scale-105 transition">
        {buttonContent}
      </Button>
    </Link>
  );

  return isMobile ? <SheetClose asChild>{button}</SheetClose> : button;
};

const LandingHeader: React.FC = () => {
  const { user } = useSession();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-md shadow-[0_2px_15px_rgba(0,0,0,0.05)] flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img
            src="/Gemini_Generated_Image_4yfve64yfve64yfv.png"
            alt="Expentix Logo"
            className="h-12 md:h-14 hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6 text-muted-foreground font-medium">
        <NavItems />
        <ActionButton user={user} />
      </nav>

      {/* Mobile Navigation */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col items-center gap-8 text-muted-foreground font-medium mt-16">
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