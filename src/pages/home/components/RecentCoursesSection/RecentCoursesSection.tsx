import { useEffect } from 'preact/hooks';
import { Link } from 'wouter-preact';
import { useCourseStore } from '@/stores/courseStore';
import { CourseCard } from '@/components/CourseCard/CourseCard';
import type { Course } from '@/types/video.d';
import styles from './RecentCoursesSection.module.css';

function SkeletonCard() {
  return (
    <div class={styles.skeletonCard} aria-hidden="true">
      <div class={styles.skeletonThumb} />
      <div class={styles.skeletonBody}>
        <div class={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
        <div class={styles.skeletonLine} />
        <div class={styles.skeletonProgress} />
        <div class={styles.skeletonBtn} />
      </div>
    </div>
  );
}

export function RecentCoursesSection() {
  const courses = useCourseStore((s) => s.recentCourses);
  const isLoading = useCourseStore((s) => s.isLoading);
  const loadRecentCourses = useCourseStore((s) => s.loadRecentCourses);

  useEffect(() => {
    loadRecentCourses();
  }, [loadRecentCourses]);

  if (isLoading) {
    return (
      <section className={styles.section} id="recent-courses">
        <h2 className="section-title">NODOS DE APRENDIZAJE RECIENTES</h2>

        <div className={styles.grid}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="recent-courses">
      <h2 className="section-title">NODOS DE APRENDIZAJE RECIENTES</h2>

      <div className={styles.grid}>
        {courses.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={`material-symbols-outlined ${styles.emptyIcon}`}>library_books</span>
            <h3 className={styles.emptyTitle}>No hay cursos todavía</h3>
            <p className={styles.emptyText}>
              Ingresa una URL de YouTube en el campo de arriba para empezar a construir tu
              repositorio de aprendizaje offline.
            </p>
          </div>
        ) : (
          courses.map((course: Course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              thumbnail={course.thumbnail}
              source={course.type}
              progress={course.progress}
            />
          ))
        )}
      </div>

      <div className={styles.footer}>
        <Link href="/dashboard" id="view-all-courses-btn" className={styles.viewAllBtn}>
          VER TODO EL REPOSITORIO
        </Link>
      </div>
    </section>
  );
}
