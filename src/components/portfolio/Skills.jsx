import { useState } from 'react';

const levelWidth = { Beginner: '25%', Intermediate: '55%', Advanced: '80%', Expert: '95%' };

export default function Skills({ skills }) {
  const categories = [...new Set(skills.map(s => s.category?.name).filter(Boolean))];
  const [active, setActive] = useState('All');
  const tabs = ['All', ...categories];

  const filtered = active === 'All' ? skills : skills.filter(s => s.category?.name === active);

  if (!skills.length) return null;

  return (
    <section id="skills" className="py-24 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-primary text-sm tracking-widest uppercase mb-3">What I Know</p>
        <h2 className="section-title mb-10">My Skills</h2>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActive(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                active === tab
                  ? 'bg-primary text-dark border-primary'
                  : 'border-border text-slate-400 hover:border-primary/40 hover:text-primary'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(skill => (
            <div key={skill._id} className="p-4 bg-card border border-border rounded-xl card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-200">{skill.name}</span>
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                  {skill.level}
                </span>
              </div>
              <div className="skill-bar">
                <div className="skill-bar-fill" style={{ width: levelWidth[skill.level] || '50%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
