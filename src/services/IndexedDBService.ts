import { openDB } from 'idb';
import type { InsertCourse } from '@/types/video.d';

export class IndexedDBService {
  private static dbName = 'YTPlotDB';
  private static dbVersion = 1;

  constructor() {}

  private static async initDB() {
    return openDB(IndexedDBService.dbName, IndexedDBService.dbVersion, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('courses')) {
          db.createObjectStore('courses', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }

  static async getAllCourses() {
    const db = await IndexedDBService.initDB();

    return await db.getAll('courses');
  }

  static async getRecentCourses(limit = 3) {
    const db = await IndexedDBService.initDB();
    const tx = db.transaction('courses', 'readonly');
    const store = tx.objectStore('courses');

    const total = await store.count();

    if (total === 0) return [];

    const range = IDBKeyRange.bound(total - (limit - 1), total);

    const courses = await store.getAll(range);

    return courses;
  }

  static async getCourseById(id: number) {
    const db = await IndexedDBService.initDB();

    return await db.get('courses', id);
  }

  static async addCourse(course: InsertCourse) {
    const db = await IndexedDBService.initDB();

    await db.add('courses', course);
  }

  static async updateCourse(_id: number, updatedCourse: InsertCourse) {
    const db = await IndexedDBService.initDB();

    await db.put('courses', updatedCourse);
  }

  static async deleteCourse(id: number) {
    const db = await IndexedDBService.initDB();

    await db.delete('courses', id);
  }
}
