import { describe, test, expect, vi, beforeEach } from 'vitest';
import { createStore } from 'zustand/vanilla';
import type { Course, InsertCourse, Video } from '@/types/video.d';

const mockGetCourseById = vi.fn();
const mockGetAllCourses = vi.fn();
const mockGetRecentCourses = vi.fn();
const mockAddCourse = vi.fn();
const mockUpdateCourse = vi.fn();
const mockDeleteCourse = vi.fn();

vi.mock('@/services/IndexedDBService', () => ({
  IndexedDBService: {
    getCourseById: mockGetCourseById,
    getAllCourses: mockGetAllCourses,
    getRecentCourses: mockGetRecentCourses,
    addCourse: mockAddCourse,
    updateCourse: mockUpdateCourse,
    deleteCourse: mockDeleteCourse,
  },
}));

interface CourseStore {
  recentCourses: Course[];
  allCourses: Course[];
  courseById: Course | null;
  isLoading: boolean;
  fetchCourseById: (id: number) => Promise<void>;
  toggleItemComplete: (courseId: number, itemId: string) => Promise<void>;
  addItemsToCourse: (courseId: number, items: Video[]) => Promise<void>;
  updateItemNotes: (courseId: number, itemId: string, notes: string) => Promise<void>;
  removeItemFromCourse: (courseId: number, itemId: string) => Promise<void>;
  clearCourseById: () => void;
  addCourse: (course: InsertCourse) => Promise<void>;
  updateCourse: (id: number, data: Partial<InsertCourse>) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
}

const IndexedDBService = {
  getCourseById: mockGetCourseById,
  getAllCourses: mockGetAllCourses,
  getRecentCourses: mockGetRecentCourses,
  addCourse: mockAddCourse,
  updateCourse: mockUpdateCourse,
  deleteCourse: mockDeleteCourse,
};

function createTestStore() {
  return createStore<CourseStore>((set) => ({
    recentCourses: [],
    allCourses: [],
    courseById: null,
    isLoading: true,

    fetchCourseById: async (id: number) => {
      const course = await IndexedDBService.getCourseById(id);
      set({ courseById: course ?? null });
    },

    toggleItemComplete: async (courseId: number, itemId: string) => {
      const course = await IndexedDBService.getCourseById(courseId);
      if (!course) return;

      const updatedItems = course.items.map((item: Video) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item,
      );

      const completedCount = updatedItems.filter((i: Video) => i.completed).length;
      const progress = updatedItems.length
        ? Math.round((completedCount / updatedItems.length) * 100)
        : 0;

      const updatedCourse = { ...course, items: updatedItems, progress };

      await IndexedDBService.updateCourse(courseId, updatedCourse as InsertCourse);

      const [all, recent] = await Promise.all([
        IndexedDBService.getAllCourses(),
        IndexedDBService.getRecentCourses(3),
      ]);

      set({ courseById: updatedCourse, allCourses: all, recentCourses: recent });
    },

    addItemsToCourse: async (courseId: number, items: Video[]) => {
      const course = await IndexedDBService.getCourseById(courseId);
      if (!course) return;

      const existingIds = new Set(course.items.map((i: Video) => i.id));
      const newItems = items.filter((i: Video) => !existingIds.has(i.id));
      if (!newItems.length) return;

      const updatedCourse = { ...course, items: [...course.items, ...newItems] };

      await IndexedDBService.updateCourse(courseId, updatedCourse as InsertCourse);

      const [all, recent] = await Promise.all([
        IndexedDBService.getAllCourses(),
        IndexedDBService.getRecentCourses(3),
      ]);

      set({ courseById: updatedCourse, allCourses: all, recentCourses: recent });
    },

    updateItemNotes: async (courseId: number, itemId: string, notes: string) => {
      const course = await IndexedDBService.getCourseById(courseId);
      if (!course) return;

      const updatedItems = course.items.map((item: Video) =>
        item.id === itemId ? { ...item, notes } : item,
      );

      const updatedCourse = { ...course, items: updatedItems };

      await IndexedDBService.updateCourse(courseId, updatedCourse as InsertCourse);

      const [all, recent] = await Promise.all([
        IndexedDBService.getAllCourses(),
        IndexedDBService.getRecentCourses(3),
      ]);

      set({ courseById: updatedCourse, allCourses: all, recentCourses: recent });
    },

    removeItemFromCourse: async (courseId: number, itemId: string) => {
      const course = await IndexedDBService.getCourseById(courseId);
      if (!course) return;

      const updatedItems = course.items.filter((item: Video) => item.id !== itemId);
      const completedCount = updatedItems.filter((i: Video) => i.completed).length;
      const progress = updatedItems.length
        ? Math.round((completedCount / updatedItems.length) * 100)
        : 0;
      const updatedCourse = { ...course, items: updatedItems, progress };

      await IndexedDBService.updateCourse(courseId, updatedCourse as InsertCourse);

      const [all, recent] = await Promise.all([
        IndexedDBService.getAllCourses(),
        IndexedDBService.getRecentCourses(3),
      ]);

      set({ courseById: updatedCourse, allCourses: all, recentCourses: recent });
    },

    clearCourseById: () => {
      set({ courseById: null });
    },

    updateCourse: async (id: number, data: Partial<InsertCourse>) => {
      const course = await IndexedDBService.getCourseById(id);
      if (!course) return;

      const updated = { ...course, ...data };

      await IndexedDBService.updateCourse(id, updated);

      const [all, recent] = await Promise.all([
        IndexedDBService.getAllCourses(),
        IndexedDBService.getRecentCourses(3),
      ]);

      set({ courseById: updated, allCourses: all, recentCourses: recent });
    },

    deleteCourse: async (id: number) => {
      await IndexedDBService.deleteCourse(id);

      const [all, recent] = await Promise.all([
        IndexedDBService.getAllCourses(),
        IndexedDBService.getRecentCourses(3),
      ]);

      set({ courseById: null, allCourses: all, recentCourses: recent });
    },

    addCourse: async (course: InsertCourse) => {
      await IndexedDBService.addCourse(course);

      const [all, recent] = await Promise.all([
        IndexedDBService.getAllCourses(),
        IndexedDBService.getRecentCourses(3),
      ]);

      set({ allCourses: all, recentCourses: recent, isLoading: false });
    },
  }));
}

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
      notes: '',
    },
  ],
  progress: 50,
  notes: '',
};

const mockCourse2: Course = {
  id: 2,
  type: 'manual',
  title: 'Second Course',
  description: 'Another course',
  thumbnail: null,
  publishedAt: '2024-02-01T00:00:00Z',
  items: [],
  progress: 0,
  notes: '',
};

describe('courseStore', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = createTestStore();
  });

  test('fetchCourseById calls getCourseById and sets courseById', async () => {
    mockGetCourseById.mockResolvedValue(mockCourse);

    await store.getState().fetchCourseById(1);

    expect(mockGetCourseById).toHaveBeenCalledWith(1);
    expect(store.getState().courseById).toEqual(mockCourse);
  });

  test('fetchCourseById sets null when course not found', async () => {
    mockGetCourseById.mockResolvedValue(undefined);

    await store.getState().fetchCourseById(999);

    expect(store.getState().courseById).toBeNull();
  });

  test('toggleItemComplete toggles completed and recalculates progress', async () => {
    mockGetCourseById.mockResolvedValue(mockCourse);
    mockGetAllCourses.mockResolvedValue([mockCourse]);
    mockGetRecentCourses.mockResolvedValue([mockCourse]);

    await store.getState().toggleItemComplete(1, 'v1');

    const state = store.getState();
    expect(state.courseById!.items[0].completed).toBe(true);
    expect(state.courseById!.items[1].completed).toBe(true);
    expect(state.courseById!.progress).toBe(100);
  });

  test('toggleItemComplete untoggles completed item', async () => {
    mockGetCourseById.mockResolvedValue(mockCourse);
    mockGetAllCourses.mockResolvedValue([mockCourse]);
    mockGetRecentCourses.mockResolvedValue([mockCourse]);

    await store.getState().toggleItemComplete(1, 'v2');

    const state = store.getState();
    expect(state.courseById!.items[1].completed).toBe(false);
    expect(state.courseById!.progress).toBe(0);
  });

  test('toggleItemComplete does nothing when course not found', async () => {
    mockGetCourseById.mockResolvedValue(undefined);

    await store.getState().toggleItemComplete(999, 'v1');

    expect(mockUpdateCourse).not.toHaveBeenCalled();
  });

  test('addItemsToCourse appends new items and skips duplicates', async () => {
    const initialCourse = { ...mockCourse, items: [mockCourse.items[0]] };
    mockGetCourseById.mockResolvedValue(initialCourse);
    mockGetAllCourses.mockResolvedValue([initialCourse]);
    mockGetRecentCourses.mockResolvedValue([initialCourse]);

    const newItems: Video[] = [
      {
        id: 'v2',
        title: 'Video 2',
        description: 'Desc 2',
        thumbnail: '',
        channelTitle: 'Channel',
        publishedAt: '',
        completed: false,
        notes: '',
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
    ];

    await store.getState().addItemsToCourse(1, newItems);

    expect(mockUpdateCourse).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        items: [
          expect.objectContaining({ id: 'v1' }),
          expect.objectContaining({ id: 'v2' }),
          expect.objectContaining({ id: 'v3' }),
        ],
      }),
    );
  });

  test('addItemsToCourse does nothing when all items are duplicates', async () => {
    mockGetCourseById.mockResolvedValue(mockCourse);

    await store
      .getState()
      .addItemsToCourse(1, [
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
      ]);

    expect(mockUpdateCourse).not.toHaveBeenCalled();
  });

  test('addItemsToCourse does nothing when course not found', async () => {
    mockGetCourseById.mockResolvedValue(undefined);

    await store.getState().addItemsToCourse(999, []);

    expect(mockUpdateCourse).not.toHaveBeenCalled();
  });

  test('updateItemNotes sets notes on matching item', async () => {
    mockGetCourseById.mockResolvedValue(mockCourse);
    mockGetAllCourses.mockResolvedValue([mockCourse]);
    mockGetRecentCourses.mockResolvedValue([mockCourse]);

    await store.getState().updateItemNotes(1, 'v1', 'New notes');

    const state = store.getState();
    expect(state.courseById!.items[0].notes).toBe('New notes');
    expect(state.courseById!.items[1].notes).toBe('');
  });

  test('updateItemNotes does nothing when course not found', async () => {
    mockGetCourseById.mockResolvedValue(undefined);

    await store.getState().updateItemNotes(999, 'v1', 'notes');

    expect(mockUpdateCourse).not.toHaveBeenCalled();
  });

  test('removeItemFromCourse removes item and recalculates progress', async () => {
    mockGetCourseById.mockResolvedValue(mockCourse);
    mockGetAllCourses.mockResolvedValue([mockCourse]);
    mockGetRecentCourses.mockResolvedValue([mockCourse]);

    await store.getState().removeItemFromCourse(1, 'v1');

    const state = store.getState();
    expect(state.courseById!.items).toHaveLength(1);
    expect(state.courseById!.items[0].id).toBe('v2');
    expect(state.courseById!.progress).toBe(100);
  });

  test('removeItemFromCourse does nothing when course not found', async () => {
    mockGetCourseById.mockResolvedValue(undefined);

    await store.getState().removeItemFromCourse(999, 'v1');

    expect(mockUpdateCourse).not.toHaveBeenCalled();
  });

  test('updateCourse merges partial data', async () => {
    mockGetCourseById.mockResolvedValue(mockCourse);
    mockGetAllCourses.mockResolvedValue([mockCourse]);
    mockGetRecentCourses.mockResolvedValue([mockCourse]);

    await store.getState().updateCourse(1, { title: 'Updated Title', description: 'Updated Desc' });

    const state = store.getState();
    expect(state.courseById!.title).toBe('Updated Title');
    expect(state.courseById!.description).toBe('Updated Desc');
  });

  test('updateCourse does nothing when course not found', async () => {
    mockGetCourseById.mockResolvedValue(undefined);

    await store.getState().updateCourse(999, { title: 'Nope' });

    expect(mockUpdateCourse).not.toHaveBeenCalled();
  });

  test('deleteCourse sets courseById to null and refreshes lists', async () => {
    mockDeleteCourse.mockResolvedValue(undefined);
    mockGetAllCourses.mockResolvedValue([mockCourse2]);
    mockGetRecentCourses.mockResolvedValue([mockCourse2]);

    store.setState({
      courseById: mockCourse,
      allCourses: [mockCourse],
      recentCourses: [mockCourse],
    });

    await store.getState().deleteCourse(1);

    expect(store.getState().courseById).toBeNull();
    expect(store.getState().allCourses).toEqual([mockCourse2]);
    expect(store.getState().recentCourses).toEqual([mockCourse2]);
  });

  test('addCourse refreshes lists', async () => {
    const insertCourse: InsertCourse = {
      type: 'manual',
      title: 'New Course',
      description: 'New',
      thumbnail: null,
      publishedAt: '2024-03-01T00:00:00Z',
      items: [],
      progress: 0,
      notes: '',
    };
    mockAddCourse.mockResolvedValue(undefined);
    mockGetAllCourses.mockResolvedValue([mockCourse, mockCourse2]);
    mockGetRecentCourses.mockResolvedValue([mockCourse2]);

    await store.getState().addCourse(insertCourse);

    expect(store.getState().allCourses).toEqual([mockCourse, mockCourse2]);
    expect(store.getState().recentCourses).toEqual([mockCourse2]);
    expect(store.getState().isLoading).toBe(false);
  });

  test('clearCourseById sets courseById to null', () => {
    store.setState({ courseById: mockCourse });

    store.getState().clearCourseById();

    expect(store.getState().courseById).toBeNull();
  });
});
