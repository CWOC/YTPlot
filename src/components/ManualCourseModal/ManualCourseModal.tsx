import { useRef, useEffect } from 'preact/hooks';
import { useManualCourseForm } from '@/hooks/useManualCourseForm';
import styles from './ManualCourseModal.module.css';

interface ManualCourseModalProps {
  open: boolean;
  onClose: () => void;
}

export function ManualCourseModal({ open, onClose }: ManualCourseModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { formError, handleSubmit } = useManualCourseForm();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  async function handleFormSubmit(e: Event) {
    const created = await handleSubmit(e);
    if (created) {
      onClose();
    }
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <h2 className={styles.heading}>CREAR CURSO MANUAL</h2>

        <input
          className={styles.input}
          type="text"
          name="title"
          placeholder="Título del curso..."
          aria-label="Título del curso"
        />

        <textarea
          className={styles.textarea}
          name="description"
          placeholder="Descripción del curso (opcional)..."
          aria-label="Descripción del curso"
        />

        {formError && <p className={styles.error}>{formError}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            CANCELAR
          </button>
          <button type="submit" className={styles.submitBtn}>
            CREAR CURSO
          </button>
        </div>
      </form>
    </dialog>
  );
}
