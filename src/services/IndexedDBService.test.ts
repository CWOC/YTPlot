import { describe, test, expect, vi, beforeEach } from 'vitest';
import { IndexedDBService } from './IndexedDBService';

const mockGetAll = vi.fn();
const mockGet = vi.fn();
const mockAdd = vi.fn();
const mockPut = vi.fn();
const mockDeleteFn = vi.fn();
const mockCount = vi.fn();

const mockStore = {
  getAll: mockGetAll,
  get: mockGet,
  add: mockAdd,
  put: mockPut,
  delete: mockDeleteFn,
  count: mockCount,
};

const mockTransaction = vi.fn(() => ({
  objectStore: vi.fn(() => mockStore),
}));

const mockDb = {
  transaction: mockTransaction,
  getAll: mockGetAll,
  get: mockGet,
  add: mockAdd,
  put: mockPut,
  delete: mockDeleteFn,
};

vi.mock('idb', () => ({
  openDB: vi.fn(() => mockDb),
}));

const mockCourse = {
  type: 'youtube',
  title: 'Test Course',
  description: 'A test course',
  thumbnail: 'https://img.com/thumb.jpg',
  publishedAt: '2024-01-01T00:00:00Z',
  items: [],
  progress: 0,
  notes: '',
};

describe('IndexedDBService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('IDBKeyRange', {
      bound: vi.fn((lower: number, upper: number) => ({ lower, upper })),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('getAllCourses returns all records', async () => {
    mockGetAll.mockResolvedValue([mockCourse]);

    const result = await IndexedDBService.getAllCourses();

    expect(result).toEqual([mockCourse]);
  });

  test('getAllCourses returns empty array when no records', async () => {
    mockGetAll.mockResolvedValue([]);

    const result = await IndexedDBService.getAllCourses();

    expect(result).toEqual([]);
  });

  test('getCourseById returns a record by id', async () => {
    mockGet.mockResolvedValue(mockCourse);

    const result = await IndexedDBService.getCourseById(1);

    expect(result).toEqual(mockCourse);
  });

  test('getCourseById returns undefined when not found', async () => {
    mockGet.mockResolvedValue(undefined);

    const result = await IndexedDBService.getCourseById(999);

    expect(result).toBeUndefined();
  });

  test('addCourse adds a record', async () => {
    mockAdd.mockResolvedValue(undefined);

    await IndexedDBService.addCourse(mockCourse);

    expect(mockAdd).toHaveBeenCalledWith('courses', mockCourse);
  });

  test('updateCourse puts a record', async () => {
    mockPut.mockResolvedValue(undefined);

    await IndexedDBService.updateCourse(1, mockCourse);

    expect(mockPut).toHaveBeenCalledWith('courses', mockCourse);
  });

  test('deleteCourse deletes a record', async () => {
    mockDeleteFn.mockResolvedValue(undefined);

    await IndexedDBService.deleteCourse(1);

    expect(mockDb.delete).toHaveBeenCalledWith('courses', 1);
  });

  test('getRecentCourses returns last N records using transaction', async () => {
    const courses = [
      { ...mockCourse, title: 'Course 1' },
      { ...mockCourse, title: 'Course 2' },
      { ...mockCourse, title: 'Course 3' },
    ];
    mockCount.mockResolvedValue(3);
    mockGetAll.mockResolvedValue(courses);

    const result = await IndexedDBService.getRecentCourses(3);

    expect(mockCount).toHaveBeenCalled();
    expect(mockTransaction).toHaveBeenCalledWith('courses', 'readonly');
    expect(result).toEqual(courses);
  });

  test('getRecentCourses returns empty array when no records exist', async () => {
    mockCount.mockResolvedValue(0);

    const result = await IndexedDBService.getRecentCourses(3);

    expect(result).toEqual([]);
    expect(mockGetAll).not.toHaveBeenCalled();
  });

  test('getRecentCourses uses default limit of 3', async () => {
    mockCount.mockResolvedValue(5);
    mockGetAll.mockResolvedValue([]);

    await IndexedDBService.getRecentCourses();

    expect(mockCount).toHaveBeenCalled();
  });
});
