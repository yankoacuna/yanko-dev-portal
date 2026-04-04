'use client';

import React, { useState } from 'react';
import { useI18n } from '@/context/LanguageContext';

// SVG GitHub icon reusable
const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const StackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="8" height="8" x="8" y="2" rx="1" />
    <rect width="8" height="8" x="2" y="14" rx="1" />
    <rect width="8" height="8" x="14" y="14" rx="1" />
    <path d="M12 10v4" />
    <path d="M6 14v-1.5a2.5 2.5 0 0 1 2.5-2.5h7a2.5 2.5 0 0 1 2.5 2.5V14" />
  </svg>
);

interface TechGroup {
  label: string;
  tags: { text: string; cls: string }[];
}

interface Project {
  id: string;
  title: string;
  desc: string;
  image: string;
  categories: string[];
  badge: 'industrial' | 'research' | 'academic' | 'global';
  badgeLabel: string;
  impactTags: { text: string; cls: string }[];
  logo?: string;
  context?: string;
  features: string[];
  techGroups: TechGroup[];
  github?: string;
}

function ProjectCard({ proj, t }: { proj: Project; t: (k: string) => string }) {
  const [open, setOpen] = useState(false);

  const badgeClass = {
    industrial: 'badge-industrial',
    research: 'badge-research',
    academic: 'badge-academic',
    global: 'badge-global',
  }[proj.badge];

  const badgeIcon = {
    industrial: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M17 18h1" /><path d="M12 18h1" /><path d="M7 18h1" />
      </svg>
    ),
    research: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
      </svg>
    ),
    academic: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    global: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  }[proj.badge];

  return (
    <div className="project-card" id={proj.id}>
      <div className="project-image-wrap">
        <img loading="lazy" src={proj.image} alt={proj.title} />
        <span className={`badge-featured ${badgeClass}`}>
          {badgeIcon}
          <span>{proj.badgeLabel}</span>
        </span>
      </div>

      <div className="card-body">
        <div className="impact-line">
          {proj.impactTags.map((tag, i) => (
            <span key={i} className={`tag ${tag.cls}`}>{tag.text}</span>
          ))}
        </div>

        <div className="card-header">
          <h3>{proj.title}</h3>
          {proj.logo ? (
            <span className="card-context">
              <img loading="lazy" src={proj.logo} alt="" width={43} height={16}
                style={{ height: '16px', width: 'auto', verticalAlign: 'middle', marginRight: '6px' }} />
            </span>
          ) : proj.context ? (
            <span className="card-context">{proj.context}</span>
          ) : null}
        </div>

        <p className="desc">{proj.desc}</p>

        <div className="features">
          <ul>
            {proj.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>

        {/* Stack Completo expandible */}
        <div className="tech-section" style={{ display: open ? 'block' : 'none' }}>
          {proj.techGroups.map((group, i) => (
            <div key={i} className="tech-group">
              <div className="tech-group-label">{group.label}</div>
              <div className="tech-tags">
                {group.tags.map((tag, j) => (
                  <span key={j} className={`tag ${tag.cls}`}>{tag.text}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className={`btn-detalles${open ? ' active' : ''}`} onClick={() => setOpen(!open)}>
          <StackIcon />
          <span>{open ? t('hide_details') : t('tech_details')}</span>
        </button>

        {proj.github && (
          <div className="card-footer">
            <a href={proj.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon />
              <span>{t('btn_code')}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const { t } = useI18n();
  const [filter, setFilter] = useState('all');
  const [showHidden, setShowHidden] = useState(false);

  const filters = [
    { id: 'all',          label: 'Todos' },
    { id: 'industria',    label: 'Industria' },
    { id: 'ia',           label: 'IA / Machine Learning' },
    { id: 'fullstack',    label: 'Full Stack' },
    { id: 'investigacion', label: 'Investigación' },
  ];

  const mainProjects: Project[] = [
    {
      id: 'proyecto-pf',
      title: t('spm_title'),
      desc: t('spm_desc'),
      image: '/imagenes/spm/dashboard_principal.webp',
      categories: ['industria', 'fullstack'],
      badge: 'industrial', badgeLabel: t('badge_industrial'),
      logo: '/imagenes/logos/pf_alimentos.webp',
      impactTags: [{ text: 'React', cls: 'tag-frontend' }, { text: 'Node.js', cls: 'tag-backend' }, { text: 'Oracle EAM', cls: 'tag-db' }],
      features: [t('spm_f1'), t('spm_f2'), t('spm_f3'), t('spm_f4')],
      techGroups: [
        { label: 'Frontend', tags: [{ text: 'React', cls: 'tag-frontend' }, { text: 'TypeScript', cls: 'tag-frontend' }, { text: 'Vite', cls: 'tag-frontend' }, { text: 'Tailwind CSS', cls: 'tag-frontend' }] },
        { label: 'Backend', tags: [{ text: 'Node.js', cls: 'tag-backend' }, { text: 'Express', cls: 'tag-backend' }, { text: 'TypeScript', cls: 'tag-backend' }, { text: 'JWT', cls: 'tag-backend' }, { text: 'Helmet.js', cls: 'tag-backend' }] },
        { label: 'Base de datos / Infra', tags: [{ text: 'Oracle EAM', cls: 'tag-db' }, { text: 'Vitest', cls: 'tag-infra' }] },
      ],
      github: 'https://github.com/yankoacuna/Sistema-Planificacion-de-Mantenimiento',
    },
    {
      id: 'proyecto-svecg',
      title: t('svecg_title'),
      desc: t('svecg_desc'),
      image: '/imagenes/svecg/vista_prediccion_1.webp',
      categories: ['ia', 'investigacion', 'fullstack'],
      badge: 'research', badgeLabel: t('badge_research'),
      context: 'Titulación',
      impactTags: [{ text: 'React', cls: 'tag-frontend' }, { text: 'Flask', cls: 'tag-backend' }, { text: 'PostgreSQL', cls: 'tag-db' }],
      features: [t('svecg_f1'), t('svecg_f2'), t('svecg_f3'), t('svecg_f4')],
      techGroups: [
        { label: 'Frontend', tags: [{ text: 'React', cls: 'tag-frontend' }, { text: 'TypeScript', cls: 'tag-frontend' }, { text: 'Vite', cls: 'tag-frontend' }, { text: 'Tailwind CSS', cls: 'tag-frontend' }] },
        { label: 'Backend / IA', tags: [{ text: 'Flask', cls: 'tag-backend' }, { text: 'Python', cls: 'tag-backend' }, { text: 'PyTorch', cls: 'tag-backend' }, { text: 'WFDB', cls: 'tag-backend' }, { text: 'Autoencoder GRU', cls: 'tag-ml' }, { text: 'SHAP', cls: 'tag-ml' }] },
        { label: 'Infraestructura', tags: [{ text: 'PostgreSQL', cls: 'tag-db' }, { text: 'Docker', cls: 'tag-infra' }, { text: 'HAPI FHIR (HL7)', cls: 'tag-infra' }, { text: 'Google Cloud', cls: 'tag-infra' }] },
      ],
      github: 'https://github.com/yankoacuna/Sistema-Visualizacion-ECG',
    },
    {
      id: 'proyecto-iansa',
      title: t('sgat_title'),
      desc: t('sgat_desc'),
      image: '/imagenes/sgat/dashboard.webp',
      categories: ['industria', 'fullstack'],
      badge: 'industrial', badgeLabel: t('badge_industrial'),
      logo: '/imagenes/logos/empresas_iansa.webp',
      impactTags: [{ text: 'Laravel', cls: 'tag-backend' }, { text: 'Livewire', cls: 'tag-frontend' }, { text: 'Linux', cls: 'tag-infra' }],
      features: [t('sgat_f1'), t('sgat_f2'), t('sgat_f3'), t('sgat_f4')],
      techGroups: [
        { label: 'Stack', tags: [{ text: 'Laravel', cls: 'tag-backend' }, { text: 'PHP', cls: 'tag-backend' }, { text: 'Livewire', cls: 'tag-frontend' }, { text: 'Tailwind CSS', cls: 'tag-frontend' }, { text: 'MySQL', cls: 'tag-db' }] },
        { label: 'Infraestructura', tags: [{ text: 'Nginx', cls: 'tag-infra' }, { text: 'Linux', cls: 'tag-infra' }] },
      ],
      github: 'https://github.com/yankoacuna/Sistema-Gestor-de-Activos',
    },
    {
      id: 'proyecto-outlier',
      title: t('outlier_proj_title'),
      desc: t('outlier_proj_desc'),
      image: '/imagenes/logos/outlier-icon.webp',
      categories: ['ia', 'industria'],
      badge: 'global', badgeLabel: 'Consultoría Internacional',
      logo: '/imagenes/logos/outlier.webp',
      impactTags: [{ text: 'RLHF', cls: 'tag-ml' }, { text: 'Python', cls: 'tag-ml' }, { text: 'LLM Eval', cls: 'tag-ml' }],
      features: [t('outlier_proj_f1'), t('outlier_proj_f2'), t('outlier_proj_f3')],
      techGroups: [
        { label: 'Tecnologías y Enfoque', tags: [{ text: 'RLHF', cls: 'tag-ml' }, { text: 'Python', cls: 'tag-ml' }, { text: 'Prompt Engineering', cls: 'tag-ml' }, { text: 'LLM Evaluation', cls: 'tag-ml' }] },
      ],
    },
    {
      id: 'proyecto-autoencoder',
      title: t('autoencoder_title'),
      desc: t('ae_desc'),
      image: '/imagenes/svecg/reconstruccion_autoencoder.webp',
      categories: ['ia', 'investigacion'],
      badge: 'research', badgeLabel: t('badge_research'),
      context: 'Titulación',
      impactTags: [{ text: 'PyTorch', cls: 'tag-ml' }, { text: 'Scikit-learn', cls: 'tag-ml' }, { text: 'WFDB', cls: 'tag-ml' }],
      features: [t('ae_f1'), t('ae_f2'), t('ae_f3'), t('ae_f4')],
      techGroups: [
        { label: 'Tecnologías', tags: [{ text: 'Python', cls: 'tag-ml' }, { text: 'PyTorch', cls: 'tag-ml' }, { text: 'Scikit-learn', cls: 'tag-ml' }, { text: 'Pandas & NumPy', cls: 'tag-ml' }, { text: 'WFDB', cls: 'tag-ml' }, { text: 'Matplotlib', cls: 'tag-ml' }, { text: 'Seaborn', cls: 'tag-ml' }, { text: 'Jupyter Notebook', cls: 'tag-other' }] },
      ],
      github: 'https://github.com/yankoacuna/Autoencoder-GRU-para-ECG',
    },
  ];

  const hiddenProjects: Project[] = [
    {
      id: 'proyecto-anomalias',
      title: t('anomalias_title'),
      desc: t('anom_desc'),
      image: '/imagenes/deteccion_anomalias/graficoPCA.webp',
      categories: ['ia', 'investigacion'],
      badge: 'research', badgeLabel: t('badge_research'),
      context: 'Ciencia de Datos',
      impactTags: [{ text: 'Python', cls: 'tag-ml' }, { text: 'DTW', cls: 'tag-ml' }, { text: 'Scikit-learn', cls: 'tag-ml' }],
      features: [t('anom_f1'), t('anom_f2'), t('anom_f3'), t('anom_f4')],
      techGroups: [
        { label: 'Tecnologías', tags: [{ text: 'Python', cls: 'tag-ml' }, { text: 'Scikit-learn', cls: 'tag-ml' }, { text: 'DTW (tslearn)', cls: 'tag-ml' }, { text: 'NumPy', cls: 'tag-ml' }, { text: 'Pandas', cls: 'tag-ml' }, { text: 'WFDB', cls: 'tag-ml' }, { text: 'Matplotlib', cls: 'tag-ml' }, { text: 'Jupyter Notebook', cls: 'tag-other' }] },
      ],
      github: 'https://github.com/yankoacuna/Deteccion-de-anomal-as-cardiacas',
    },
    {
      id: 'proyecto-tareas',
      title: t('tareas_title'),
      desc: t('tareas_desc'),
      image: '/imagenes/tareas/tareas.webp',
      categories: ['fullstack'],
      badge: 'academic', badgeLabel: t('badge_academic'),
      context: 'Prueba Técnica',
      impactTags: [{ text: 'NestJS', cls: 'tag-backend' }, { text: 'React', cls: 'tag-frontend' }, { text: 'PostgreSQL', cls: 'tag-db' }],
      features: [t('tareas_f1'), t('tareas_f2'), t('tareas_f3'), t('tareas_f4')],
      techGroups: [
        { label: 'Frontend', tags: [{ text: 'React', cls: 'tag-frontend' }, { text: 'TypeScript', cls: 'tag-frontend' }, { text: 'Vite', cls: 'tag-frontend' }] },
        { label: 'Backend / Base de datos', tags: [{ text: 'NestJS', cls: 'tag-backend' }, { text: 'TypeScript', cls: 'tag-backend' }, { text: 'TypeORM', cls: 'tag-backend' }, { text: 'JWT', cls: 'tag-backend' }, { text: 'PostgreSQL', cls: 'tag-db' }] },
      ],
      github: 'https://github.com/yankoacuna/Prueba-Tecnica-ISOLOGIC',
    },
    {
      id: 'proyecto-gps',
      title: t('gps_title'),
      desc: t('gps_desc'),
      image: '/imagenes/gps/mapa_ubicaciones.webp',
      categories: ['fullstack'],
      badge: 'academic', badgeLabel: t('badge_academic'),
      context: t('gps_role'),
      impactTags: [{ text: 'Node.js', cls: 'tag-backend' }, { text: 'React', cls: 'tag-frontend' }, { text: 'PostgreSQL', cls: 'tag-db' }],
      features: [t('gps_f1'), t('gps_f2'), t('gps_f3'), t('gps_f4')],
      techGroups: [
        { label: 'Frontend', tags: [{ text: 'React', cls: 'tag-frontend' }, { text: 'JavaScript', cls: 'tag-frontend' }, { text: 'Vite', cls: 'tag-frontend' }] },
        { label: 'Backend / Infra', tags: [{ text: 'Express', cls: 'tag-backend' }, { text: 'Node.js', cls: 'tag-backend' }, { text: 'Prisma ORM', cls: 'tag-backend' }, { text: 'PostgreSQL', cls: 'tag-db' }, { text: 'Servidor académico', cls: 'tag-infra' }] },
      ],
      github: 'https://github.com/yankoacuna/GPS-Pasivo-Papugrupo',
    },
    {
      id: 'proyecto-mercadito',
      title: t('mercadito_title'),
      desc: t('mercad_desc'),
      image: '/imagenes/mercadito/catalogo.webp',
      categories: ['fullstack'],
      badge: 'academic', badgeLabel: t('badge_academic'),
      context: 'Desarrollador Full Stack',
      impactTags: [{ text: 'Spring Boot', cls: 'tag-backend' }, { text: 'Angular', cls: 'tag-frontend' }, { text: 'Microservicios', cls: 'tag-infra' }],
      features: [t('mercad_f1'), t('mercad_f2'), t('mercad_f3'), t('mercad_f4')],
      techGroups: [
        { label: 'Frontend / Mobile', tags: [{ text: 'Angular', cls: 'tag-frontend' }, { text: 'TypeScript', cls: 'tag-frontend' }, { text: 'Android (Java)', cls: 'tag-frontend' }] },
        { label: 'Backend / Infra', tags: [{ text: 'Spring Boot', cls: 'tag-backend' }, { text: 'Java', cls: 'tag-backend' }, { text: 'Gradle', cls: 'tag-backend' }, { text: 'MySQL', cls: 'tag-db' }, { text: 'Microservicios', cls: 'tag-infra' }, { text: 'REST API', cls: 'tag-infra' }] },
      ],
      github: 'https://github.com/yankoacuna/Proyecto3Dise-o',
    },
    {
      id: 'proyecto-monopolio',
      title: t('monopolio_title'),
      desc: t('monop_desc'),
      image: '/imagenes/monopolio/tablero.webp',
      categories: ['fullstack'],
      badge: 'academic', badgeLabel: t('badge_academic'),
      context: t('monopolio_role'),
      impactTags: [{ text: 'Node.js', cls: 'tag-backend' }, { text: 'Vue.js', cls: 'tag-frontend' }, { text: 'MongoDB', cls: 'tag-db' }],
      features: [t('monop_f1'), t('monop_f2'), t('monop_f3'), t('monop_f4')],
      techGroups: [
        { label: 'Frontend', tags: [{ text: 'Vue.js', cls: 'tag-frontend' }, { text: 'JavaScript', cls: 'tag-frontend' }] },
        { label: 'Backend', tags: [{ text: 'Node.js', cls: 'tag-backend' }, { text: 'Express', cls: 'tag-backend' }, { text: 'Socket.io', cls: 'tag-backend' }] },
        { label: 'Data', tags: [{ text: 'MongoDB', cls: 'tag-db' }] },
      ],
    },
    {
      id: 'proyecto-horarios',
      title: t('horarios_title'),
      desc: t('horarios_desc'),
      image: '/imagenes/horarios/horarios.webp',
      categories: ['fullstack'],
      badge: 'academic', badgeLabel: t('badge_academic'),
      context: t('horarios_role'),
      impactTags: [{ text: 'Docker', cls: 'tag-infra' }, { text: 'Laravel', cls: 'tag-backend' }, { text: 'MySQL', cls: 'tag-db' }],
      features: [t('horarios_f1'), t('horarios_f2'), t('horarios_f3'), t('horarios_f4')],
      techGroups: [
        { label: 'Stack', tags: [{ text: 'Laravel', cls: 'tag-backend' }, { text: 'PHP', cls: 'tag-backend' }, { text: 'Blade', cls: 'tag-frontend' }, { text: 'MySQL', cls: 'tag-db' }, { text: 'Docker Compose', cls: 'tag-infra' }] },
      ],
    },
    {
      id: 'proyecto-tablero',
      title: t('tablero_title'),
      desc: t('tabl_desc'),
      image: '/imagenes/tablero/tablero.webp',
      categories: ['fullstack'],
      badge: 'academic', badgeLabel: t('badge_academic'),
      context: t('tablero_role'),
      impactTags: [{ text: 'Node.js', cls: 'tag-backend' }, { text: 'React', cls: 'tag-frontend' }, { text: 'Arduino', cls: 'tag-infra' }],
      features: [t('tabl_f1'), t('tabl_f2'), t('tabl_f3'), t('tabl_f4')],
      techGroups: [
        { label: 'Stack', tags: [{ text: 'React', cls: 'tag-frontend' }, { text: 'Node.js', cls: 'tag-backend' }, { text: 'Express', cls: 'tag-backend' }, { text: 'Prisma ORM', cls: 'tag-backend' }, { text: 'PostgreSQL', cls: 'tag-db' }, { text: 'Serial Port', cls: 'tag-infra' }, { text: 'Arduino', cls: 'tag-infra' }] },
      ],
    },
  ];

  const filterProject = (p: Project) =>
    filter === 'all' || p.categories.includes(filter);

  const visibleMain = mainProjects.filter(filterProject);
  const visibleHidden = hiddenProjects.filter(filterProject);
  const isFiltered = filter !== 'all';

  return (
    <section id="proyectos">
      {/* SVG Sprite */}
      <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <symbol id="icon-github" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </symbol>
      </svg>

      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('projTitle') }} />
      <p className="section-subtitle">{t('projSub')}</p>

      {/* Filters */}
      <div className="project-filters">
        {filters.map((f) => (
          <button
            key={f.id}
            className={`filter-btn${filter === f.id ? ' active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main projects */}
      <div className="project-grid projects-main-container" id="projects-grid">
        {visibleMain.map((proj) => (
          <ProjectCard key={proj.id} proj={proj} t={t} />
        ))}
      </div>

      {/* Hidden projects wrapper */}
      {(visibleHidden.length > 0) && (
        <>
          <div className={`hidden-projects project-grid${showHidden || isFiltered ? ' show' : ''}`}>
            {visibleHidden.map((proj) => (
              <ProjectCard key={proj.id} proj={proj} t={t} />
            ))}
          </div>

          {!isFiltered && (
            <div className="load-more-container">
              <button
                className="btn-load-more"
                onClick={() => setShowHidden(!showHidden)}
              >
                {showHidden ? `${t('hide_projects')} ▴` : `${t('load_more')} ▾`}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
