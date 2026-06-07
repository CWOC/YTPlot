import { YoutubeUrlInput } from '@/components/YoutubeUrlInput/YoutubeUrlInput';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.glowOrb} aria-hidden="true" />

      <div className={styles.content}>
        <h1 className={styles.title}>
          YTPlot: TRASCIENDE
          <br />
          TU APRENDIZAJE
        </h1>

        <p className={styles.subtitle}>
          El rastreador de cursos retro-futurista diseñado para centralizar tus playlists de YouTube
          <br />y contenido manual en una experiencia de aprendizaje inmersiva.
        </p>

        <div className={styles.inputBlock}>
          <YoutubeUrlInput />
        </div>
      </div>
    </section>
  );
}
