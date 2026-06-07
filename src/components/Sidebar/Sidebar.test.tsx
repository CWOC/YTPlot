import { render, screen, fireEvent } from '@testing-library/preact';
import { Sidebar } from './Sidebar';
import { describe, test, expect } from 'vitest';

describe('Sidebar Component', () => {
  test("renders logo text 'YTPlot' when expanded", () => {
    render(<Sidebar />);
    expect(screen.getByText('YTPlot')).toBeDefined();
  });

  test('contains nav links with correct names', () => {
    render(<Sidebar />);
    const linkNames = ['Inicio', 'Dashboard'];
    linkNames.forEach((name) => {
      expect(screen.getByText(name)).toBeDefined();
    });
  });

  test('starts in open state', () => {
    const { container } = render(<Sidebar />);
    const sidebar = container.querySelector('aside');
    expect(sidebar?.className).toContain('open');
  });

  test('toggles collapsed on button click', async () => {
    const { container } = render(<Sidebar />);
    const button = screen.getByRole('button', { name: /contraer/i });
    fireEvent.click(button);
    const sidebar = container.querySelector('aside');
    expect(sidebar?.className).toContain('collapsed');
  });
});
