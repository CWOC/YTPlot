import { useRef, useState, useEffect } from 'preact/hooks';
import type { Course } from '@/types/video.d';
import { CourseCard } from '@/components/CourseCard/CourseCard';
import styles from './CourseCarousel.module.css';

interface CourseCarouselProps {
  courses: Course[];
  isLoading: boolean;
}

export function CourseCarousel({ courses, isLoading }: CourseCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const container = trackRef.current.parentElement;
      if (!container) return;

      const firstCard = trackRef.current.children[0] as HTMLElement | undefined;
      if (!firstCard) {
        setVisibleCount(1);
        setCardWidth(0);
        return;
      }

      const cw = firstCard.offsetWidth;
      const containerWidth = container.clientWidth;
      const gap = 20;
      const count = Math.max(1, Math.floor((containerWidth + gap) / (cw + gap)));

      setCardWidth(cw);
      setVisibleCount(count);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [courses.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [courses.length]);

  const maxIndex = Math.max(0, courses.length - visibleCount);
  const step = cardWidth + 20;

  function handlePrev() {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }

  function handleNext() {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }

  if (isLoading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.heading}>TODOS LOS CURSOS</h2>
        <div className={styles.skeletonTrack}>
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.heading}>TODOS LOS CURSOS</h2>
        <div className={styles.emptyState}>
          <span class={`material-symbols-outlined ${styles.emptyIcon}`}>library_books</span>
          <h3 className={styles.emptyTitle}>Aún no hay cursos</h3>
          <p className={styles.emptyText}>
            Crea tu primer curso manualmente o importa una playlist de YouTube desde la página
            principal.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>TODOS LOS CURSOS</h2>
        <div className={styles.controls}>
          <button
            className={styles.navBtn}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Anterior"
          >
            ◀
          </button>
          <button
            className={styles.navBtn}
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Siguiente"
          >
            ▶
          </button>
        </div>
      </div>

      <div className={styles.viewport}>
        <div
          ref={trackRef}
          className={styles.track}
          style={{ transform: `translateX(-${currentIndex * step}px)` }}
        >
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              thumbnail={course.thumbnail}
              source={course.type}
              progress={course.progress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
