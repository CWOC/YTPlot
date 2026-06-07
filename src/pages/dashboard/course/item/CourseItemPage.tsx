import { Link } from 'wouter-preact';
import { useCourseItemPage } from '@/hooks/useCourseItemPage';
import { InlineEdit } from '@/components/InlineEdit/InlineEdit';
import styles from './CourseItemPage.module.css';

export function CourseItemPage() {
  const {
    course,
    item,
    hasPrev,
    hasNext,
    courseIdNum,
    handleToggle,
    handleRemoveItem,
    handleSaveTitle,
    handleSaveDescription,
    handleSaveNotes,
  } = useCourseItemPage();

  if (!course) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.loading}>Cargando…</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.error}>El video solicitado no se encontró en este curso.</p>
          <Link href={`/dashboard/course/${courseIdNum}`} className={styles.backLink}>
            <span class="material-symbols-outlined">arrow_back</span>
            Volver al curso
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href={`/dashboard/course/${courseIdNum}`} className={styles.backLink}>
          <span class="material-symbols-outlined">arrow_back</span>
          Volver al curso
        </Link>

        <article className={styles.card}>
          <div className={styles.playerWrapper}>
            <iframe
              class={styles.player}
              src={`https://www.youtube.com/embed/${item.id}`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className={styles.body}>
            <InlineEdit value={item.title} onSave={handleSaveTitle} className={styles.title} />

            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <span className={`${styles.metaIcon} material-symbols-outlined`}>person</span>
                {item.channelTitle}
              </span>
              <span className={styles.metaItem}>
                <span className={`${styles.metaIcon} material-symbols-outlined`}>schedule</span>
                {new Date(item.publishedAt).toLocaleDateString()}
              </span>
              <span className={styles.metaItem}>
                <span className={`${styles.metaIcon} material-symbols-outlined`}>
                  {item.completed ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                {item.completed ? 'Completado' : 'Pendiente'}
              </span>
            </div>

            <InlineEdit
              value={item.description}
              onSave={handleSaveDescription}
              as="textarea"
              className={styles.description}
              placeholder="Añadir una descripción…"
            />

            <div className={styles.notesSection}>
              <h3 className={styles.sectionTitle}>NOTAS</h3>
              <InlineEdit
                value={item.notes}
                onSave={handleSaveNotes}
                as="textarea"
                className={styles.notesInput}
                placeholder="Escribe tus notas sobre este video…"
              />
            </div>

            <div className={styles.navSection}>
              {hasPrev ? (
                <Link
                  href={`/dashboard/course/${courseIdNum}/item/${course.items[course.items.findIndex((i) => i.id === item.id) - 1].id}`}
                  className={styles.navBtn}
                >
                  <span class="material-symbols-outlined">navigate_before</span>
                  ANTERIOR
                </Link>
              ) : (
                <span />
              )}

              {hasNext ? (
                <Link
                  href={`/dashboard/course/${courseIdNum}/item/${course.items[course.items.findIndex((i) => i.id === item.id) + 1].id}`}
                  className={styles.navBtn}
                >
                  SIGUIENTE
                  <span class="material-symbols-outlined">navigate_next</span>
                </Link>
              ) : (
                <span />
              )}
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.toggleBtn} ${item.completed ? styles.completedBtn : ''}`}
                onClick={handleToggle}
              >
                {item.completed ? 'MARCAR COMO PENDIENTE' : 'MARCAR COMO COMPLETADO'}
              </button>
              <button className={styles.deleteBtn} onClick={handleRemoveItem}>
                <span className="material-symbols-outlined">delete</span>
                ELIMINAR
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
