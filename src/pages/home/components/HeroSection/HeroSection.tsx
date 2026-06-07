import { useYoutubeInput } from '@/hooks/useYoutubeInput';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const { inputRef, error, handleCreateCourseInput } = useYoutubeInput();

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
          <div className={styles.inputRow}>
            <input
              id="hero-url-input"
              ref={inputRef}
              type="url"
              className={styles.urlInput}
              placeholder="PEGA EL ENLACE DE YOUTUBE AQUÍ..."
              aria-label="URL de YouTube"
            />
            <button
              id="hero-inject-btn"
              className={styles.injectBtn}
              onClick={handleCreateCourseInput}
            >
              INYECTAR CONTENIDO
            </button>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </div>
    </section>
  );
}
