import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiGlobe } from 'react-icons/fi';

export default function Contact({ profile }) {
  return (
    <section id="contact" className="py-24 max-w-6xl mx-auto px-6">
      <p className="font-mono text-primary text-sm tracking-widest uppercase mb-3">Get In Touch</p>
      <h2 className="section-title mb-4">Contact Me</h2>
      <p className="text-slate-400 mb-12 max-w-lg">
        Have a project in mind or want to work together? Feel free to reach out!
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { icon: <FiMail size={20} />, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
            { icon: <FiPhone size={20} />, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
            { icon: <FiMapPin size={20} />, label: 'Location', value: profile.location },
          ].filter(i => i.value).map(item => (
            <a key={item.label} href={item.href || '#'}
              className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl card-hover group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-dark transition-all">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-mono uppercase">{item.label}</p>
                <p className="text-slate-200 font-medium">{item.value}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-xl">Find me on</h3>
            <div className="flex gap-4">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-card border border-border rounded-xl text-slate-400 hover:text-primary hover:border-primary/40 transition-all card-hover">
                  <FiGithub size={20} /> <span className="text-sm">GitHub</span>
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-card border border-border rounded-xl text-slate-400 hover:text-primary hover:border-primary/40 transition-all card-hover">
                  <FiLinkedin size={20} /> <span className="text-sm">LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-primary/10 to-cyan-500/5 border border-primary/20 rounded-2xl mt-8">
            <p className="font-display font-bold text-white text-lg mb-2">Open to opportunities</p>
            <p className="text-slate-400 text-sm">
              I&apos;m currently available for freelance work, full-time positions, or exciting collaborations.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary text-sm font-mono">Available for hire</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border mt-20 pt-8 text-center text-slate-500 text-sm">
        <p>Built with <span className="text-primary">MERN Stack</span> · {new Date().getFullYear()}</p>
      </div>
    </section>
  );
}
