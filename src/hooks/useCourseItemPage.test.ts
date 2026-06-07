import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/preact';
import { h } from 'preact';
import { useCourseItemPage } from './useCourseItemPage';
import type { Course } from '@/types/video.d';

const {
  mockFetchCourseById,
  mockToggleItemComplete,
  mockRemoveItemFromCourse,
  mockUpdateCourse,
  mockUpdateItemNotes,
  mockNavigate,
  mockUseParams,
  mockStoreState,
} = vi.hoisted(() => {
  const storeState: { courseById: Course | null } = { courseById: null };
  return {
    mockFetchCourseById: vi.fn(),
    mockToggleItemComplete: vi.fn(),
    mockRemoveItemFromCourse: vi.fn(),
    mockUpdateCourse: vi.fn(),
    mockUpdateItemNotes: vi.fn(),
    mockNavigate: vi.fn(),
    mockUseParams: vi.fn(() => ({ courseId: '1', itemId: 'v2' })),
    mockStoreState: storeState,
  };
});

vi.mock('@/stores/courseStore', () => ({
  useCourseStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      courseById: mockStoreState.courseById,
      fetchCourseById: mockFetchCourseById,
      toggleItemComplete: mockToggleItemComplete,
      removeItemFromCourse: mockRemoveItemFromCourse,
      updateCourse: mockUpdateCourse,
      updateItemNotes: mockUpdateItemNotes,
    }),
}));

vi.mock('wouter-preact', () => ({
  useParams: mockUseParams,
  useLocation: () => ['/', mockNavigate],
}));

const mockCourse: Course = {
  id: 1,
  type: 'youtube',
  title: 'Test Course',
  description: 'A test course',
  thumbnail: 'https://img.com/thumb.jpg',
  publishedAt: '2024-01-01T00:00:00Z',
  items: [
    {
      id: 'v1',
      title: 'Video 1',
      description: 'Desc 1',
      thumbnail: '',
      channelTitle: 'Channel',
      publishedAt: '',
      completed: false,
      notes: '',
    },
    {
      id: 'v2',
      title: 'Video 2',
      description: 'Desc 2',
      thumbnail: '',
      channelTitle: 'Channel',
      publishedAt: '',
      completed: true,
      notes: 'Note 2',
    },
    {
      id: 'v3',
      title: 'Video 3',
      description: 'Desc 3',
      thumbnail: '',
      channelTitle: 'Channel',
      publishedAt: '',
      completed: false,
      notes: '',
    },
  ],
  progress: 33,
  notes: '',
};

function setup() {
  const result: { current: ReturnType<typeof useCourseItemPage> } = {
    current: undefined as never,
  };
  function Harness() {
    result.current = useCourseItemPage();
    return null;
  }
  render(h(Harness, null));
  return result;
}

describe('useCourseItemPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn();
    mockStoreState.courseById = null;
    mockUseParams.mockImplementation(() => ({ courseId: '1', itemId: 'v2' }));
  });

  test('returns null course when not loaded', () => {
    const hook = setup();
    expect(hook.current.course).toBeNull();
  });

  test('returns null item when itemId not found', () => {
    mockStoreState.courseById = { ...mockCourse, items: [] };

    const hook = setup();

    expect(hook.current.course).toEqual({ ...mockCourse, items: [] });
    expect(hook.current.item).toBeNull();
  });

  test('returns correct item when found', () => {
    mockStoreState.courseById = mockCourse;

    const hook = setup();

    expect(hook.current.item).toBeTruthy();
    expect(hook.current.item!.id).toBe('v2');
    expect(hook.current.item!.title).toBe('Video 2');
    expect(hook.current.item!.notes).toBe('Note 2');
  });

  test('hasPrev/hasNext computed correctly for middle item', () => {
    mockStoreState.courseById = mockCourse;

    const hook = setup();

    expect(hook.current.currentIndex).toBe(1);
    expect(hook.current.hasPrev).toBe(true);
    expect(hook.current.hasNext).toBe(true);
  });

  test('hasPrev is false for first item', () => {
    mockStoreState.courseById = mockCourse;
    mockUseParams.mockReturnValue({ courseId: '1', itemId: 'v1' });

    const hook = setup();

    expect(hook.current.currentIndex).toBe(0);
    expect(hook.current.hasPrev).toBe(false);
    expect(hook.current.hasNext).toBe(true);
  });

  test('hasNext is false for last item', () => {
    mockStoreState.courseById = mockCourse;
    mockUseParams.mockReturnValue({ courseId: '1', itemId: 'v3' });

    const hook = setup();

    expect(hook.current.currentIndex).toBe(2);
    expect(hook.current.hasPrev).toBe(true);
    expect(hook.current.hasNext).toBe(false);
  });

  test('handleToggle calls toggleItemComplete', () => {
    mockStoreState.courseById = mockCourse;

    const hook = setup();
    hook.current.handleToggle();
    expect(mockToggleItemComplete).toHaveBeenCalledWith(1, 'v2');
  });

  test('handleSaveTitle updates the item via updateCourse', () => {
    mockStoreState.courseById = mockCourse;

    const hook = setup();
    hook.current.handleSaveTitle('New Title');

    expect(mockUpdateCourse).toHaveBeenCalledWith(1, {
      items: [
        expect.objectContaining({ id: 'v1', title: 'Video 1' }),
        expect.objectContaining({ id: 'v2', title: 'New Title' }),
        expect.objectContaining({ id: 'v3', title: 'Video 3' }),
      ],
    });
  });

  test('handleSaveTitle does nothing when course is null', () => {
    const hook = setup();
    hook.current.handleSaveTitle('New Title');
    expect(mockUpdateCourse).not.toHaveBeenCalled();
  });

  test('handleSaveDescription updates the item via updateCourse', () => {
    mockStoreState.courseById = mockCourse;

    const hook = setup();
    hook.current.handleSaveDescription('New Desc');

    expect(mockUpdateCourse).toHaveBeenCalledWith(1, {
      items: [
        expect.objectContaining({ id: 'v1' }),
        expect.objectContaining({ id: 'v2', description: 'New Desc' }),
        expect.objectContaining({ id: 'v3' }),
      ],
    });
  });

  test('handleSaveDescription does nothing when course is null', () => {
    const hook = setup();
    hook.current.handleSaveDescription('New Desc');
    expect(mockUpdateCourse).not.toHaveBeenCalled();
  });

  test('handleSaveNotes calls updateItemNotes', () => {
    mockStoreState.courseById = mockCourse;

    const hook = setup();
    hook.current.handleSaveNotes('Updated notes');
    expect(mockUpdateItemNotes).toHaveBeenCalledWith(1, 'v2', 'Updated notes');
  });

  test('handleRemoveItem calls removeItemFromCourse and navigates when confirmed', () => {
    vi.mocked(window.confirm).mockReturnValue(true);
    const hook = setup();
    hook.current.handleRemoveItem();
    expect(mockRemoveItemFromCourse).toHaveBeenCalledWith(1, 'v2');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/course/1');
  });

  test('handleRemoveItem does not call removeItemFromCourse when not confirmed', () => {
    vi.mocked(window.confirm).mockReturnValue(false);
    const hook = setup();
    hook.current.handleRemoveItem();
    expect(mockRemoveItemFromCourse).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
