import { useState } from 'react';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

export default function Projects({ projects }) {
  const categories = [...new Set(projects.map(p => p.category?.name).filter(Boolean))];
  const [active, setActive] = useState('All');
  const tabs = ['All', ...categories];
  const filtered = active === 'All' ? projects : projects.filter(p => p.category?.name === active);

  if (!projects.length) return null;

  return (
    <section id="projects" className="py-24 max-w-6xl mx-auto px-6">
      <p className="font-mono text-primary text-sm tracking-widest uppercase mb-3">What I've Built</p>
      <h2 className="section-title mb-10">Projects</h2>

      <div className="flex flex-wrap gap-3 mb-10">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActive(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              active === tab ? 'bg-primary text-dark border-primary' : 'border-border text-slate-400 hover:border-primary/40 hover:text-primary'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(project => (
          <div key={project._id} className="bg-card border border-border rounded-2xl overflow-hidden card-hover flex flex-col">
            {/* Image */}
            <div className="h-44 bg-gradient-to-br from-primary/10 to-cyan-500/5 relative overflow-hidden">
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-4xl text-primary/30 font-bold">
                    {project.title?.charAt(0)}
                  </span>
                </div>
              )}
              {project.featured && (
                <span className="absolute top-3 right-3 bg-primary text-dark text-xs font-bold px-2 py-1 rounded">
                  Featured
                </span>
              )}
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-bold text-white text-lg">{project.title}</h3>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded ml-2 shrink-0">
                  {project.category?.name}
                </span>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map(t => (
                    <span key={t} className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-auto">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors">
                    <FiGithub size={15} /> Code
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors">
                    <FiExternalLink size={15} /> Live
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
