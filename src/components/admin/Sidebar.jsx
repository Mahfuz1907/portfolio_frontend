import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiCode, FiFolder, FiAward, FiTag, FiLogOut, FiHome, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const links = [
  { to: '/admin', label: 'Profile', icon: <FiUser size={18} />, exact: true },
  { to: '/admin/categories', label: 'Categories', icon: <FiTag size={18} /> },
  { to: '/admin/skills', label: 'Skills', icon: <FiCode size={18} /> },
  { to: '/admin/projects', label: 'Projects', icon: <FiFolder size={18} /> },
  { to: '/admin/certificates', label: 'Certificates', icon: <FiAward size={18} /> },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const NavItems = () => (
    <>
      {links.map(l => (
        <NavLink key={l.to} to={l.to} end={l.exact}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive ? 'bg-primary text-dark' : 'text-slate-400 hover:text-primary hover:bg-primary/10'
            }`
          }>
          {l.icon} {l.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button className="md:hidden fixed top-4 left-4 z-50 bg-card border border-border p-2 rounded-lg text-white"
        onClick={() => setOpen(!open)}>
        {open ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-40 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-border">
          <h2 className="font-display font-bold text-xl text-white">Portfolio <span className="text-primary">Admin</span></h2>
          <p className="text-xs text-slate-500 mt-1 font-mono">Control Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItems />
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <a href="/" target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
            <FiHome size={18} /> View Portfolio
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-all">
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
