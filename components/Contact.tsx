'use client';

import React from 'react';
import { useI18n } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useI18n();

  return (
    <section id="contacto" className="section">
      <div className="section-titular">
        <h2 dangerouslySetInnerHTML={{ __html: t('contactTitle') }} />
        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1rem' }}>
          {t('contactSub')}
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-glass-card">
          <form
            id="contactForm"
            className="contact-form"
            action="https://formsubmit.co/133004df0878810044f163df48f5d6ee"
            method="POST"
          >
            {/* Formsubmit config */}
            <input type="hidden" name="_next" value="https://yankoacuna.cl/" />
            <input type="hidden" name="_subject" value="Nuevo Mensaje - yankoacuna.cl" />
            <input type="hidden" name="_captcha" value="true" />
            <input type="hidden" name="_template" value="box" />

            <div className="form-group">
              <input type="text" id="name" name="name" required placeholder=" " />
              <label htmlFor="name">{t('contactName')}</label>
              <div className="input-highlight" />
            </div>

            <div className="form-group">
              <input type="email" id="email" name="email" required placeholder=" " />
              <label htmlFor="email">{t('contactEmail')}</label>
              <div className="input-highlight" />
            </div>

            <div className="form-group">
              <textarea id="message" name="message" required placeholder=" " rows={5} />
              <label htmlFor="message">{t('contactMessage')}</label>
              <div className="input-highlight" />
            </div>

            <button type="submit" className="contact-submit-btn">
              <span>{t('contactSubmit')}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
