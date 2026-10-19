import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Feather } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Events', href: '/#events' },
  { label: 'About', href: '/#about' },
  { label: 'Register', href: '/register' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const handleNavClick = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(href.slice(1));
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        const el = document.querySelector(href.slice(1));
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      setOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#101010]/95 backdrop-blur-sm border-b border-[rgba(198,154,105,0.15)] shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="ScriptInk — Writofest 2K26 Home"
        >
          <Feather
            size={20}
            className="text-[#C69A69] group-hover:rotate-12 transition-transform duration-300"
          />
          <span
            className="text-2xl text-[#F6EBDD] leading-none"
            style={{ fontFamily: "'Dancing Script', cursive", letterSpacing: '0.02em' }}
          >
            ScriptInk
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-medium tracking-wide transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[#C69A69] after:transition-all after:duration-300 ${
                link.href === '/register'
                  ? 'text-[#C69A69] after:w-full'
                  : 'text-[#F6EBDD]/70 hover:text-[#F6EBDD] after:w-0 hover:after:w-full'
              }`}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/admin/login"
            className="ml-2 px-4 py-1.5 text-xs font-medium tracking-widest uppercase border border-[rgba(198,154,105,0.4)] text-[#C69A69] hover:bg-[#C69A69] hover:text-[#101010] transition-all duration-300 rounded-sm"
          >
            Admin Access
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#F6EBDD] p-2 rounded focus-visible:outline-[#C69A69]"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-[#1E1A17] border-t border-[rgba(198,154,105,0.15)] transition-all duration-300 overflow-hidden ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[#F6EBDD]/80 hover:text-[#C69A69] text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/admin/login"
            className="text-center px-4 py-2 text-xs font-medium tracking-widest uppercase border border-[rgba(198,154,105,0.4)] text-[#C69A69] hover:bg-[#C69A69] hover:text-[#101010] transition-all duration-300 rounded-sm"
          >
            Admin Access
          </Link>
        </div>
      </div>
    </header>
  );
}
