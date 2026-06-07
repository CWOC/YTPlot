import { useState, useEffect } from 'preact/hooks';
import { useCourseStore } from '@/stores/courseStore';
import { YoutubeUrlInput } from '@/components/YoutubeUrlInput/YoutubeUrlInput';
import { ManualCourseModal } from '@/components/ManualCourseModal/ManualCourseModal';
import { CourseCarousel } from '@/components/CourseCarousel/CourseCarousel';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const courses = useCourseStore((s) => s.allCourses);
  const isLoading = useCourseStore((s) => s.isLoading);
  const loadAllCourses = useCourseStore((s) => s.loadAllCourses);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadAllCourses();
  }, [loadAllCourses]);

  const totalVideos = courses.reduce((acc, c) => acc + c.items.length, 0);
  const avgProgress = courses.length
    ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
    : 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header>
          <h1 className={styles.pageTitle}>PANEL DE CONTROL</h1>
          <p className={styles.pageSubtitle}>
            Gestiona tus cursos, crea contenido manual y monitoriza tu progreso.
          </p>
        </header>

        <section className={styles.importSection}>
          <YoutubeUrlInput />
          <button className={styles.manualBtn} onClick={() => setModalOpen(true)}>
            + CURSO MANUAL
          </button>
        </section>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{courses.length}</span>
            <span className={styles.statLabel}>Cursos Totales</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{totalVideos}</span>
            <span className={styles.statLabel}>Videos Totales</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{avgProgress}%</span>
            <span className={styles.statLabel}>Progreso Promedio</span>
          </div>
        </section>

        <CourseCarousel courses={courses} isLoading={isLoading} />
      </div>

      <ManualCourseModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
