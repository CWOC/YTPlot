import { useYoutubeInput } from '@/hooks/useYoutubeInput';
import styles from './YoutubeUrlInput.module.css';

export function YoutubeUrlInput() {
  const { inputRef, error, handleCreateCourseInput } = useYoutubeInput();

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <input
          id="yt-url-input"
          ref={inputRef}
          type="url"
          className={styles.input}
          placeholder="PEGA EL ENLACE DE YOUTUBE AQUÍ..."
          aria-label="URL de YouTube"
        />
        <button
          id="yt-inject-btn"
          className={styles.btn}
          onClick={handleCreateCourseInput}
        >
          INYECTAR CONTENIDO
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
