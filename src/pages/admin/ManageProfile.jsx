import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const fields = [
  { key: 'name', label: 'Full Name', type: 'text' },
  { key: 'title', label: 'Title / Role', type: 'text', placeholder: 'Full Stack Developer' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'github', label: 'GitHub URL', type: 'text' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
  { key: 'website', label: 'Website URL', type: 'text' },
];

export default function ManageProfile() {
  const [form, setForm] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/profile').then(r => { setForm(r.data); setPreview(r.data.avatar || ''); });
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append('avatar', avatar);
      await api.put('/profile', fd);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-white mb-8">Manage Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Avatar */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-border bg-dark">
              {preview
                ? <img src={preview} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-slate-600 text-3xl font-bold">?</div>
              }
            </div>
            <div>
              <label className="cursor-pointer px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/20 transition-all">
                Upload Photo
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
              <p className="text-xs text-slate-500 mt-2">JPG, PNG, WebP. Max 5MB.</p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                <input type={f.type} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder || ''}
                  className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-colors text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Bio & About */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-white mb-2">Bio & About</h2>
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">Short Bio (Hero Section)</label>
            <textarea value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })}
              rows={2} placeholder="One-liner that appears in the hero section"
              className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-colors text-sm resize-none" />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">About (About Section)</label>
            <textarea value={form.about || ''} onChange={e => setForm({ ...form, about: e.target.value })}
              rows={5} placeholder="Detailed about text for the About section"
              className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-colors text-sm resize-none" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="px-8 py-3 bg-primary text-dark font-bold rounded-xl hover:bg-primary/90 transition-all pulse-glow disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
