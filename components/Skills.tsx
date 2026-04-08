'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/context/LanguageContext';

const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

type SkillLevel = 'expert' | 'advanced' | 'intermediate' | 'basic';

interface Skill {
  name: string;
  icon: string;
  style?: React.CSSProperties;
  level: SkillLevel;
}

interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

/* level → bar width % and color */
const LEVEL_MAP: Record<SkillLevel, { width: number; color: string }> = {
  expert: { width: 100, color: 'var(--accent)' },
  advanced: { width: 72, color: 'var(--accent-2)' },
  intermediate: { width: 44, color: 'var(--orange)' },
  basic: { width: 22, color: 'var(--red)' },
};

const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React', icon: `${CDN}/react/react-original.svg`, level: 'expert' },
      { name: 'TypeScript', icon: `${CDN}/typescript/typescript-original.svg`, level: 'expert' },
      { name: 'JavaScript', icon: `${CDN}/javascript/javascript-original.svg`, level: 'expert' },
      { name: 'Next.js', icon: `${CDN}/nextjs/nextjs-original.svg`, style: { filter: 'invert(1)' }, level: 'advanced' },
      { name: 'Angular', icon: `${CDN}/angularjs/angularjs-original.svg`, level: 'intermediate' },
      { name: 'Vue.js', icon: `${CDN}/vuejs/vuejs-original.svg`, level: 'intermediate' },
      { name: 'Tailwind', icon: `${CDN}/tailwindcss/tailwindcss-original.svg`, level: 'expert' },
      { name: 'Vite', icon: `${CDN}/vitejs/vitejs-original.svg`, level: 'expert' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node.js', icon: `${CDN}/nodejs/nodejs-original.svg`, level: 'expert' },
      { name: 'NestJS', icon: `${CDN}/nestjs/nestjs-original.svg`, level: 'intermediate' },
      { name: 'Flask', icon: `${CDN}/flask/flask-original.svg`, style: { filter: 'invert(1)' }, level: 'advanced' },
      { name: 'Laravel', icon: `${CDN}/laravel/laravel-original.svg`, level: 'advanced' },
      { name: 'Spring Boot', icon: `${CDN}/spring/spring-original.svg`, level: 'intermediate' },
      { name: 'Express', icon: `${CDN}/express/express-original-wordmark.svg`, style: { filter: 'invert(1)' }, level: 'advanced' },
      { name: 'PHP', icon: `${CDN}/php/php-original.svg`, level: 'advanced' },
      { name: 'Java', icon: `${CDN}/java/java-original.svg`, level: 'advanced' },
      { name: 'C', icon: `${CDN}/c/c-original.svg`, level: 'advanced' },
    ],
  },
  {
    id: 'databases',
    label: 'Bases de datos',
    skills: [
      { name: 'PostgreSQL', icon: `${CDN}/postgresql/postgresql-original.svg`, level: 'expert' },
      { name: 'MySQL', icon: `${CDN}/mysql/mysql-original.svg`, level: 'expert' },
      { name: 'MongoDB', icon: `${CDN}/mongodb/mongodb-original.svg`, level: 'advanced' },
      { name: 'Oracle EAM', icon: `${CDN}/oracle/oracle-original.svg`, level: 'advanced' },
      { name: 'Prisma', icon: `${CDN}/prisma/prisma-original.svg`, style: { filter: 'invert(1)' }, level: 'advanced' },
    ],
  },
  {
    id: 'ai-data',
    label: 'IA & Data Science',
    skills: [
      { name: 'Python', icon: `${CDN}/python/python-original.svg`, level: 'expert' },
      { name: 'PyTorch', icon: `${CDN}/pytorch/pytorch-original.svg`, level: 'expert' },
      { name: 'Scikit-learn', icon: `${CDN}/scikitlearn/scikitlearn-original.svg`, level: 'expert' },
      { name: 'Pandas', icon: `${CDN}/pandas/pandas-original.svg`, level: 'expert' },
      { name: 'NumPy', icon: `${CDN}/numpy/numpy-original.svg`, level: 'expert' },
      { name: 'Jupyter', icon: `${CDN}/jupyter/jupyter-original.svg`, level: 'expert' },
      { name: 'Matplotlib', icon: `${CDN}/matplotlib/matplotlib-original.svg`, level: 'expert' },
      { name: 'RLHF / LLM Training', icon: 'https://cdn.simpleicons.org/weightsandbiases/ffbe00', style: { filter: 'invert(1)' }, level: 'advanced' },
    ],
  },
  {
    id: 'infra',
    label: 'Infraestructura & DevOps',
    skills: [
      { name: 'Docker', icon: `${CDN}/docker/docker-original.svg`, level: 'advanced' },
      { name: 'Nginx', icon: `${CDN}/nginx/nginx-original.svg`, level: 'advanced' },
      { name: 'Linux', icon: `${CDN}/linux/linux-original.svg`, level: 'advanced' },
      { name: 'Git', icon: `${CDN}/git/git-original.svg`, level: 'expert' },
      { name: 'GitHub', icon: `${CDN}/github/github-original.svg`, style: { filter: 'invert(1)' }, level: 'expert' },
      { name: 'AWS', icon: `${CDN}/amazonwebservices/amazonwebservices-original-wordmark.svg`, level: 'intermediate' },
      { name: 'Google Cloud', icon: `${CDN}/googlecloud/googlecloud-original.svg`, level: 'advanced' },
      { name: 'Arduino', icon: `${CDN}/arduino/arduino-original.svg`, level: 'intermediate' },
    ],
  },
];

/* ─── Animated skill bar ─────────────────────────────────── */
function SkillBar({ level, visible }: Readonly<{ level: SkillLevel; visible: boolean }>) {
  const { width, color } = LEVEL_MAP[level];
  const [animWidth, setAnimWidth] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setAnimWidth(width), 120);
    return () => clearTimeout(timer);
  }, [visible, width]);

  return (
    <div className="skill-bar-track">
      <div
        className="skill-bar-fill"
        style={{
          width: `${animWidth}%`,
          background: color,
          transition: 'width 0.9s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />
    </div>
  );
}

/* ─── Skill card ─────────────────────────────────────────── */
function SkillCard({ skill, visible, t }: Readonly<{ skill: Skill; visible: boolean; t: (k: string) => string }>) {
  return (
    <div className="tech-icon-card skill-card-enhanced">
      <img loading="lazy" src={skill.icon} alt={skill.name} style={skill.style} />
      <span className="skill-name">{skill.name}</span>
      <SkillBar level={skill.level} visible={visible} />
      <span className="skill-pct">{t(`skill_${skill.level}`)}</span>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function Skills() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="habilidades" style={{ borderTop: '1px solid var(--border)' }}>
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('skillsTitle') }} />
      <p className="section-subtitle">{t('skillsSub')}</p>

      {skillCategories.map((cat) => (
        <div key={cat.id} className="tech-category">
          <div className="tech-category-label">{cat.label}</div>
          <div className="tech-icon-grid tech-icon-grid--enhanced">
            {cat.skills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} visible={visible} t={t} />
            ))}
          </div>
        </div>
      ))}

      {/* Idiomas */}
      <div className="tech-category">
        <div className="tech-category-label">{t('langTitle')}</div>
        <div className="tech-icon-grid tech-icon-grid--enhanced">
          <div className="tech-icon-card skill-card-enhanced">
            <img loading="lazy" src="https://flagcdn.com/w40/es.png" alt="Español"
              style={{ borderRadius: '2px', boxShadow: '0 0 2px rgba(255,255,255,0.2)', width: '36px', height: '24px', objectFit: 'cover' }} />
            <span className="skill-name">{t('lang_es')}</span>
            <SkillBar level="expert" visible={visible} />
            <span className="skill-pct">{t('skill_expert')}</span>
          </div>
          <div className="tech-icon-card skill-card-enhanced">
            <img loading="lazy" src="https://flagcdn.com/w40/gb.png" alt="English"
              style={{ borderRadius: '2px', boxShadow: '0 0 2px rgba(255,255,255,0.2)', width: '36px', height: '24px', objectFit: 'cover' }} />
            <span className="skill-name">{t('lang_en')}</span>
            <SkillBar level="advanced" visible={visible} />
            <span className="skill-pct">{t('skill_advanced')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
