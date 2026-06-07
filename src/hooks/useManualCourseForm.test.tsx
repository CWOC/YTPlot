import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/preact';
import { useManualCourseForm } from './useManualCourseForm';
import type { CourseStore } from '@/stores/courseStore';

const mockAddCourse = vi.fn();

vi.mock('@/stores/courseStore', () => ({
  useCourseStore: (selector: (s: CourseStore) => unknown) =>
    selector({ addCourse: mockAddCourse } as unknown as CourseStore),
}));

function setup(initialValues?: { title?: string; description?: string }) {
  const result: {
    current: { formError: string; handleSubmit: (e: Event) => Promise<boolean> };
  } = { current: undefined as never };

  function Harness() {
    const { formError, handleSubmit } = useManualCourseForm();
    result.current = { formError, handleSubmit };

    async function onSubmit(e: Event) {
      e.preventDefault();
      await handleSubmit(e);
    }

    return (
      <form onSubmit={onSubmit}>
        <input name="title" defaultValue={initialValues?.title ?? ''} />
        <textarea name="description" defaultValue={initialValues?.description ?? ''} />
      </form>
    );
  }

  render(<Harness />);
  return result;
}

function getForm(): HTMLFormElement {
  return document.querySelector('form')!;
}

function setInputValue(name: string, value: string) {
  const input = document.querySelector(`[name="${name}"]`) as HTMLInputElement;
  input.value = value;
}

describe('useManualCourseForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('initial state has empty formError', () => {
    const form = setup();
    expect(form.current.formError).toBe('');
  });

  test('submit with empty title sets error', async () => {
    const form = setup();
    const event = new Event('submit', { cancelable: true, bubbles: true });
    Object.defineProperty(event, 'currentTarget', { value: getForm() });

    await act(async () => {
      await form.current.handleSubmit(event);
    });

    expect(form.current.formError).toBe('El título del curso es obligatorio.');
    expect(mockAddCourse).not.toHaveBeenCalled();
  });

  test('submit with empty title returns false', async () => {
    const form = setup();
    const event = new Event('submit', { cancelable: true, bubbles: true });
    Object.defineProperty(event, 'currentTarget', { value: getForm() });

    let result: boolean | undefined;
    await act(async () => {
      result = await form.current.handleSubmit(event);
    });

    expect(result).toBe(false);
  });

  test('submit with title calls addCourse and resets form', async () => {
    const form = setup({ title: 'My Course', description: 'Great content' });
    const event = new Event('submit', { cancelable: true, bubbles: true });
    Object.defineProperty(event, 'currentTarget', { value: getForm() });

    await act(async () => {
      await form.current.handleSubmit(event);
    });

    expect(mockAddCourse).toHaveBeenCalledTimes(1);
    expect(mockAddCourse).toHaveBeenCalledWith({
      type: 'manual',
      title: 'My Course',
      description: 'Great content',
      thumbnail: null,
      publishedAt: expect.any(String),
      items: [],
      progress: 0,
      notes: '',
    });

    expect(form.current.formError).toBe('');
  });

  test('submit with valid title returns true', async () => {
    const form = setup({ title: 'My Course' });
    const event = new Event('submit', { cancelable: true, bubbles: true });
    Object.defineProperty(event, 'currentTarget', { value: getForm() });

    let result: boolean | undefined;
    await act(async () => {
      result = await form.current.handleSubmit(event);
    });

    expect(result).toBe(true);
  });

  test('trim whitespace from title', async () => {
    const form = setup({ title: '   Spaced Title   ' });
    const event = new Event('submit', { cancelable: true, bubbles: true });
    Object.defineProperty(event, 'currentTarget', { value: getForm() });

    await act(async () => {
      await form.current.handleSubmit(event);
    });

    expect(mockAddCourse).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Spaced Title' }),
    );
  });

  test('whitespace-only title triggers validation error', async () => {
    const form = setup({ title: '   ' });
    const event = new Event('submit', { cancelable: true, bubbles: true });
    Object.defineProperty(event, 'currentTarget', { value: getForm() });

    await act(async () => {
      await form.current.handleSubmit(event);
    });

    expect(form.current.formError).toBe('El título del curso es obligatorio.');
    expect(mockAddCourse).not.toHaveBeenCalled();
  });
});
