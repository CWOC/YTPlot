import type { Video } from '@/types/video.d';
import styles from './VideoItemCard.module.css';

interface VideoItemCardProps {
  item: Video;
  onToggle: () => void;
  onDelete: () => void;
}

export function VideoItemCard({ item, onToggle, onDelete }: VideoItemCardProps) {
  return (
    <article className={`${styles.card} ${item.completed ? styles.completed : ''}`}>
      <button
        className={styles.deleteBtn}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Eliminar video"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      <div className={styles.thumbnail} style={`background-image: url(${item.thumbnail})`} />

      {item.completed && (
        <div className={styles.completedOverlay}>
          <span className={`${styles.checkIcon} material-symbols-outlined`}>check_circle</span>
        </div>
      )}

      <div className={styles.body}>
        <h3 className={styles.title}>{item.title}</h3>

        <button
          className={`${styles.toggleBtn} ${item.completed ? styles.completedBtn : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
        >
          {item.completed ? 'DESMARCAR' : 'COMPLETADO'}
        </button>
      </div>
    </article>
  );
}
