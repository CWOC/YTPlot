import { useState, useRef, useCallback } from 'preact/hooks';
import styles from './InlineEdit.module.css';

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  as?: 'input' | 'textarea';
  className?: string;
  placeholder?: string;
}

export function InlineEdit({
  value,
  onSave,
  as = 'input',
  className,
  placeholder,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const startEditing = useCallback(() => {
    setDraft(value);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [value]);

  const cancel = useCallback(() => {
    setEditing(false);
    setDraft(value);
  }, [value]);

  const save = useCallback(() => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    }
    setEditing(false);
  }, [draft, value, onSave]);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      cancel();
      return;
    }
    if (as === 'input' && e.key === 'Enter') {
      e.preventDefault();
      save();
      return;
    }
    if (as === 'textarea' && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      save();
      return;
    }
  }

  if (editing) {
    const commonProps = {
      ref: inputRef as never,
      value: draft,
      onInput: (e: Event) => setDraft((e.target as HTMLInputElement).value),
      onKeyDown: handleKeyDown,
      onBlur: save,
      className: `${styles.input} ${className ?? ''}`,
      placeholder,
    };

    return as === 'textarea' ? <textarea {...commonProps} rows={3} /> : <input {...commonProps} />;
  }

  return (
    <span
      class={`${styles.display} ${className ?? ''}`}
      onClick={startEditing}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') startEditing();
      }}
    >
      {value || placeholder}
    </span>
  );
}
