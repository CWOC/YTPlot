import styles from './WhySection.module.css';

interface Feature {
  icon: string;
  iconColor: 'cyan' | 'magenta';
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: 'sync_alt',
    iconColor: 'cyan',
    title: 'Sincronización Total',
    description:
      'Combina flujos de trabajo manuales y playlists de YouTube de forma fluida y organizada.',
  },
  {
    icon: 'visibility_off',
    iconColor: 'magenta',
    title: 'Enfoque Profundo',
    description:
      'Interfaz optimizada en modo oscuro con acentos de neón para minimizar distracciones cognitivas.',
  },
  {
    icon: 'bar_chart',
    iconColor: 'cyan',
    title: 'Progreso Visual',
    description:
      'Seguimiento en tiempo real de tus horas de estudio y hitos alcanzados con estética técnica.',
  },
];

export function WhySection() {
  return (
    <section className={styles.section} id="why-ytplot">
      <h2 className="section-title">¿Por qué YTPlot?</h2>

      <div className={styles.grid}>
        {FEATURES.map((feature) => (
          <div className={styles.card} key={feature.title}>
            <span
              className={`material-symbols-outlined ${styles.icon} ${styles[feature.iconColor]}`}
            >
              {feature.icon}
            </span>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.cardDescription}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
