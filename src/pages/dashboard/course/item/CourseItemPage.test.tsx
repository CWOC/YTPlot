import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { CourseItemPage } from './CourseItemPage';
import type { Course } from '@/types/video.d';

vi.mock('wouter-preact', () => ({
  Link: ({ children, href, class: className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ['/', vi.fn()],
}));

const mockUseCourseItemPage = vi.hoisted(() => vi.fn());

vi.mock('@/hooks/useCourseItemPage', () => ({
  useCourseItemPage: mockUseCourseItemPage,
}));

const mockCourse: Course = {
  id: 1,
  type: 'youtube',
  title: 'Test Course',
  description: 'Course description',
  thumbnail: 'https://img.example.com/course.jpg',
  publishedAt: '2024-01-01T00:00:00Z',
  items: [
    {
      id: 'item1',
      title: 'First Video',
      description: 'First video description',
      thumbnail: 'https://img.example.com/vid1.jpg',
      channelTitle: 'Channel Alpha',
      publishedAt: '2024-01-01T00:00:00Z',
      completed: false,
      notes: '',
    },
    {
      id: 'item2',
      title: 'Second Video',
      description: 'Second video description',
      thumbnail: 'https://img.example.com/vid2.jpg',
      channelTitle: 'Channel Beta',
      publishedAt: '2024-01-02T00:00:00Z',
      completed: true,
      notes: 'Some notes about this video',
    },
    {
      id: 'item3',
      title: 'Third Video',
      description: 'Third video description',
      thumbnail: 'https://img.example.com/vid3.jpg',
      channelTitle: 'Channel Gamma',
      publishedAt: '2024-01-03T00:00:00Z',
      completed: false,
      notes: '',
    },
  ],
  progress: 33,
  notes: '',
};

const defaultReturn = {
  course: null as Course | null,
  item: null as (typeof mockCourse.items)[0] | null,
  hasPrev: false,
  hasNext: false,
  courseIdNum: 1,
  handleToggle: vi.fn(),
  handleRemoveItem: vi.fn(),
  handleSaveTitle: vi.fn(),
  handleSaveDescription: vi.fn(),
  handleSaveNotes: vi.fn(),
};

beforeEach(() => {
  mockUseCourseItemPage.mockReturnValue({ ...defaultReturn });
});

describe('CourseItemPage', () => {
  test('shows loading state when no course', () => {
    render(<CourseItemPage />);
    expect(screen.getByText('Cargando…')).toBeDefined();
  });

  test('shows error when item not found', () => {
    mockUseCourseItemPage.mockReturnValue({
      ...defaultReturn,
      course: mockCourse,
      item: null,
      courseIdNum: 1,
    });

    render(<CourseItemPage />);
    expect(screen.getByText('El video solicitado no se encontró en este curso.')).toBeDefined();
  });

  test('renders iframe with correct YouTube embed URL', () => {
    const item = mockCourse.items[0];
    mockUseCourseItemPage.mockReturnValue({
      ...defaultReturn,
      course: mockCourse,
      item,
      courseIdNum: 1,
    });

    const { container } = render(<CourseItemPage />);
    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe).toBeDefined();
    expect(iframe.src).toContain('https://www.youtube.com/embed/item1');
  });

  test('renders editable title and description (InlineEdit)', () => {
    const item = mockCourse.items[0];
    mockUseCourseItemPage.mockReturnValue({
      ...defaultReturn,
      course: mockCourse,
      item,
      courseIdNum: 1,
    });

    render(<CourseItemPage />);
    expect(screen.getByText('First Video')).toBeDefined();
    expect(screen.getByText('First video description')).toBeDefined();
  });

  test('renders meta info (channel, date, status)', () => {
    const item = mockCourse.items[1];
    mockUseCourseItemPage.mockReturnValue({
      ...defaultReturn,
      course: mockCourse,
      item,
      courseIdNum: 1,
    });

    render(<CourseItemPage />);
    expect(screen.getByText('Channel Beta')).toBeDefined();
    expect(screen.getByText('Completado')).toBeDefined();
  });

  test('renders notes section', () => {
    const item = mockCourse.items[1];
    mockUseCourseItemPage.mockReturnValue({
      ...defaultReturn,
      course: mockCourse,
      item,
      courseIdNum: 1,
    });

    render(<CourseItemPage />);
    expect(screen.getByText('NOTAS')).toBeDefined();
    expect(screen.getByText('Some notes about this video')).toBeDefined();
  });

  test('shows navigation buttons based on hasPrev/hasNext', () => {
    const item = mockCourse.items[0];
    mockUseCourseItemPage.mockReturnValue({
      ...defaultReturn,
      course: mockCourse,
      item,
      courseIdNum: 1,
      hasPrev: false,
      hasNext: true,
    });

    render(<CourseItemPage />);
    expect(screen.getByText('SIGUIENTE')).toBeDefined();
    expect(screen.queryByText('ANTERIOR')).toBeNull();
  });

  test('shows previous button when hasPrev is true', () => {
    const item = mockCourse.items[1];
    mockUseCourseItemPage.mockReturnValue({
      ...defaultReturn,
      course: mockCourse,
      item,
      courseIdNum: 1,
      hasPrev: true,
      hasNext: true,
    });

    render(<CourseItemPage />);
    expect(screen.getByText('ANTERIOR')).toBeDefined();
    expect(screen.getByText('SIGUIENTE')).toBeDefined();
  });

  test('shows toggle button', () => {
    const item = mockCourse.items[0];
    mockUseCourseItemPage.mockReturnValue({
      ...defaultReturn,
      course: mockCourse,
      item,
      courseIdNum: 1,
    });

    render(<CourseItemPage />);
    expect(screen.getByText('MARCAR COMO COMPLETADO')).toBeDefined();
  });

  test('shows toggle button with pendiente text when completed', () => {
    const item = mockCourse.items[1];
    mockUseCourseItemPage.mockReturnValue({
      ...defaultReturn,
      course: mockCourse,
      item,
      courseIdNum: 1,
    });

    render(<CourseItemPage />);
    expect(screen.getByText('MARCAR COMO PENDIENTE')).toBeDefined();
  });

  test('shows delete button', () => {
    const item = mockCourse.items[0];
    mockUseCourseItemPage.mockReturnValue({
      ...defaultReturn,
      course: mockCourse,
      item,
      courseIdNum: 1,
    });

    render(<CourseItemPage />);
    expect(screen.getByText('ELIMINAR')).toBeDefined();
  });

  test('calls handleToggle when toggle button clicked', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    const item = mockCourse.items[0];

    mockUseCourseItemPage.mockReturnValue({
      ...defaultReturn,
      course: mockCourse,
      item,
      courseIdNum: 1,
      handleToggle,
    });

    render(<CourseItemPage />);
    await user.click(screen.getByText('MARCAR COMO COMPLETADO'));
    expect(handleToggle).toHaveBeenCalledOnce();
  });
});
