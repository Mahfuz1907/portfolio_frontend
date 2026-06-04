import jsPDF from 'jspdf';

const getBase64FromUrl = async (url) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const generateCV = async ({ profile, skills, projects, certificates }) => {
  const doc = new jsPDF();
  const primary = [100, 255, 218];
  const dark = [15, 23, 42];
  const gray = [100, 116, 139];
  const light = [241, 245, 249];
  let y = 0;

  // ── Header background ──
  doc.setFillColor(...dark);
  doc.rect(0, 0, 210, 65, 'F');

  // ── Avatar ──
  if (profile.avatar) {
    try {
      const imgData = await getBase64FromUrl(profile.avatar);
      if (imgData) {
        doc.addImage(imgData, 'JPEG', 160, 8, 38, 38, undefined, 'FAST');
        doc.setDrawColor(...primary);
        doc.setLineWidth(0.5);
        doc.rect(160, 8, 38, 38);
      }
    } catch { /* skip */ }
  }

  // ── Name ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...light);
  doc.text(profile.name || 'Your Name', 15, 22);

  // ── Title ──
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...primary);
  doc.text(profile.title || 'Developer', 15, 31);

  // ── Contact info ──
  doc.setFontSize(7.5);
  doc.setTextColor(180, 200, 220);
  const contacts = [
    profile.email && `Email: ${profile.email}`,
    profile.phone && `Phone: ${profile.phone}`,
    profile.location && `Location: ${profile.location}`,
  ].filter(Boolean);
  doc.text(contacts.join('   |   '), 15, 41);

  // ── Portfolio & Social links ──
  const links = [
    profile.website && `Portfolio: ${profile.website}`,
    profile.github && `GitHub: ${profile.github}`,
    profile.linkedin && `LinkedIn: ${profile.linkedin}`,
  ].filter(Boolean);

  if (links.length) {
    doc.setFontSize(7.5);
    doc.setTextColor(...primary);
    doc.text(links.join('   |   '), 15, 50);
  }

  y = 75;

  // ── Section header helper ──
  const section = (title) => {
    doc.setFillColor(...primary);
    doc.rect(15, y - 5, 3, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...dark);
    doc.text(title, 21, y + 1);
    doc.setDrawColor(220, 230, 240);
    doc.line(15, y + 5, 195, y + 5);
    y += 12;
  };

  const checkPage = (needed = 20) => {
    if (y + needed > 280) { doc.addPage(); y = 20; }
  };

  // ── About ──
  if (profile.about) {
    section('ABOUT');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    const lines = doc.splitTextToSize(profile.about, 175);
    doc.text(lines, 15, y);
    y += lines.length * 5 + 8;
  }

  // ── Skills ──
  if (skills?.length) {
    checkPage(30);
    section('SKILLS');

    const grouped = {};
    skills.forEach(s => {
      const cat = s.category?.name || 'General';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(s.name);
    });

    Object.entries(grouped).forEach(([cat, items]) => {
      checkPage(16);

      // Category name — full width on its own line
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(50, 70, 90);
      doc.text(cat + ':', 15, y);
      y += 6;

      // Skills — indented below category
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...gray);
      const skillLine = doc.splitTextToSize(items.join(',  '), 170);
      doc.text(skillLine, 20, y);
      y += skillLine.length * 5 + 6;
    });
    y += 2;
  }

  // ── Projects ──
  if (projects?.length) {
    checkPage(30);
    section('PROJECTS');

    projects.forEach(p => {
      checkPage(28);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 50, 80);
      doc.text(p.title, 15, y);
      y += 6;

      if (p.liveUrl || p.githubUrl) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(80, 120, 200);
        doc.text(p.liveUrl || p.githubUrl, 15, y);
        y += 5;
      }

      if (p.technologies?.length) {
        doc.setFontSize(8);
        doc.setTextColor(80, 160, 200);
        doc.text(p.technologies.join(' · '), 15, y);
        y += 5;
      }

      if (p.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...gray);
        const desc = doc.splitTextToSize(p.description, 175);
        doc.text(desc, 15, y);
        y += desc.length * 4.5 + 4;
      }
      y += 6;
    });
  }

  // ── Certificates ──
  if (certificates?.length) {
    checkPage(30);
    section('CERTIFICATIONS');

    certificates.forEach(c => {
      checkPage(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 50, 80);
      doc.text(c.title, 15, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...gray);
      doc.text(
        `${c.issuer || ''}${c.issueDate ? ' · ' + c.issueDate : ''}`,
        15, y
      );
      y += 10;
    });
  }

  doc.save(`${profile.name || 'CV'}_Resume.pdf`);
};
