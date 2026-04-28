'use client';

import React from 'react';
import { useI18n } from '@/context/LanguageContext';

function scrollToProject(id: string) {
  const project = document.getElementById(id);
  if (!project) return;

  // Show if in hidden section
  const hiddenWrapper = document.querySelector('.hidden-projects');
  if (hiddenWrapper && hiddenWrapper.contains(project) && !hiddenWrapper.classList.contains('show')) {
    hiddenWrapper.classList.add('show');
    const btn = document.querySelector('.btn-load-more');
    if (btn) btn.textContent = '▴ Ver Menos Proyectos';
  }

  // Scroll to project
  setTimeout(() => {
    const yOffset = -100;
    const y = project.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });

    // Highlight effect
    project.classList.add('project-highlight');
    setTimeout(() => project.classList.remove('project-highlight'), 2500);
  }, 200);
}

export default function Experience() {
  const { t } = useI18n();

  const experiences = [
    {
      id: 'cna',
      title: t('cna_title'),
      company: t('cna_company'),
      logo: '/imagenes/logos/nuevos_aires.webp',
      date: t('cna_date'),
      bullets: [t('cna_1'), t('cna_2'), t('cna_3')],
      projectId: null,
    },
    {
      id: 'pf',
      title: t('pf_title'),
      company: 'PF Alimentos · Talca, Chile',
      logo: '/imagenes/logos/pf_alimentos.webp',
      date: t('pf_date'),
      bullets: [t('pf1'), t('pf2'), t('pf3'), t('pf4')],
      projectId: 'proyecto-pf',
    },
    {
      id: 'iansa2',
      title: t('iansa2_title'),
      company: 'Empresas Iansa · Las Condes, Chile',
      logo: '/imagenes/logos/empresas_iansa.webp',
      date: t('iansa2_date'),
      bullets: [t('iansa2_1'), t('iansa2_2'), t('iansa2_3')],
      projectId: 'proyecto-iansa',
    },
    {
      id: 'iansa1',
      title: t('iansa1_title'),
      company: 'Empresas Iansa · Las Condes, Chile',
      logo: '/imagenes/logos/empresas_iansa.webp',
      date: t('iansa1_date'),
      bullets: [t('iansa1_1'), t('iansa1_2'), t('iansa1_3')],
      projectId: 'proyecto-iansa',
    },
    {
      id: 'outlier',
      title: t('outlier_title'),
      company: t('outlier_company'),
      logo: '/imagenes/logos/outlier.webp',
      date: t('outlier_date'),
      bullets: [t('outlier1'), t('outlier2'), t('outlier3')],
      projectId: 'proyecto-outlier',
    },
    {
      id: 'ta',
      title: t('ta_title'),
      company: 'Universidad de Talca · Curicó, Chile',
      logo: '/imagenes/logos/logo_utalca.webp',
      date: t('ta_date'),
      bullets: [t('ta1'), t('ta2')],
      projectId: null,
    },
  ];

  return (
    <section id="experiencia" style={{ borderBottom: '1px solid var(--border)' }}>
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('expTitle') }} />
      <p className="section-subtitle">{t('expSub')}</p>

      <div className="timeline">
        {experiences.map((exp) => (
          <div key={exp.id} className="tl-item">
            <div
              className={`tl-card${exp.projectId ? ' clickable' : ''}`}
              onClick={exp.projectId ? () => scrollToProject(exp.projectId!) : undefined}
              title={exp.projectId ? 'Ir al proyecto' : undefined}
            >
              <div className="tl-header">
                <div>
                  <div className="tl-title">{exp.title}</div>
                  <div className="tl-company" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      loading="lazy"
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      width={65}
                      height={24}
                      style={{ height: '24px', width: 'auto', borderRadius: '4px', background: 'white', padding: '2px' }}
                    />
                    {exp.company}
                  </div>
                </div>
                <span className="tl-date">{exp.date}</span>
              </div>
              <ul>
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
