'use client';

import React from 'react';
import { useI18n } from '@/context/LanguageContext';
import { toast } from 'sonner';

export default function Contact() {
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const message = formData.get('message') as string;
    const name = formData.get('name') as string;

    // Antihack check
    const hackPatterns = ['<script', 'onerror', 'onclick', 'eval(', 'document.cookie'];
    if (hackPatterns.some(p => (name + message).toLowerCase().includes(p.toLowerCase()))) {
      toast.error(t('hackToast5' as any));
      return;
    }
    
    const promise = fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    toast.promise(promise, {
      loading: t('messageSending'),
      success: () => {
        form.reset();
        return t('contactSuccess');
      },
      error: t('contactError'),
    });
  };

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
            action={`https://formsubmit.co/ajax/${process.env.NEXT_PUBLIC_FORMSUBMIT_KEY}`}
            method="POST"
            onSubmit={handleSubmit}
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
