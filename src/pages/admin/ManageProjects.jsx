import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiExternalLink, FiGithub } from 'react-icons/fi';

const empty = { title: '', description: '', technologies: '', liveUrl: '', githubUrl: '', category: '', featured: false };

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => Promise.all([api.get('/projects'), api.get('/categories?type=project')])
    .then(([p, c]) => { setProjects(p.data); setCategories(c.data); });

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setImage(null); setPreview(''); setModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, technologies: p.technologies?.join(', ') || '', category: p.category?._id || '' });
    setPreview(p.image || '');
    setImage(null);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'technologies') fd.append(k, JSON.stringify(v.split(',').map(t => t.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (image) fd.append('image', image);
      if (editing) { await api.put(`/projects/${editing}`, fd); toast.success('Updated!'); }
      else { await api.post('/projects', fd); toast.success('Project added!'); }
      setModal(false); load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-white">Manage Projects</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-dark font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm pulse-glow">
          <FiPlus size={16} /> Add Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {projects.map(p => (
          <div key={p._id} className="bg-card border border-border rounded-2xl overflow-hidden card-hover">
            <div className="h-36 bg-dark relative">
              {p.image ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-4xl text-primary/30 font-bold font-display">{p.title?.charAt(0)}</div>}
              {p.featured && <span className="absolute top-2 right-2 bg-primary text-dark text-xs font-bold px-2 py-0.5 rounded">Featured</span>}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">{p.title}</h3>
                <span className="text-xs text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded ml-2 shrink-0">{p.category?.name}</span>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2 mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {p.technologies?.map(t => <span key={t} className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">{t}</span>)}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors"><FiGithub size={16} /></a>}
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors"><FiExternalLink size={16} /></a>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-primary transition-colors p-1"><FiEdit2 size={15} /></button>
                  <button onClick={() => handleDelete(p._id)} className="text-slate-400 hover:text-red-400 transition-colors p-1"><FiTrash2 size={15} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && <div className="text-center py-16 text-slate-500">No projects yet.</div>}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-white">{editing ? 'Edit Project' : 'Add Project'}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                  className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors" />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors resize-none" />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Technologies (comma separated)</label>
                <input value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Live URL</label>
                  <input value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })}
                    className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">GitHub URL</label>
                  <input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })}
                    className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors" />
                </div>
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
                <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Project Image</label>
                {preview && <img src={preview} alt="" className="w-full h-32 object-cover rounded-lg mb-2" />}
                <label className="cursor-pointer px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/20 transition-all inline-block">
                  {preview ? 'Change Image' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={e => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} className="hidden" />
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}
                  className="checkbox checkbox-sm checkbox-primary" />
                <label htmlFor="featured" className="text-sm text-slate-300">Mark as featured</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-primary text-dark font-bold rounded-xl hover:bg-primary/90 transition-all text-sm">
                  {editing ? 'Update' : 'Add Project'}
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
