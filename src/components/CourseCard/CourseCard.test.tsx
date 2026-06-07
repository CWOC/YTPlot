import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { CourseCard } from './CourseCard';
import type { CourseCardProps } from './CourseCard';

vi.mock('wouter-preact', () => ({
  Link: ({ children, href, class: className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

const baseProps: CourseCardProps = {
  id: 42,
  title: 'Curso de Prueba',
  thumbnail: 'https://img.example.com/course.jpg',
  source: 'youtube',
  progress: 65,
};

describe('CourseCard', () => {
  test('renders title', () => {
    render(<CourseCard {...baseProps} />);
    expect(screen.getByText('Curso de Prueba')).toBeDefined();
  });

  test('renders thumbnail as background image', () => {
    const { container } = render(<CourseCard {...baseProps} />);
    const thumb = container.querySelector('[class*="thumbnail"]');
    expect(thumb).toBeDefined();
    expect((thumb as HTMLElement).getAttribute('style')).toContain(baseProps.thumbnail);
  });

  test('shows placeholder class when thumbnail is null', () => {
    const { container } = render(<CourseCard {...baseProps} thumbnail={null} />);
    const thumb = container.querySelector('[class*="thumbnail"]');
    expect(thumb).toBeDefined();
    expect((thumb as HTMLElement).classList.toString()).toContain('placeholder');
  });

  test('shows source badge with correct text', () => {
    render(<CourseCard {...baseProps} source="manual" />);
    expect(screen.getByText('MANUAL')).toBeDefined();
  });

  test('shows source badge for youtube', () => {
    render(<CourseCard {...baseProps} source="youtube" />);
    expect(screen.getByText('YOUTUBE')).toBeDefined();
  });

  test('shows progress percentage', () => {
    render(<CourseCard {...baseProps} />);
    expect(screen.getByText('65%')).toBeDefined();
  });

  test('link points to correct course URL', () => {
    render(<CourseCard {...baseProps} />);
    const link = screen.getByText('► RESUME').closest('a') as HTMLAnchorElement;
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/dashboard/course/42');
  });

  test('shows RESUME button text', () => {
    render(<CourseCard {...baseProps} />);
    expect(screen.getByText('► RESUME')).toBeDefined();
  });
});
