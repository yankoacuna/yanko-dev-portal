'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/context/LanguageContext';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  pdfFile?: string;
  skills: string[];
  issuerLogo: string;
  issuerLogoInvert?: boolean;
}

/* Santander Open Academy logo as inline SVG data URI (not in SimpleIcons) */
const SANTANDER_LOGO = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23EC0000'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='22' font-family='Arial,sans-serif' font-weight='bold'%3ES%3C/text%3E%3C/svg%3E`;

const certifications: Certification[] = [
  {
    id: 'mongodb-schema',
    title: 'MongoDB Schema Design Patterns and Anti-patterns Skill Badge',
    issuer: 'MongoDB',
    date: 'Abr. 2026',
    credentialUrl: 'https://www.credly.com/badges/2c50cd32-b330-4809-ad3a-c75d03ee815e/linked_in_profile',
    pdfFile: '/certificates/mongodb-schema-design.pdf',
    skills: ['MongoDB', 'NoSQL'],
    issuerLogo: 'https://cdn.simpleicons.org/mongodb/47A248',
  },
  {
    id: 'powerbi-intermediate',
    title: 'Power BI Intermediate: Data Analysis and Modeling',
    issuer: 'Santander Open Academy',
    date: 'Abr. 2026',
    pdfFile: '/certificates/powerbi-intermediate.pdf',
    skills: ['Microsoft Power BI'],
    issuerLogo: SANTANDER_LOGO,
  },
  {
    id: 'excel-advanced',
    title: 'Excel - from intermediate to advanced',
    issuer: 'Santander Open Academy',
    date: 'Abr. 2026',
    pdfFile: '/certificates/excel-advanced.pdf',
    skills: ['Microsoft Excel', 'Análisis de datos'],
    issuerLogo: SANTANDER_LOGO,
  },
  {
    id: 'cisco-linux',
    title: 'Linux Unhatched',
    issuer: 'Cisco',
    date: 'Abr. 2026',
    credentialUrl: 'https://www.credly.com/badges/3bafd9d1-e3e4-4869-8249-d1dccb0463d0/linked_in_profile',
    pdfFile: '/certificates/cisco-linux-unhatched.pdf',
    skills: ['Linux'],
    issuerLogo: 'https://cdn.simpleicons.org/cisco/1BA0D7',
  },
];

/* ─── Skill pill ──────────────────────────────────────────── */
function SkillPill({ skill }: Readonly<{ skill: string }>) {
  return <span className="cert-skill-pill">{skill}</span>;
}

/* ─── Single cert card ────────────────────────────────────── */
function CertCard({ cert, visible, t }: Readonly<{ cert: Certification; visible: boolean; t: (k: string) => string }>) {
  const [pdfOpen, setPdfOpen] = useState(false);

  return (
    <>
      <div
        className={`cert-card glass ${visible ? 'cert-card--visible' : ''}`}
      >

        {/* Header */}
        <div className="cert-card-header">
          <div className="cert-logo-wrap">
            <img
              src={cert.issuerLogo}
              alt={cert.issuer}
              width={28}
              height={28}
              style={{ objectFit: 'contain' }}
              loading="lazy"
            />
          </div>
          <div className="cert-meta">
            <span className="cert-issuer">{cert.issuer}</span>
            {cert.date && <span className="cert-date">{cert.date}</span>}
          </div>
        </div>

        {/* Title */}
        <h3 className="cert-title">{cert.title}</h3>

        {/* Skills */}
        <div className="cert-skills">
          {cert.skills.map((s) => (
            <SkillPill key={s} skill={s} />
          ))}
        </div>

        {/* Actions */}
        {(
          <div className="cert-actions">
            {cert.pdfFile && (
              <button
                className="cert-btn cert-btn--primary"
                onClick={() => setPdfOpen(true)}
                id={`view-cert-${cert.id}`}
                aria-label={`${t('cert_view')} ${cert.title}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {t('cert_view')}
              </button>
            )}
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-btn cert-btn--ghost"
                id={`link-cert-${cert.id}`}
                aria-label={`${t('cert_credential')} ${cert.title}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {t('cert_credential')}
              </a>
            )}
            {cert.pdfFile && (
              <a
                href={cert.pdfFile}
                download
                className="cert-btn cert-btn--ghost"
                id={`download-cert-${cert.id}`}
                aria-label={`${t('cert_download')} ${cert.title}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t('cert_download')}
              </a>
            )}
          </div>
        )}
      </div>

      {/* PDF Modal */}
      {pdfOpen && cert.pdfFile && (
        <div
          className="cert-modal-overlay"
          onClick={() => setPdfOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={cert.title}
        >
          <div className="cert-modal-content glass" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-header">
              <span className="cert-modal-title">{cert.title}</span>
              <button
                className="cert-modal-close"
                onClick={() => setPdfOpen(false)}
                aria-label={t('cert_close')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <iframe
              src={cert.pdfFile}
              title={cert.title}
              className="cert-pdf-iframe"
              loading="lazy"
            />
            <div className="cert-modal-footer">
              <a
                href={cert.pdfFile}
                download
                className="cert-btn cert-btn--primary"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t('cert_download')}
              </a>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-btn cert-btn--ghost"
                >
                  {t('cert_credential')} ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Main section ────────────────────────────────────────── */
export default function Certifications() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="certificaciones" style={{ borderTop: '1px solid var(--border)' }}>
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('certTitle') }} />
      <p className="section-subtitle">{t('certSub')}</p>

      <div className="cert-grid">
        {certifications.map((cert) => (
          <CertCard key={cert.id} cert={cert} visible={visible} t={t} />
        ))}
      </div>
    </section>
  );
}
