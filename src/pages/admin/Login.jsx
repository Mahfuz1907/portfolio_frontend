import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
      toast.success('Welcome back!');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#64FFDA 1px, transparent 1px), linear-gradient(90deg, #64FFDA 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400 text-sm">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-8 space-y-5 shadow-2xl">
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 block">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
              placeholder="admin@example.com" required />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 block">Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-dark font-bold rounded-xl hover:bg-primary/90 transition-all pulse-glow disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-6">
          <a href="/" className="hover:text-primary transition-colors">← Back to portfolio</a>
        </p>
      </div>
    </div>
  );
}
