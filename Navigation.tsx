import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navigation() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/publications', label: 'Publications' },
    { to: '/news', label: 'News' },
    { to: '/contact', label: 'Contact' },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`${
            mobile ? 'block py-2' : ''
          } text-foreground hover:text-primary transition-colors`}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          {link.label}
        </Link>
      ))}
      {user && profile?.role === 'admin' && (
        <Link
          to="/admin"
          className={`${
            mobile ? 'block py-2' : ''
          } text-foreground hover:text-primary transition-colors`}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          Admin
        </Link>
      )}
    </>
  );

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-white p-1">
              <img
                src="https://miaoda-edit-image.s3cdn.medo.dev/8u5hf9geercx/IMG-8u8cymqaic5c.jpg"
                alt="Forensic Expo Logo"
                className="w-full h-full object-contain"
                data-editor-config="%7B%22defaultSrc%22%3A%22https%3A%2F%2Fmiaoda-edit-image.s3cdn.medo.dev%2F8u5hf9geercx%2FIMG-8u8cymqaic5c.jpg%22%7D" />
            </div>
            <span className="font-bold text-xl max-sm:text-lg text-foreground">
              Forensic Expo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {profile?.username || profile?.email}
                </span>
                <Button variant="outline" onClick={signOut}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                <NavLinks mobile />
                <div className="pt-4 border-t border-border">
                  {user ? (
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        {profile?.username || profile?.email}
                      </div>
                      <Button variant="outline" onClick={signOut} className="w-full">
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
