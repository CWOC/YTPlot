import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/preact';
import { h } from 'preact';
import { useYoutubeInput } from './useYoutubeInput';

const mockHandleCreateCourse = vi.fn();

vi.mock('./useYoutube', () => ({
  useYoutube: () => ({
    error: null,
    handleCreateCourse: mockHandleCreateCourse,
  }),
}));

function setup() {
  const result: { current: ReturnType<typeof useYoutubeInput> } = {
    current: undefined as never,
  };
  function Harness() {
    result.current = useYoutubeInput();
    return null;
  }
  render(h(Harness, null));
  return result;
}

describe('useYoutubeInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns inputRef, error, and handleCreateCourseInput', () => {
    const hook = setup();
    expect(hook.current.inputRef).toBeDefined();
    expect('current' in hook.current.inputRef).toBe(true);
    expect(hook.current.error).toBeNull();
    expect(typeof hook.current.handleCreateCourseInput).toBe('function');
  });

  test('handleCreateCourseInput reads from inputRef, calls handleCreateCourse, and clears input', async () => {
    const hook = setup();
    const input = document.createElement('input');
    input.value = 'https://youtu.be/dQw4w9WgXcQ';
    hook.current.inputRef.current = input;

    await hook.current.handleCreateCourseInput();

    expect(mockHandleCreateCourse).toHaveBeenCalledWith('https://youtu.be/dQw4w9WgXcQ');
    expect(hook.current.inputRef.current!.value).toBe('');
  });

  test('handleCreateCourseInput does nothing when inputRef.current is null', async () => {
    const hook = setup();
    hook.current.inputRef.current = null;

    await hook.current.handleCreateCourseInput();

    expect(mockHandleCreateCourse).not.toHaveBeenCalled();
  });
});
