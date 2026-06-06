import { render, screen } from '@testing-library/preact';
import { Sidebar } from './Sidebar';
import { describe, test, expect } from 'vitest';

describe('Sidebar Component', () => {
  test("renders logo text 'YTPlot' when expanded", () => {
    render(<Sidebar isOpen={true} />);
    expect(screen.getByText('YTPlot')).toBeDefined();
  });

  test('contains nav links with correct names', () => {
    render(<Sidebar isOpen={true} />);
    const linkNames = ['Inicio', 'Dashboard'];
    linkNames.forEach((name) => {
      expect(screen.getByText(name)).toBeDefined();
    });
  });

  test('has collapsed class when isOpen is false', () => {
    const { container } = render(<Sidebar isOpen={false} />);
    const sidebar = container.querySelector('aside');
    expect(sidebar?.className).toContain('collapsed');
  });

  test('has open class when isOpen is true', () => {
    const { container } = render(<Sidebar isOpen={true} />);
    const sidebar = container.querySelector('aside');
    expect(sidebar?.className).toContain('open');
  });
});
