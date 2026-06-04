import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiAward } from 'react-icons/fi';

const empty = { title: '', issuer: '', issueDate: '', credentialUrl: '', category: '' };

export default function ManageCertificates() {
  const [certs, setCerts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => Promise.all([api.get('/certificates'), api.get('/categories?type=certificate')])
    .then(([c, cats]) => { setCerts(c.data); setCategories(cats.data); });

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setImage(null); setPreview(''); setModal(true); };
  const openEdit = (c) => {
    setEditing(c._id);
    setForm({ ...c, category: c.category?._id || '' });
    setPreview(c.image || '');
    setImage(null);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      if (editing) { await api.put(`/certificates/${editing}`, fd); toast.success('Updated!'); }
      else { await api.post('/certificates', fd); toast.success('Certificate added!'); }
      setModal(false); load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this certificate?')) return;
    await api.delete(`/certificates/${id}`);
    toast.success('Deleted'); load();
  };

  // Group by category
  const grouped = certs.reduce((acc, c) => {
    const key = c.category?.name || 'Uncategorized';
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-white">Manage Certificates</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-dark font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm pulse-glow">
          <FiPlus size={16} /> Add Certificate
        </button>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-8">
          <h3 className="text-primary font-mono text-sm uppercase tracking-widest mb-3">{cat}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {items.map(cert => (
              <div key={cert._id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 card-hover">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-border bg-dark shrink-0">
                  {cert.image
                    ? <img src={cert.image} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-primary"><FiAward size={22} /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{cert.title}</p>
                  <p className="text-primary text-xs">{cert.issuer}</p>
                  {cert.issueDate && <p className="text-slate-500 text-xs">{cert.issueDate}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(cert)} className="text-slate-400 hover:text-primary transition-colors p-1"><FiEdit2 size={15} /></button>
                  <button onClick={() => handleDelete(cert._id)} className="text-slate-400 hover:text-red-400 transition-colors p-1"><FiTrash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {certs.length === 0 && <div className="text-center py-16 text-slate-500">No certificates yet.</div>}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-white">{editing ? 'Edit Certificate' : 'Add Certificate'}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Certificate Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                  className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Issuer</label>
                  <input value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })}
                    placeholder="Coursera, Udemy..."
                    className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Issue Date</label>
                  <input value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })}
                    placeholder="Jan 2024"
                    className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Credential URL</label>
                <input value={form.credentialUrl} onChange={e => setForm({ ...form, credentialUrl: e.target.value })}
                  className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors" />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required
                  className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Certificate Image</label>
                {preview && <img src={preview} alt="" className="w-full h-32 object-contain rounded-lg mb-2 bg-dark" />}
                <label className="cursor-pointer px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/20 transition-all inline-block">
                  {preview ? 'Change Image' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={e => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} className="hidden" />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-primary text-dark font-bold rounded-xl hover:bg-primary/90 transition-all text-sm">
                  {editing ? 'Update' : 'Add Certificate'}
                </button>
                <button type="button" onClick={() => setModal(false)}
                  className="px-5 py-2.5 border border-border text-slate-400 rounded-xl hover:border-slate-400 transition-all text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
