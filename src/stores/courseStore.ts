import { create } from 'zustand';
import { IndexedDBService } from '@/services/IndexedDBService';
import type { Course, InsertCourse, Video } from '@/types/video.d';

export interface CourseStore {
  recentCourses: Course[];
  allCourses: Course[];
  courseById: Course | null;
  isLoading: boolean;
  loadRecentCourses: () => Promise<void>;
  loadAllCourses: () => Promise<void>;
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

export const useCourseStore = create<CourseStore>((set) => ({
  recentCourses: [],
  allCourses: [],
  courseById: null,
  isLoading: true,

  loadRecentCourses: async () => {
    set({ isLoading: true });

    const courses = await IndexedDBService.getRecentCourses(3);

    set({ recentCourses: courses, isLoading: false });
  },

  loadAllCourses: async () => {
    set({ isLoading: true });

    const courses = await IndexedDBService.getAllCourses();

    set({ allCourses: courses, isLoading: false });
  },

  fetchCourseById: async (id) => {
    const course = await IndexedDBService.getCourseById(id);

    set({ courseById: course ?? null });
  },

  toggleItemComplete: async (courseId, itemId) => {
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

  addItemsToCourse: async (courseId, items) => {
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

  updateItemNotes: async (courseId, itemId, notes) => {
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

  removeItemFromCourse: async (courseId, itemId) => {
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

  updateCourse: async (id, data) => {
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

  deleteCourse: async (id) => {
    await IndexedDBService.deleteCourse(id);

    const [all, recent] = await Promise.all([
      IndexedDBService.getAllCourses(),
      IndexedDBService.getRecentCourses(3),
    ]);

    set({ courseById: null, allCourses: all, recentCourses: recent });
  },

  addCourse: async (course) => {
    await IndexedDBService.addCourse(course);

    const [all, recent] = await Promise.all([
      IndexedDBService.getAllCourses(),
      IndexedDBService.getRecentCourses(3),
    ]);

    set({ allCourses: all, recentCourses: recent, isLoading: false });
  },
}));
