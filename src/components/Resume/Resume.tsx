import { FiDownload } from 'react-icons/fi';
import './Resume.css';
import { useState } from 'react';
import LoadingSpinner from '../Spinner/LoadingSpinner';

export default function Resume() {
  const pdfSrc = '/resume.pdf#toolbar=0&navpanes=0&scrollbar=0';
  const [loading, setIsLoading] = useState(true);
  return (
    <main className="resume-page">
      <div className="resume-header flex-row">
        <h1 className="resume-title">Resume</h1>
        <a href="/resume.pdf" className="download-icon" download>
          <FiDownload size={20} />
        </a>
      </div>

      <div className="resume-preview">
        {loading && <LoadingSpinner className="resume-loading-spinner" />}
        <object data={pdfSrc} type="application/pdf" className="resume-pdf">
          <iframe
            src={pdfSrc}
            title="Resume PDF"
            className="resume-pdf"
            onLoad={() => setIsLoading(false)}
          />
        </object>
      </div>
    </main>
  );
}
