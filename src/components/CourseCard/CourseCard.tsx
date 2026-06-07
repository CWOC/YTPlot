import { Link } from 'wouter-preact';
import styles from './CourseCard.module.css';

export type CourseSource = 'youtube' | 'manual';

export interface CourseCardProps {
  id: number;
  title: string;
  thumbnail: string | null;
  source: CourseSource;
  progress: number;
}

export function CourseCard({ id, title, thumbnail, source, progress }: CourseCardProps) {
  return (
    <article class={styles.card}>
      <div
        class={`${styles.thumbnail} ${!thumbnail ? styles.placeholder : ''}`}
        style={thumbnail ? `background-image: url(${thumbnail})` : undefined}
      >
        <span class={`${styles.badge} ${styles[source]}`}>{source.toUpperCase()}</span>
        <div class={styles.thumbnailOverlay} />
      </div>

      <div class={styles.body}>
        <h3 class={styles.title}>{title}</h3>

        <div class={styles.progressHeader}>
          <span class={styles.progressLabel}>PROGRESO</span>
          <span class={styles.progressValue}>{progress}%</span>
        </div>
        <div
          class={styles.progressTrack}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div class={styles.progressFill} style={`width: ${progress}%`} />
        </div>

        <Link
          href={`/dashboard/course/${id}`}
          class={styles.resumeBtn}
          id={`resume-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
          ► RESUME
        </Link>
      </div>
    </article>
  );
}
