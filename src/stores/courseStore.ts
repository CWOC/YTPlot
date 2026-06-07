import { create } from 'zustand';
import { IndexedDBService } from '@/services/IndexedDBService';
import type { Course, InsertCourse } from '@/types/video.d';

interface CourseStore {
  recentCourses: Course[];
  isLoading: boolean;
  loadRecentCourses: () => Promise<void>;
  addCourse: (course: InsertCourse) => Promise<void>;
}

export const useCourseStore = create<CourseStore>((set) => ({
  recentCourses: [],
  isLoading: true,

  loadRecentCourses: async () => {
    set({ isLoading: true });

    const courses = await IndexedDBService.getRecentCourses(3);

    set({ recentCourses: courses, isLoading: false });
  },

  addCourse: async (course) => {
    await IndexedDBService.addCourse(course);

    const courses = await IndexedDBService.getRecentCourses(3);

    set({ recentCourses: courses, isLoading: false });
  },
}));
