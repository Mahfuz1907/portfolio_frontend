import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

export default function About({ profile }) {
  return (
    <section id="about" className="py-24 max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="font-mono text-primary text-sm tracking-widest uppercase mb-3">About Me</p>
          <h2 className="section-title mb-6">Who I Am</h2>
          <p className="text-slate-400 leading-relaxed text-lg">
            {profile.about || 'Add your about section from the admin panel.'}
          </p>
        </div>

        <div className="space-y-4">
          {[
            { icon: <FiMail />, label: 'Email', value: profile.email },
            { icon: <FiPhone />, label: 'Phone', value: profile.phone },
            { icon: <FiMapPin />, label: 'Location', value: profile.location },
          ].filter(i => i.value).map(item => (
            <div key={item.label} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl card-hover">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-mono uppercase">{item.label}</p>
                <p className="text-slate-200 font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
