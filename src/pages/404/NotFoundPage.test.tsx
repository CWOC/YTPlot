import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { NotFoundPage } from './NotFoundPage';

describe('NotFoundPage', () => {
  test('renders "404" or not found message', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404 - No Encontrado')).toBeDefined();
  });
});
