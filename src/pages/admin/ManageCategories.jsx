import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi';

const types = ['skill', 'project', 'certificate'];
const typeColors = { skill: 'text-cyan-400 bg-cyan-400/10', project: 'text-violet-400 bg-violet-400/10', certificate: 'text-amber-400 bg-amber-400/10' };

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'skill' });
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = () => api.get('/categories').then(r => setCategories(r.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', form);
      setForm({ name: '', type: 'skill' });
      load();
      toast.success('Category added!');
    } catch { toast.error('Failed'); }
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/categories/${id}`, editing);
      setEditing(null);
      load();
      toast.success('Updated!');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      load();
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const filtered = filter === 'all' ? categories : categories.filter(c => c.type === filter);

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-white mb-8">Manage Categories</h1>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-white mb-4">Add New Category</h2>
        <div className="flex flex-wrap gap-4">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Category name" required
            className="flex-1 min-w-48 bg-dark border border-border rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-primary text-sm transition-colors" />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
            className="bg-dark border border-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary text-sm transition-colors">
            {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-dark font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm">
            <FiPlus size={16} /> Add
          </button>
        </div>
      </form>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        {['all', ...types].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-lg text-xs font-mono uppercase transition-all border ${filter === t ? 'bg-primary text-dark border-primary' : 'border-border text-slate-400 hover:border-primary/40'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(cat => (
          <div key={cat._id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            {editing?._id === cat._id ? (
              <>
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="flex-1 bg-dark border border-primary rounded-lg px-3 py-2 text-white text-sm focus:outline-none" />
                <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })}
                  className="bg-dark border border-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button onClick={() => handleUpdate(cat._id)} className="text-primary hover:text-white transition-colors"><FiCheck size={18} /></button>
                <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-white transition-colors"><FiX size={18} /></button>
              </>
            ) : (
              <>
                <span className="flex-1 text-white font-medium">{cat.name}</span>
                <span className={`text-xs font-mono px-2 py-1 rounded ${typeColors[cat.type]}`}>{cat.type}</span>
                <button onClick={() => setEditing({ ...cat })} className="text-slate-400 hover:text-primary transition-colors"><FiEdit2 size={16} /></button>
                <button onClick={() => handleDelete(cat._id)} className="text-slate-400 hover:text-red-400 transition-colors"><FiTrash2 size={16} /></button>
              </>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No categories yet. Add one above.</div>
        )}
      </div>
    </div>
  );
}
