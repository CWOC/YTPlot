import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/preact';
import { h } from 'preact';
import { useCoursePage } from './useCoursePage';

const {
  mockFetchCourseById,
  mockToggleItemComplete,
  mockRemoveItemFromCourse,
  mockUpdateCourse,
  mockDeleteCourse,
  mockClearCourseById,
  mockNavigate,
} = vi.hoisted(() => ({
  mockFetchCourseById: vi.fn(),
  mockToggleItemComplete: vi.fn(),
  mockRemoveItemFromCourse: vi.fn(),
  mockUpdateCourse: vi.fn(),
  mockDeleteCourse: vi.fn(),
  mockClearCourseById: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@/stores/courseStore', () => ({
  useCourseStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      courseById: null,
      fetchCourseById: mockFetchCourseById,
      toggleItemComplete: mockToggleItemComplete,
      removeItemFromCourse: mockRemoveItemFromCourse,
      updateCourse: mockUpdateCourse,
      deleteCourse: mockDeleteCourse,
      clearCourseById: mockClearCourseById,
    }),
}));

vi.mock('wouter-preact', () => ({
  useParams: () => ({ id: '1' }),
  useLocation: () => ['/', mockNavigate],
}));

function setup() {
  const result: { current: ReturnType<typeof useCoursePage> } = {
    current: undefined as never,
  };
  function Harness() {
    result.current = useCoursePage();
    return null;
  }
  render(h(Harness, null));
  return result;
}

describe('useCoursePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn();
  });

  test('returns null course initially', () => {
    const hook = setup();
    expect(hook.current.course).toBeNull();
  });

  test('exposes handleToggle', () => {
    const hook = setup();
    hook.current.handleToggle('v1');
    expect(mockToggleItemComplete).toHaveBeenCalledWith(1, 'v1');
  });

  test('handleRemoveItem calls removeItemFromCourse when confirmed', () => {
    vi.mocked(window.confirm).mockReturnValue(true);
    const hook = setup();
    hook.current.handleRemoveItem('v1');
    expect(mockRemoveItemFromCourse).toHaveBeenCalledWith(1, 'v1');
  });

  test('handleRemoveItem does not call removeItemFromCourse when not confirmed', () => {
    vi.mocked(window.confirm).mockReturnValue(false);
    const hook = setup();
    hook.current.handleRemoveItem('v1');
    expect(mockRemoveItemFromCourse).not.toHaveBeenCalled();
  });

  test('handleDelete calls deleteCourse and navigates when confirmed', () => {
    vi.mocked(window.confirm).mockReturnValue(true);
    const hook = setup();
    hook.current.handleDelete();
    expect(mockDeleteCourse).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('handleDelete does not call deleteCourse when not confirmed', () => {
    vi.mocked(window.confirm).mockReturnValue(false);
    const hook = setup();
    hook.current.handleDelete();
    expect(mockDeleteCourse).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('handleSaveTitle calls updateCourse with title', () => {
    const hook = setup();
    hook.current.handleSaveTitle('New Title');
    expect(mockUpdateCourse).toHaveBeenCalledWith(1, { title: 'New Title' });
  });

  test('handleSaveDescription calls updateCourse with description', () => {
    const hook = setup();
    hook.current.handleSaveDescription('New Description');
    expect(mockUpdateCourse).toHaveBeenCalledWith(1, { description: 'New Description' });
  });
});
