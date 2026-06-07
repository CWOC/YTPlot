import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { CourseCarousel } from './CourseCarousel';
import type { Course } from '@/types/video.d';

const mockCourses: Course[] = [
  {
    id: 1,
    type: 'youtube',
    title: 'Curso A',
    description: 'Desc A',
    thumbnail: 'https://img.com/a.jpg',
    publishedAt: '2024-01-01T00:00:00Z',
    items: [],
    progress: 50,
    notes: '',
  },
  {
    id: 2,
    type: 'manual',
    title: 'Curso B',
    description: 'Desc B',
    thumbnail: 'https://img.com/b.jpg',
    publishedAt: '2024-01-01T00:00:00Z',
    items: [],
    progress: 0,
    notes: '',
  },
  {
    id: 3,
    type: 'youtube',
    title: 'Curso C',
    description: 'Desc C',
    thumbnail: 'https://img.com/c.jpg',
    publishedAt: '2024-01-01T00:00:00Z',
    items: [],
    progress: 100,
    notes: '',
  },
];

describe('CourseCarousel', () => {
  test('renders heading', () => {
    render(<CourseCarousel courses={mockCourses} isLoading={false} />);
    expect(screen.getByText('TODOS LOS CURSOS')).toBeDefined();
  });

  test('shows skeleton when loading', () => {
    const { container } = render(<CourseCarousel courses={[]} isLoading={true} />);
    const skeletons = container.querySelectorAll('[class*="skeletonCard"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
  });

  test('shows empty state when no courses', () => {
    render(<CourseCarousel courses={[]} isLoading={false} />);
    expect(screen.getByText('Aún no hay cursos')).toBeDefined();
  });

  test('renders course cards for each course', () => {
    render(<CourseCarousel courses={mockCourses} isLoading={false} />);
    expect(screen.getByText('Curso A')).toBeDefined();
    expect(screen.getByText('Curso B')).toBeDefined();
    expect(screen.getByText('Curso C')).toBeDefined();
  });

  test('prev button is disabled at start', () => {
    render(<CourseCarousel courses={mockCourses} isLoading={false} />);
    const buttons = screen.getAllByRole('button');
    const prevBtn = buttons[0];
    expect(prevBtn).toHaveProperty('disabled', true);
  });

  test('next button is enabled when more courses than visible', () => {
    render(<CourseCarousel courses={mockCourses} isLoading={false} />);
    const buttons = screen.getAllByRole('button');
    const nextBtn = buttons[buttons.length - 1];
    expect(nextBtn).toHaveProperty('disabled', false);
  });

  test('clicking next advances and disables next at end', async () => {
    render(<CourseCarousel courses={mockCourses} isLoading={false} />);
    const [prevBtn, nextBtn] = screen.getAllByRole('button');

    await nextBtn.click();
    expect(prevBtn).toHaveProperty('disabled', false);

    await nextBtn.click();
    expect(prevBtn).toHaveProperty('disabled', false);
    expect(nextBtn).toHaveProperty('disabled', true);
  });

  test('clicking prev goes back and re-enables next', async () => {
    render(<CourseCarousel courses={mockCourses} isLoading={false} />);
    const [prevBtn, nextBtn] = screen.getAllByRole('button');

    await nextBtn.click();
    await nextBtn.click();

    expect(nextBtn).toHaveProperty('disabled', true);

    await prevBtn.click();
    expect(nextBtn).toHaveProperty('disabled', false);
  });

  test('single course: both buttons disabled', () => {
    const single = mockCourses.slice(0, 1);
    render(<CourseCarousel courses={single} isLoading={false} />);
    const [prevBtn, nextBtn] = screen.getAllByRole('button');
    expect(prevBtn).toHaveProperty('disabled', true);
    expect(nextBtn).toHaveProperty('disabled', true);
  });
});
