'use client';

import React from 'react';
import { useI18n } from '@/context/LanguageContext';

const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const skillCategories = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React',       icon: `${CDN}/react/react-original.svg` },
      { name: 'Angular',     icon: `${CDN}/angularjs/angularjs-original.svg` },
      { name: 'Vue.js',      icon: `${CDN}/vuejs/vuejs-original.svg` },
      { name: 'TypeScript',  icon: `${CDN}/typescript/typescript-original.svg` },
      { name: 'JavaScript',  icon: `${CDN}/javascript/javascript-original.svg` },
      { name: 'Tailwind',    icon: `${CDN}/tailwindcss/tailwindcss-original.svg` },
      { name: 'Vite',        icon: `${CDN}/vitejs/vitejs-original.svg` },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node.js',     icon: `${CDN}/nodejs/nodejs-original.svg` },
      { name: 'Flask',       icon: `${CDN}/flask/flask-original.svg`,        style: { filter: 'invert(1)' } },
      { name: 'Laravel',     icon: `${CDN}/laravel/laravel-original.svg` },
      { name: 'Spring Boot', icon: `${CDN}/spring/spring-original.svg` },
      { name: 'PHP',         icon: `${CDN}/php/php-original.svg` },
      { name: 'Java',        icon: `${CDN}/java/java-original.svg` },
      { name: 'Express',     icon: `${CDN}/express/express-original-wordmark.svg`, style: { filter: 'invert(1)' } },
      { name: 'NestJS',      icon: `${CDN}/nestjs/nestjs-original.svg` },
      { name: 'C',           icon: `${CDN}/c/c-original.svg` },
    ],
  },
  {
    id: 'databases',
    label: 'Bases de datos',
    skills: [
      { name: 'PostgreSQL',  icon: `${CDN}/postgresql/postgresql-original.svg` },
      { name: 'MySQL',       icon: `${CDN}/mysql/mysql-original.svg` },
      { name: 'MongoDB',     icon: `${CDN}/mongodb/mongodb-original.svg` },
      { name: 'Oracle EAM',  icon: `${CDN}/oracle/oracle-original.svg` },
      { name: 'Prisma',      icon: `${CDN}/prisma/prisma-original.svg`,       style: { filter: 'invert(1)' } },
    ],
  },
  {
    id: 'ai-data',
    label: 'IA & Data Science',
    skills: [
      { name: 'Python',       icon: `${CDN}/python/python-original.svg` },
      { name: 'PyTorch',      icon: `${CDN}/pytorch/pytorch-original.svg` },
      { name: 'Scikit-learn', icon: `${CDN}/scikitlearn/scikitlearn-original.svg` },
      { name: 'Pandas',       icon: `${CDN}/pandas/pandas-original.svg` },
      { name: 'NumPy',        icon: `${CDN}/numpy/numpy-original.svg` },
      { name: 'Jupyter',      icon: `${CDN}/jupyter/jupyter-original.svg` },
      { name: 'Matplotlib',   icon: `${CDN}/matplotlib/matplotlib-original.svg` },
      { name: 'RLHF',         icon: `${CDN}/pytorch/pytorch-original.svg` },
    ],
  },
  {
    id: 'infra',
    label: 'Infraestructura & DevOps',
    skills: [
      { name: 'Docker',       icon: `${CDN}/docker/docker-original.svg` },
      { name: 'Nginx',        icon: `${CDN}/nginx/nginx-original.svg` },
      { name: 'Linux',        icon: `${CDN}/linux/linux-original.svg` },
      { name: 'Git',          icon: `${CDN}/git/git-original.svg` },
      { name: 'GitHub',       icon: `${CDN}/github/github-original.svg`,      style: { filter: 'invert(1)' } },
      { name: 'AWS',          icon: `${CDN}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
      { name: 'Google Cloud', icon: `${CDN}/googlecloud/googlecloud-original.svg` },
      { name: 'Arduino',      icon: `${CDN}/arduino/arduino-original.svg` },
    ],
  },
];

export default function Skills() {
  const { t } = useI18n();

  return (
    <section id="habilidades" style={{ borderTop: '1px solid var(--border)' }}>
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('skillsTitle') }} />
      <p className="section-subtitle">{t('skillsSub')}</p>

      {skillCategories.map((cat) => (
        <div key={cat.id} className="tech-category">
          <div className="tech-category-label">{cat.label}</div>
          <div className="tech-icon-grid">
            {cat.skills.map((skill, idx) => (
              <div key={idx} className="tech-icon-card">
                <img
                  loading="lazy"
                  src={skill.icon}
                  alt={skill.name}
                  style={skill.style}
                />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Idiomas */}
      <div className="tech-category">
        <div className="tech-category-label">{t('langTitle')}</div>
        <div className="tech-icon-grid">
          <div className="tech-icon-card">
            <img
              loading="lazy"
              src="https://flagcdn.com/w40/es.png"
              alt="Español"
              style={{ borderRadius: '2px', boxShadow: '0 0 2px rgba(255,255,255,0.2)', width: '36px', height: '24px', objectFit: 'cover' }}
            />
            <span>{t('lang_es')}</span>
          </div>
          <div className="tech-icon-card">
            <img
              loading="lazy"
              src="https://flagcdn.com/w40/gb.png"
              alt="English"
              style={{ borderRadius: '2px', boxShadow: '0 0 2px rgba(255,255,255,0.2)', width: '36px', height: '24px', objectFit: 'cover' }}
            />
            <span>{t('lang_en')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
