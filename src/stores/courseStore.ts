import { create } from 'zustand';
import { IndexedDBService } from '@/services/IndexedDBService';
import type { Course, InsertCourse } from '@/types/video.d';

export interface CourseStore {
  recentCourses: Course[];
  allCourses: Course[];
  isLoading: boolean;
  loadRecentCourses: () => Promise<void>;
  loadAllCourses: () => Promise<void>;
  addCourse: (course: InsertCourse) => Promise<void>;
}

export const useCourseStore = create<CourseStore>((set) => ({
  recentCourses: [],
  allCourses: [],
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

  addCourse: async (course) => {
    await IndexedDBService.addCourse(course);

    const [all, recent] = await Promise.all([
      IndexedDBService.getAllCourses(),
      IndexedDBService.getRecentCourses(3),
    ]);

    set({ allCourses: all, recentCourses: recent, isLoading: false });
  },
}));
