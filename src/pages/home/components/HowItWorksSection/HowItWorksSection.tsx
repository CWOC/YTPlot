interface Step {
  number: string;
  accentColor: 'magenta' | 'cyan' | 'violet';
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    accentColor: 'magenta',
    title: 'Paste Link',
    description:
      'Inyecta cualquier URL de playlist de YouTube o crea un nodo de contenido manual desde tu panel.',
  },
  {
    number: '02',
    accentColor: 'cyan',
    title: 'Auto-sync Content',
    description:
      'Nuestro motor cataloga los metadatos, duración y estructura del curso de forma automática e inmediata.',
  },
  {
    number: '03',
    accentColor: 'violet',
    title: 'Master your Knowledge',
    description:
      'Mide tu progreso real, toma notas en el limbo digital y alcanza el dominio total de tus habilidades.',
  },
];

import styles from './HowItWorksSection.module.css';

export function HowItWorksSection() {
  return (
    <section className={styles.section} id="how-it-works">
      <h2 className="section-title">FLUJO DE TRABAJO [HOW IT WORKS]</h2>

      <div className={styles.steps}>
        {STEPS.map((step) => (
          <div className={styles.step} key={step.number}>
            <div className={`${styles.circle} ${styles[step.accentColor]}`}>{step.number}</div>
            <h3 className={`${styles.stepTitle} ${styles[step.accentColor]}`}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
