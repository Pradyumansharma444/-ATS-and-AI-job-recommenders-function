import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for route change to finish rendering before scrolling
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMenuOpen(false);
  };

  const navLinks = [
    { label: 'What We Do', href: '/#what-we-do' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'ATS Education', href: '/awareness' },
    { label: 'Find Jobs', href: '/jobs' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b-2 border-black flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-90 select-none">
        <div className="w-9 h-9 rounded-lg border-2 border-black bg-[#86EFAC] flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
          <span className="font-extrabold text-lg text-black">✓</span>
        </div>
        <span className="font-display text-lg font-black text-black tracking-tight">ResumeCheck</span>
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className="text-small font-bold text-black hover:text-[#C084FC] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* CTA Button */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/upload" className="btn-neo-primary px-4 py-2 text-xs uppercase tracking-wider font-extrabold shadow-[2px_2px_0px_0px_#000]">
          Analyze Resume ⚡
        </Link>
      </div>

      {/* Mobile menu trigger */}
      <button
        className="md:hidden p-1.5 border-2 border-black rounded-lg bg-[#FAF9F6] shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? <X size={20} className="text-black" /> : <Menu size={20} className="text-black" />}
      </button>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b-2 border-black shadow-[4px_4px_0px_0px_#000] md:hidden">
          <div className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-left px-4 py-2.5 border-2 border-transparent rounded-lg text-base font-bold text-black hover:bg-[#F3E8FF] hover:border-black transition-all"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-t border-gray-200 my-1" />
            <Link
              to="/upload"
              onClick={() => setMenuOpen(false)}
              className="btn-neo-primary w-full text-center py-3 text-sm font-extrabold shadow-[2px_2px_0px_0px_#000]"
            >
              Analyze Resume ⚡
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
