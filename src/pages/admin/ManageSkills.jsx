import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const levelColors = { Beginner: 'text-slate-400', Intermediate: 'text-cyan-400', Advanced: 'text-primary', Expert: 'text-amber-400' };

const empty = { name: '', level: 'Intermediate', category: '' };

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => Promise.all([
    api.get('/skills'),
    api.get('/categories?type=skill'),
  ]).then(([s, c]) => { setSkills(s.data); setCategories(c.data); });

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (s) => { setEditing(s._id); setForm({ name: s.name, level: s.level, category: s.category?._id || '' }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/skills/${editing}`, form); toast.success('Updated!'); }
      else { await api.post('/skills', form); toast.success('Skill added!'); }
      setModal(false); load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    await api.delete(`/skills/${id}`);
    toast.success('Deleted'); load();
  };

  // Group by category
  const grouped = skills.reduce((acc, s) => {
    const key = s.category?.name || 'Uncategorized';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-white">Manage Skills</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-dark font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm pulse-glow">
          <FiPlus size={16} /> Add Skill
        </button>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-8">
          <h3 className="text-primary font-mono text-sm uppercase tracking-widest mb-3">{cat}</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {items.map(skill => (
              <div key={skill._id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 card-hover">
                <div className="flex-1">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className={`ml-2 text-xs font-mono ${levelColors[skill.level]}`}>{skill.level}</span>
                </div>
                <button onClick={() => openEdit(skill)} className="text-slate-400 hover:text-primary transition-colors p-1"><FiEdit2 size={15} /></button>
                <button onClick={() => handleDelete(skill._id)} className="text-slate-400 hover:text-red-400 transition-colors p-1"><FiTrash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && <div className="text-center py-16 text-slate-500">No skills yet. Add your first skill!</div>}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-white">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Skill Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                  className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors" />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Level</label>
                <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
                  className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors">
                  {levels.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase mb-1.5 block">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required
                  className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                {categories.length === 0 && <p className="text-xs text-amber-400 mt-1">Add skill categories first from Categories page.</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 py-2.5 bg-primary text-dark font-bold rounded-xl hover:bg-primary/90 transition-all text-sm">
                  {editing ? 'Update' : 'Add Skill'}
                </button>
                <button type="button" onClick={() => setModal(false)}
                  className="px-5 py-2.5 border border-border text-slate-400 rounded-xl hover:border-slate-400 transition-all text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
