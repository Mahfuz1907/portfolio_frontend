import { useState, useEffect } from 'react';
import { HiDownload } from 'react-icons/hi';

export default function Navbar({ profile, onDownloadCV }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['About', 'Skills', 'Projects', 'Certificates', 'Contact'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark/95 backdrop-blur border-b border-border shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="font-display font-bold text-xl text-white">
          {profile.name?.split(' ')[0] || 'Portfolio'}
          <span className="text-primary">.</span>
        </span>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link text-sm font-medium">
              {l}
            </a>
          ))}
          <button onClick={onDownloadCV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-dark bg-primary rounded-lg hover:bg-primary/90 transition-all pulse-glow">
            <HiDownload size={16} /> Download CV
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1">
            <span className={`block w-6 h-0.5 bg-primary transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-6 h-0.5 bg-primary transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-primary transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              className="text-slate-300 hover:text-primary transition-colors text-sm">
              {l}
            </a>
          ))}
          <button onClick={() => { onDownloadCV(); setMenuOpen(false); }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-dark bg-primary rounded-lg w-fit">
            <HiDownload size={16} /> Download CV
          </button>
        </div>
      )}
    </nav>
  );
}
