import { useRef } from 'react';
import resumeData from './data/resume.json';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

export default function App() {
  const resumeRef = useRef();
  const d = resumeData;

  const downloadPDF = async () => {
    const element = resumeRef.current;
    
    // کمی صبر می‌کنیم تا فونت‌ها و استایل‌ها کامل لود بشن
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1200,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${d.name.replace(/ /g, '_')}_رزومه.pdf`);
  };

  return (
    <>
      {/* دکمه دانلود PDF در بالای صفحه */}
      <div className="download-btn-container">
        <button onClick={downloadPDF} className="download-btn">
          دانلود رزومه به صورت PDF
        </button>
      </div>

      <div className="page-container">
        <div ref={resumeRef} className="resume" dir="rtl">
          {/* تمام محتوای قبلی دقیقاً همون‌طور که بود */}
          <aside className="sidebar">
            <div className="photo-circle">
              <img src={d.photo} alt={d.name} />
            </div>

            <h2 className="sidebar-title">مشخصات فردی</h2>
            <ul className="info-list">
              <li><span>سن:</span> {d.personal.age}</li>
              <li><span>جنسیت:</span> {d.personal.gender}</li>
              <li><span>وضعیت تأهل:</span> {d.personal.marital}</li>
              <li><span>خدمت سربازی:</span> {d.personal.military}</li>
              <li><span>محل سکونت:</span> {d.personal.city}</li>
            </ul>

            <h2 className="sidebar-title">اطلاعات تماس</h2>
            <ul className="info-list">
              <li><span>تلفن:</span> {d.contact.phone}</li>
              <li><span>موبایل:</span> {d.contact.mobile}</li>
              <li><span>ایمیل:</span> {d.contact.email}</li>
              <li><span>لینکدین:</span> {d.contact.linkedin}</li>
            </ul>

            <h2 className="sidebar-title">زبان‌های خارجی</h2>
            <div className="languages">
              {d.languages.map((l, i) => (
                <div key={i} className="lang-item">
                  <strong>{l.name}</strong> <span>{l.level}</span>
                </div>
              ))}
            </div>

            <h2 className="sidebar-title">مهارت‌های تکمیلی</h2>
            <div className="skills-container">
              {Object.entries(d.skills).map(([level, items]) => (
                <div key={level}>
                  <h4 className="skill-level">{level}</h4>
                  <div className="skill-badges">
                    {items.map((s, i) => (
                      <span key={i} className="badge">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="footer-logo">
              <img src="https://www.khoshsafa.ir/" alt="khoshsafa" />
              <p>www.khoshsafa.ir</p>
            </div>
          </aside>

          <main className="main-content">
            <header className="header">
              <div>
                <h1>{d.name}</h1>
                <h2>{d.title}</h2>
              </div>
              <div className="header-meta">
                <span>شناسه کاربری: {d.id}</span>
                <span>بروزرسانی رزومه: {d.updated}</span>
              </div>
            </header>

            <section className="section">
              <h3>درباره‌ی من</h3>
              <p>{d.about}</p>
            </section>

            <section className="section">
              <h3>سوابق شغلی</h3>
              {d.experience.map((job, i) => (
                <div key={i} className="job">
                  <div className="job-header">
                    <h4>{job.title}</h4>
                    <span className="period">{job.period}</span>
                  </div>
                  <p className="company">{job.company} - {job.location}</p>
                  <ul className="tasks">
                    {job.tasks.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section className="section">
              <h3>سوابق تحصیلی</h3>
              {d.education.map((edu, i) => (
                <div key={i} className="edu-item">
                  <h4>{edu.degree}</h4>
                  <p>{edu.university} | {edu.years}</p>
                </div>
              ))}
            </section>

            <section className="section">
              <h3>دوره‌های آموزشی</h3>
              {d.courses.map((c, i) => (
                <p key={i}><strong>{c.name}</strong> - {c.institute} ({c.year})</p>
              ))}
            </section>

            <section className="section">
              <h3>جوایز و افتخارات</h3>
              {d.awards.map((a, i) => <p key={i}>• {a}</p>)}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}