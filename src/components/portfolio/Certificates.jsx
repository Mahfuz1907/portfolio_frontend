import { useState } from 'react';
import { FiExternalLink, FiAward } from 'react-icons/fi';

export default function Certificates({ certificates }) {
  const categories = [...new Set(certificates.map(c => c.category?.name).filter(Boolean))];
  const [active, setActive] = useState('All');
  const [modal, setModal] = useState(null);
  const tabs = ['All', ...categories];
  const filtered = active === 'All' ? certificates : certificates.filter(c => c.category?.name === active);

  if (!certificates.length) return null;

  return (
    <section id="certificates" className="py-24 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-primary text-sm tracking-widest uppercase mb-3">My Credentials</p>
        <h2 className="section-title mb-10">Certificates</h2>

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(cert => (
            <div key={cert._id}
              className="bg-card border border-border rounded-xl p-5 card-hover cursor-pointer"
              onClick={() => cert.image && setModal(cert)}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  {cert.image
                    ? <img src={cert.image} alt="" className="w-12 h-12 object-cover rounded-xl" />
                    : <FiAward size={22} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm leading-tight mb-1">{cert.title}</h3>
                  <p className="text-primary text-xs font-mono">{cert.issuer}</p>
                  {cert.issueDate && <p className="text-slate-500 text-xs mt-1">{cert.issueDate}</p>}
                  <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded mt-2 inline-block">
                    {cert.category?.name}
                  </span>
                </div>
              </div>
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary mt-3 transition-colors w-fit">
                  <FiExternalLink size={12} /> View Credential
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4"
          onClick={() => setModal(null)}>
          <div className="max-w-2xl w-full bg-card border border-border rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <img src={modal.image} alt={modal.title} className="w-full object-contain max-h-[70vh]" />
            <div className="p-4">
              <h3 className="font-semibold text-white">{modal.title}</h3>
              <p className="text-primary text-sm">{modal.issuer}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
