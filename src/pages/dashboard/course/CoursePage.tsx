import { Link } from 'wouter-preact';
import { useCoursePage } from '@/hooks/useCoursePage';
import { useAddToCourse } from '@/hooks/useAddToCourse';
import { InlineEdit } from '@/components/InlineEdit/InlineEdit';
import { VideoItemCard } from '@/components/VideoItemCard/VideoItemCard';
import styles from './CoursePage.module.css';

export function CoursePage() {
  const {
    course,
    handleToggle,
    handleRemoveItem,
    handleDelete,
    handleSaveTitle,
    handleSaveDescription,
  } = useCoursePage();

  if (!course) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.loading}>Cargando curso…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/dashboard" className={styles.backLink}>
          <span className="material-symbols-outlined">arrow_back</span>
          Volver al panel
        </Link>

        <header className={styles.header}>
          <div
            className={`${styles.thumbnail} ${!course.thumbnail ? styles.placeholder : ''}`}
            style={course.thumbnail ? `background-image: url(${course.thumbnail})` : undefined}
          />

          <div className={styles.headerInfo}>
            <InlineEdit value={course.title} onSave={handleSaveTitle} className={styles.title} />

            <InlineEdit
              value={course.description}
              onSave={handleSaveDescription}
              as="textarea"
              className={styles.description}
              placeholder="Añadir una descripción…"
            />
          </div>

          <div className={styles.progressSection}>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuenow={course.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className={styles.progressFill} style={`width: ${course.progress}%`} />
            </div>
            <span className={styles.progressValue}>{course.progress}%</span>
          </div>

          <button className={styles.deleteBtn} onClick={handleDelete}>
            <span className="material-symbols-outlined">delete</span>
            ELIMINAR CURSO
          </button>
        </header>

        <section className={styles.importSection}>
          <CourseImportInput courseId={course.id} />
        </section>

        {course.items.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={`${styles.emptyIcon} material-symbols-outlined`}>video_library</span>
            <p className={styles.emptyText}>
              Aún no hay videos. Agrega contenido pegando un enlace de YouTube en el campo de arriba.
            </p>
          </div>
        ) : (
          <div className={styles.itemsGrid}>
            {course.items.map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/course/${course.id}/item/${item.id}`}
                className={styles.itemLink}
              >
                <VideoItemCard
                  item={item}
                  onToggle={() => handleToggle(item.id)}
                  onDelete={() => handleRemoveItem(item.id)}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseImportInput({ courseId }: { courseId: number }) {
  const { inputRef, error, handleAddToCourse } = useAddToCourse(courseId);

  return (
    <>
      <div className={styles.importRow}>
        <input
          ref={inputRef}
          type="url"
          className={styles.importInput}
          placeholder="PEGA EL ENLACE DE YOUTUBE AQUÍ..."
          aria-label="URL de YouTube para agregar al curso"
        />
        <button className={styles.importBtn} onClick={handleAddToCourse}>
          AGREGAR AL CURSO
        </button>
      </div>
      {error && <p className={styles.importError}>{error}</p>}
    </>
  );
}
