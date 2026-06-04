import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Portfolio from './pages/Portfolio';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#111827', color: '#F1F5F9', border: '1px solid #1F2937' }
        }} />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
