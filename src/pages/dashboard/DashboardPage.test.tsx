import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { DashboardPage } from './DashboardPage';
import type { Course } from '@/types/video.d';
import type { CourseStore } from '@/stores/courseStore';

const mockLoadAllCourses = vi.fn();
const mockAddCourse = vi.fn();

const mockCourses: Course[] = [
  {
    id: 1,
    type: 'youtube',
    title: 'Intro to JS',
    description: 'JS basics',
    thumbnail: 'https://img.com/thumb.jpg',
    publishedAt: '2024-01-01T00:00:00Z',
    items: [{ id: 'v1', title: 'Video 1', description: '', thumbnail: 'https://img.com/thumb.jpg', channelTitle: '', publishedAt: '', completed: false }],
    progress: 50,
    notes: '',
  },
  {
    id: 2,
    type: 'manual',
    title: 'TypeScript',
    description: 'TS course',
      thumbnail: null,
    publishedAt: '2024-01-01T00:00:00Z',
    items: [
      { id: 'v2', title: 'Video 2', description: '', thumbnail: '', channelTitle: '', publishedAt: '', completed: false },
      { id: 'v3', title: 'Video 3', description: '', thumbnail: '', channelTitle: '', publishedAt: '', completed: false },
    ],
    progress: 25,
    notes: '',
  },
];

vi.mock('@/stores/courseStore', () => ({
  useCourseStore: (selector: (s: CourseStore) => unknown) =>
    selector({
      allCourses: mockCourses,
      isLoading: false,
      loadAllCourses: mockLoadAllCourses,
      addCourse: mockAddCourse,
      recentCourses: [],
      loadRecentCourses: vi.fn(),
    } as unknown as CourseStore),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders page title and description', () => {
    render(<DashboardPage />);
    expect(screen.getByText('PANEL DE CONTROL')).toBeDefined();
    expect(screen.getByText(/Gestiona tus cursos/)).toBeDefined();
  });

  test('loads courses on mount', () => {
    render(<DashboardPage />);
    expect(mockLoadAllCourses).toHaveBeenCalledTimes(1);
  });

  test('displays correct stats', () => {
    render(<DashboardPage />);
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('38%')).toBeDefined();
  });

  test('renders YouTube URL input', () => {
    render(<DashboardPage />);
    expect(screen.getByLabelText('URL de YouTube')).toBeDefined();
    expect(screen.getByText('INYECTAR CONTENIDO')).toBeDefined();
  });

  test('renders manual course button', () => {
    render(<DashboardPage />);
    expect(screen.getByText('+ CURSO MANUAL')).toBeDefined();
  });

  test('clicking manual button opens modal', () => {
    render(<DashboardPage />);
    const btn = screen.getByText('+ CURSO MANUAL');
    fireEvent.click(btn);
    expect(screen.getByText('CREAR CURSO MANUAL')).toBeDefined();
  });

  test('renders course carousel with courses heading', () => {
    render(<DashboardPage />);
    expect(screen.getByText('TODOS LOS CURSOS')).toBeDefined();
    expect(screen.getByText('Intro to JS')).toBeDefined();
    expect(screen.getByText('TypeScript')).toBeDefined();
  });
});
