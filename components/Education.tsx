'use client';

import React from 'react';
import { useI18n } from '@/context/LanguageContext';

export default function Education() {
  const { t } = useI18n();

  return (
    <section id="educacion" style={{ borderBottom: '1px solid var(--border)' }}>
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('eduTitle') }} />

      <div className="timeline">
        <div className="tl-item">
          <div className="tl-card">
            <div className="tl-header">
              <div>
                <div className="tl-title">{t('edu1_title')}</div>
                <div className="tl-company" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img
                    loading="lazy"
                    src="/imagenes/logos/logo_utalca.webp"
                    alt="UTalca Logo"
                    width={56}
                    height={22}
                    style={{ height: '22px', width: 'auto', borderRadius: '4px', background: 'white', padding: '2px' }}
                  />
                  <span>{t('edu_university')}</span>
                </div>
              </div>
              <span className="tl-date">2020 — 2025</span>
            </div>

            <div className="edu-content">
              <div className="edu-specialization">
                <div className="edu-specialization-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: 'middle' }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  {t('edu2_title')}
                </div>
                <p>
                  {t('edu2_desc')}
                </p>
              </div>

              <ul className="edu-bullets">
                <li dangerouslySetInnerHTML={{ __html: t('edu1_project') }} />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
