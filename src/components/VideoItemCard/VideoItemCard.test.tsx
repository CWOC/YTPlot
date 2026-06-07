import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { VideoItemCard } from './VideoItemCard';
import type { Video } from '@/types/video.d';

const baseItem: Video = {
  id: 'abc123',
  title: 'Test Video Title',
  description: 'A test video description',
  thumbnail: 'https://img.example.com/thumb.jpg',
  channelTitle: 'Test Channel',
  publishedAt: '2024-06-01T00:00:00Z',
  completed: false,
  notes: '',
};

describe('VideoItemCard', () => {
  test('renders thumbnail with correct URL', () => {
    const { container } = render(
      <VideoItemCard item={baseItem} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    const thumb = container.querySelector('[class*="thumbnail"]');
    expect(thumb).toBeDefined();
    expect((thumb as HTMLElement).getAttribute('style')).toContain(baseItem.thumbnail);
  });

  test('renders title', () => {
    render(<VideoItemCard item={baseItem} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Test Video Title')).toBeDefined();
  });

  test('shows COMPLETADO button when not completed', () => {
    render(<VideoItemCard item={baseItem} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('COMPLETADO')).toBeDefined();
  });

  test('shows DESMARCAR button when completed', () => {
    const item = { ...baseItem, completed: true };
    render(<VideoItemCard item={item} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('DESMARCAR')).toBeDefined();
  });

  test('shows completed overlay when completed', () => {
    const item = { ...baseItem, completed: true };
    const { container } = render(
      <VideoItemCard item={item} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    const overlay = container.querySelector('[class*="completedOverlay"]');
    expect(overlay).toBeDefined();
  });

  test('does not show overlay when not completed', () => {
    const { container } = render(
      <VideoItemCard item={baseItem} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    const overlay = container.querySelector('[class*="completedOverlay"]');
    expect(overlay).toBeNull();
  });

  test('calls onToggle when toggle button clicked (with preventDefault/stopPropagation)', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<VideoItemCard item={baseItem} onToggle={onToggle} onDelete={vi.fn()} />);

    const toggleBtn = screen.getByText('COMPLETADO');
    await user.click(toggleBtn);

    expect(onToggle).toHaveBeenCalledOnce();
  });

  test('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<VideoItemCard item={baseItem} onToggle={vi.fn()} onDelete={onDelete} />);

    const deleteBtn = screen.getByLabelText('Eliminar video');
    await user.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledOnce();
  });
});
