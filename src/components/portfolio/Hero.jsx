import { HiDownload, HiArrowDown } from 'react-icons/hi';
import { FiGithub, FiLinkedin, FiGlobe } from 'react-icons/fi';

export default function Hero({ profile, onDownloadCV }) {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden" id="hero">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#64FFDA 1px, transparent 1px), linear-gradient(90deg, #64FFDA 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Glow orb */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-32 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <p className="font-mono text-primary text-sm tracking-widest uppercase">
              Hi, I&apos;m
            </p>
            <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-tight">
              {profile.name || 'Your Name'}
            </h1>
            <h2 className="font-display text-2xl md:text-3xl text-slate-400 font-light">
              {profile.title || 'Full Stack Developer'}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              {profile.bio || 'A passionate developer building modern web experiences.'}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button onClick={onDownloadCV}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-semibold rounded-xl hover:bg-primary/90 transition-all pulse-glow">
                <HiDownload size={18} /> Download CV
              </button>
              <a href="#contact"
                className="flex items-center gap-2 px-6 py-3 border border-primary/40 text-primary font-semibold rounded-xl hover:bg-primary/10 transition-all">
                Contact Me
              </a>
            </div>

            <div className="flex gap-5 pt-2">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer"
                  className="text-slate-400 hover:text-primary transition-colors">
                  <FiGithub size={22} />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer"
                  className="text-slate-400 hover:text-primary transition-colors">
                  <FiLinkedin size={22} />
                </a>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer"
                  className="text-slate-400 hover:text-primary transition-colors">
                  <FiGlobe size={22} />
                </a>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative float">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-cyan-500/10 flex items-center justify-center">
                    <span className="font-display text-8xl text-primary/60 font-bold">
                      {profile.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>
              {/* Decorative ring */}
              <div className="absolute -inset-4 border border-primary/15 rounded-3xl" />
              <div className="absolute -inset-8 border border-primary/8 rounded-3xl" />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 animate-bounce">
          <span className="text-xs font-mono">scroll</span>
          <HiArrowDown size={16} />
        </div>
      </div>
    </section>
  );
}
