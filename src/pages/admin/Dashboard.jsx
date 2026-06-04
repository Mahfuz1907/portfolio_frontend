import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import ManageProfile from './ManageProfile';
import ManageCategories from './ManageCategories';
import ManageSkills from './ManageSkills';
import ManageProjects from './ManageProjects';
import ManageCertificates from './ManageCertificates';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-dark flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-8 overflow-x-hidden">
        <Routes>
          <Route index element={<ManageProfile />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="certificates" element={<ManageCertificates />} />
        </Routes>
      </main>
    </div>
  );
}
