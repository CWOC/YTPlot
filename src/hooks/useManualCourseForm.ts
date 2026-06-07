import { useState } from 'preact/hooks';
import { useCourseStore } from '@/stores/courseStore';

export function useManualCourseForm() {
  const [formError, setFormError] = useState('');
  const addCourse = useCourseStore((s) => s.addCourse);

  async function handleSubmit(e: Event): Promise<boolean> {
    e.preventDefault();
    setFormError('');

    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const title = (data.get('title') as string)?.trim() ?? '';
    const description = (data.get('description') as string)?.trim() ?? '';

    if (!title) {
      setFormError('El título del curso es obligatorio.');
      return false;
    }

    await addCourse({
      type: 'manual',
      title,
      description,
      thumbnail: null,
      publishedAt: new Date().toISOString(),
      items: [],
      progress: 0,
      notes: '',
    });

    form.reset();
    return true;
  }

  return {
    formError,
    handleSubmit,
  };
}
