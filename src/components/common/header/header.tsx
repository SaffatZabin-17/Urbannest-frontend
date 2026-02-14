import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import logoSvg from '@/assets/logos/urbannest.svg';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Listing', to: '/listing' },
  { label: 'Agents', to: '/agents' },
  { label: 'Property', to: '/search' },
  { label: 'Blog', to: '/blog' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-custom-gray-300/50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-30">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoSvg} alt="UrbanNest" className="size-10" />
          <span className="text-xl font-marko text-custom-orange">
            UrbanNest
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-base font-semibold text-custom-dark hover:text-custom-orange transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right section */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 text-custom-dark hover:text-custom-orange transition-colors cursor-pointer"
          >
            <Search className="size-5" />
            <span className="text-lg font-bold">Search</span>
          </button>

          {loggedIn ? (
            <Button
              className="bg-custom-dark hover:bg-custom-dark/90 text-white font-semibold rounded-lg px-6 cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              Profile
            </Button>
          ) : (
            <Button
              className="bg-custom-dark hover:bg-custom-dark/90 text-white font-semibold rounded-lg px-6 cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-custom-dark cursor-pointer"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-custom-gray-300/50 bg-white px-5 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-md px-3 py-2.5 text-base font-semibold text-custom-dark hover:bg-custom-bg-warm-3 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-2 border-t border-custom-gray-300/50 pt-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 cursor-pointer"
              onClick={() => {
                navigate('/search');
                setMobileOpen(false);
              }}
            >
              <Search className="size-4" />
              Search
            </Button>

            {loggedIn ? (
              <Button
                className="w-full bg-custom-dark hover:bg-custom-dark/90 text-white font-semibold cursor-pointer"
                onClick={() => {
                  navigate('/profile');
                  setMobileOpen(false);
                }}
              >
                Profile
              </Button>
            ) : (
              <Button
                className="w-full bg-custom-dark hover:bg-custom-dark/90 text-white font-semibold cursor-pointer"
                onClick={() => {
                  navigate('/login');
                  setMobileOpen(false);
                }}
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
