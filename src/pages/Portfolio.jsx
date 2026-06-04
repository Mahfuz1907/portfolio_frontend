import { useState, useEffect } from 'react';
import api from '../utils/api';
import { generateCV } from '../utils/generateCV';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Skills from '../components/portfolio/Skills';
import Projects from '../components/portfolio/Projects';
import Certificates from '../components/portfolio/Certificates';
import Contact from '../components/portfolio/Contact';
import Navbar from '../components/portfolio/Navbar';

export default function Portfolio() {
  const [data, setData] = useState({ profile: {}, skills: [], projects: [], certificates: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profile, skills, projects, certificates] = await Promise.all([
          api.get('/profile'),
          api.get('/skills'),
          api.get('/projects'),
          api.get('/certificates'),
        ]);
        setData({
          profile: profile.data,
          skills: skills.data,
          projects: projects.data,
          certificates: certificates.data,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDownloadCV = async () => {
    await generateCV(data);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-primary font-mono text-sm">Loading portfolio...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark">
      <Navbar profile={data.profile} onDownloadCV={handleDownloadCV} />
      <Hero profile={data.profile} onDownloadCV={handleDownloadCV} />
      <About profile={data.profile} />
      <Skills skills={data.skills} />
      <Projects projects={data.projects} />
      <Certificates certificates={data.certificates} />
      <Contact profile={data.profile} />
    </div>
  );
}
