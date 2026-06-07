import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { h } from 'preact';
import { YoutubeUrlInput } from './YoutubeUrlInput';

const { mockHandleCreateCourseInput, mockUseYoutubeInput } = vi.hoisted(() => {
  const mockHandle = vi.fn();
  const mockHook = vi.fn(() => ({
    inputRef: { current: document.createElement('input') },
    error: null,
    handleCreateCourseInput: mockHandle,
  }));
  return { mockHandleCreateCourseInput: mockHandle, mockUseYoutubeInput: mockHook };
});

vi.mock('@/hooks/useYoutubeInput', () => ({
  useYoutubeInput: mockUseYoutubeInput,
}));

describe('YoutubeUrlInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders input and button', () => {
    render(h(YoutubeUrlInput, null));
    expect(screen.getByLabelText('URL de YouTube')).toBeDefined();
    expect(screen.getByText('INYECTAR CONTENIDO')).toBeDefined();
  });

  test('displays error when hook returns error', () => {
    mockUseYoutubeInput.mockReturnValue({
      inputRef: { current: document.createElement('input') },
      error: 'URL inválida',
      handleCreateCourseInput: mockHandleCreateCourseInput,
    });

    render(h(YoutubeUrlInput, null));
    expect(screen.getByText('URL inválida')).toBeDefined();
  });

  test('calls handleCreateCourseInput on button click', () => {
    render(h(YoutubeUrlInput, null));
    const button = screen.getByText('INYECTAR CONTENIDO');
    fireEvent.click(button);
    expect(mockHandleCreateCourseInput).toHaveBeenCalledTimes(1);
  });
});
