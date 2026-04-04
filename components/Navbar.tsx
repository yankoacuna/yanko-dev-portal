'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'educacion', label: t('nav_edu') },
    { id: 'experiencia', label: t('nav_exp') },
    { id: 'proyectos', label: t('nav_proj') },
    { id: 'habilidades', label: t('nav_skills') },
    { id: 'contacto', label: t('nav_contact') },
  ];

  return (
    <nav className={`top-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', width: '100%' }}>
        <a href="#" className="nav-brand">
          Yanko <span>Acuña</span>
        </a>

        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-controls" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <button
            className="lang-btn glass"
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            title={lang === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
            aria-label={lang === 'es' ? 'Cambiar idioma a Inglés' : 'Change language to Spanish'}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
              fontSize: '0.85rem', fontWeight: 700, borderRadius: '20px', cursor: 'pointer',
              color: 'var(--text-primary)', border: '1px solid var(--border)', background: 'var(--bg-card)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
            {lang.toUpperCase()}
          </button>

          <button
            className="theme-btn glass"
            onClick={toggleTheme}
            title={lang === 'es' ? 'Cambiar tema' : 'Toggle theme'}
            aria-label={theme === 'dark' ? (lang === 'es' ? 'Cambiar a modo claro' : 'Switch to light mode') : (lang === 'es' ? 'Cambiar a modo oscuro' : 'Switch to dark mode')}
            style={{
              width: '38px', height: '38px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderRadius: '50%', cursor: 'pointer',
              color: 'var(--text-primary)', border: '1px solid var(--border)', background: 'var(--bg-card)'
            }}
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
