import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { CoursePage } from './CoursePage';
import type { Course } from '@/types/video.d';

vi.mock('wouter-preact', () => ({
  Link: ({ children, href, class: className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ['/', vi.fn()],
}));

const mockUseCoursePage = vi.hoisted(() => vi.fn());
const mockUseAddToCourse = vi.hoisted(() => vi.fn());

vi.mock('@/hooks/useCoursePage', () => ({
  useCoursePage: mockUseCoursePage,
}));

vi.mock('@/hooks/useAddToCourse', () => ({
  useAddToCourse: mockUseAddToCourse,
}));

const mockCourse: Course = {
  id: 1,
  type: 'youtube',
  title: 'Test Course',
  description: 'This is a test course',
  thumbnail: 'https://img.example.com/course.jpg',
  publishedAt: '2024-01-01T00:00:00Z',
  items: [
    {
      id: 'vid1',
      title: 'Video 1',
      description: 'First video',
      thumbnail: 'https://img.example.com/vid1.jpg',
      channelTitle: 'Channel',
      publishedAt: '2024-01-01T00:00:00Z',
      completed: false,
      notes: '',
    },
    {
      id: 'vid2',
      title: 'Video 2',
      description: 'Second video',
      thumbnail: 'https://img.example.com/vid2.jpg',
      channelTitle: 'Channel',
      publishedAt: '2024-01-02T00:00:00Z',
      completed: true,
      notes: '',
    },
  ],
  progress: 50,
  notes: '',
};

const defaultCoursePage = {
  course: null as Course | null,
  handleToggle: vi.fn(),
  handleRemoveItem: vi.fn(),
  handleDelete: vi.fn(),
  handleSaveTitle: vi.fn(),
  handleSaveDescription: vi.fn(),
};

const defaultAddToCourse = {
  inputRef: { current: null },
  error: null as string | null,
  handleAddToCourse: vi.fn(),
};

beforeEach(() => {
  mockUseCoursePage.mockReturnValue({ ...defaultCoursePage });
  mockUseAddToCourse.mockReturnValue({ ...defaultAddToCourse });
});

describe('CoursePage', () => {
  test('shows loading state when no course', () => {
    render(<CoursePage />);
    expect(screen.getByText('Cargando curso…')).toBeDefined();
  });

  test('renders course header with title, description, progress', () => {
    mockUseCoursePage.mockReturnValue({
      ...defaultCoursePage,
      course: mockCourse,
    });

    render(<CoursePage />);

    expect(screen.getByText('Test Course')).toBeDefined();
    expect(screen.getByText('50%')).toBeDefined();
  });

  test('shows import input section', () => {
    mockUseCoursePage.mockReturnValue({
      ...defaultCoursePage,
      course: mockCourse,
    });

    render(<CoursePage />);

    expect(screen.getByLabelText('URL de YouTube para agregar al curso')).toBeDefined();
    expect(screen.getByText('AGREGAR AL CURSO')).toBeDefined();
  });

  test('shows empty state when no items', () => {
    mockUseCoursePage.mockReturnValue({
      ...defaultCoursePage,
      course: { ...mockCourse, items: [] },
    });

    render(<CoursePage />);

    expect(
      screen.getByText(
        'Aún no hay videos. Agrega contenido pegando un enlace de YouTube en el campo de arriba.',
      ),
    ).toBeDefined();
  });

  test('renders item grid with VideoItemCard for each item', () => {
    mockUseCoursePage.mockReturnValue({
      ...defaultCoursePage,
      course: mockCourse,
    });

    render(<CoursePage />);

    expect(screen.getByText('Video 1')).toBeDefined();
    expect(screen.getByText('Video 2')).toBeDefined();
  });

  test('calls handleDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    mockUseCoursePage.mockReturnValue({
      ...defaultCoursePage,
      course: mockCourse,
      handleDelete,
    });

    render(<CoursePage />);

    await user.click(screen.getByText('ELIMINAR CURSO'));
    expect(handleDelete).toHaveBeenCalledOnce();
  });
});
