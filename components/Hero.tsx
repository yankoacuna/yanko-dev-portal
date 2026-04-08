'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/context/LanguageContext';
import { toast } from 'sonner';

/* ─── Main Hero ─────────────────────────────────────────── */
export default function Hero() {
  const { lang, t } = useI18n();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('contacto@yankoacuna.cl');
    toast.success(t('emailCopied'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="hero">
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* Avatar */}
        <div className="hero-avatar-wrap">
          <div className="hero-avatar-ring">
            <img
              src="/imagenes/yanko_avatar.webp"
              alt="Yanko Acuña Villaseca"
              className="hero-avatar-img"
            />
          </div>
        </div>

        <p className="subtitle" style={{ fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          {t('subtitle')}
        </p>
        <h1 className="animate-in fade-in-up duration-700" style={{ marginBottom: '1rem' }}>Yanko Acuña Villaseca</h1>
        <p style={{
          maxWidth: '680px', margin: '0 auto 1.5rem',
          color: 'var(--text-secondary)', fontSize: '1.05rem',
          fontWeight: 300, lineHeight: 1.7
        }}>
          {t('heroDesc')}
        </p>

        {/* About Me toggle */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setAboutOpen(!aboutOpen)}
            className="about-me-toggle"
            aria-expanded={aboutOpen}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>{t('aboutMeBtn')}</span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'transform 0.3s', transform: aboutOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div className={`about-me-panel${aboutOpen ? ' open' : ''}`}>
            <p>{t('aboutMeText')}</p>
          </div>
        </div>

        {/* Social links */}
        <div className="social-links" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="https://www.linkedin.com/in/yanko-acuna-villaseca" target="_blank" rel="noopener noreferrer" className="glass hover:bg-[var(--accent-glow)] transition-all" style={{ padding: '0.7rem 1.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.988V8.998h3.1v1.562h.044c.431-.816 1.484-1.676 3.053-1.676 3.267 0 3.868 2.149 3.868 4.945v6.623zM5.337 7.433a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6zm1.562 13.019H3.775V8.998h3.124v11.454zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <a href="https://github.com/yankoacuna" target="_blank" rel="noopener noreferrer" className="glass hover:bg-[var(--accent-glow)] transition-all" style={{ padding: '0.7rem 1.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          <button
            onClick={copyEmail}
            className="glass hover:bg-[var(--accent-glow)] transition-all"
            style={{
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: '0.6rem', padding: '0.7rem 1.5rem', borderRadius: '10px',
              color: copied ? 'var(--green)' : 'var(--text-primary)', border: 'none', outline: 'none',
              fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s'
            }}
          >
            {/* Mail icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polyline points="2,4 12,13 22,4" />
            </svg>
            contacto@yankoacuna.cl
            {/* Clipboard / check icon */}
            <span style={{ display: 'flex', alignItems: 'center', marginLeft: '2px', transition: 'transform 0.2s', transform: copied ? 'scale(1.2)' : 'scale(1)' }}>
              {copied ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </span>
          </button>
        </div>

        {/* CV download */}
        <div className="cv-links" style={{ marginTop: '2rem' }}>
          <a
            href={lang === 'es' ? '/CV/CV_Yanko_Acuna_Villaseca.pdf' : '/CV/CV_Yanko_Acuna_Villaseca_en.pdf'}
            download={lang === 'es' ? 'CV_Yanko_Acuna_Villaseca.pdf' : 'CV_Yanko_Acuna_Villaseca_en.pdf'}
            className="cv-btn glass"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
              padding: '1rem 2.2rem', borderRadius: '12px',
              border: '2px solid var(--accent)', color: 'var(--accent)',
              textDecoration: 'none', fontSize: '1rem', fontWeight: 700,
              background: 'rgba(58, 134, 255, 0.05)', transition: 'all 0.3s'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {lang === 'es' ? t('cvEs') : t('cvEn')}
          </a>
        </div>
      </div>
    </header>
  );
}
