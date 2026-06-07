import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/preact';
import { h } from 'preact';
import { useAddToCourse } from './useAddToCourse';
import type { YoutubePlaylistResponse, YoutubeVideoResponse } from '@/types/video.d';

const {
  mockExtractPlaylistId,
  mockExtractVideoId,
  mockFetchPlaylistById,
  mockFetchVideoById,
  mockFormatPlaylistDetails,
  mockFormatVideoDetails,
  mockAddItemsToCourse,
} = vi.hoisted(() => ({
  mockExtractPlaylistId: vi.fn(),
  mockExtractVideoId: vi.fn(),
  mockFetchPlaylistById: vi.fn(),
  mockFetchVideoById: vi.fn(),
  mockFormatPlaylistDetails: vi.fn(),
  mockFormatVideoDetails: vi.fn(),
  mockAddItemsToCourse: vi.fn(),
}));

vi.mock('@/services/YoutubeService', () => ({
  YoutubeService: {
    extractPlaylistId: mockExtractPlaylistId,
    extractVideoId: mockExtractVideoId,
    fetchPlaylistById: mockFetchPlaylistById,
    fetchVideoById: mockFetchVideoById,
    formatPlaylistDetails: mockFormatPlaylistDetails,
    formatVideoDetails: mockFormatVideoDetails,
  },
}));

vi.mock('@/stores/courseStore', () => ({
  useCourseStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ addItemsToCourse: mockAddItemsToCourse }),
}));

function setup(courseId = 1) {
  const result: { current: ReturnType<typeof useAddToCourse> } = {
    current: undefined as never,
  };
  function Harness() {
    result.current = useAddToCourse(courseId);
    return null;
  }
  render(h(Harness, null));
  return result;
}

describe('useAddToCourse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('sets error when URL is empty', async () => {
    const hook = setup();
    await hook.current.handleAddToCourse();
    expect(hook.current.error).toBe('Por favor, ingresa una URL de YouTube.');
    expect(mockAddItemsToCourse).not.toHaveBeenCalled();
  });

  test('sets error when URL is invalid', async () => {
    mockExtractPlaylistId.mockReturnValue(null);
    mockExtractVideoId.mockReturnValue(null);

    const hook = setup();
    hook.current.inputRef.current = document.createElement('input');
    hook.current.inputRef.current.value = 'invalid-url';

    await hook.current.handleAddToCourse();

    expect(hook.current.error).toBe(
      'La URL ingresada no es válida. Asegúrate de que sea un enlace de lista de reproducción o video de YouTube.',
    );
    expect(mockAddItemsToCourse).not.toHaveBeenCalled();
  });

  test('on valid video URL: fetches video, formats, and adds to course', async () => {
    mockExtractPlaylistId.mockReturnValue(null);
    mockExtractVideoId.mockReturnValue('dQw4w9WgXcQ');

    const videoData = {
      id: 'dQw4w9WgXcQ',
      snippet: { title: 'Test Vid' },
    } as unknown as YoutubeVideoResponse;
    mockFetchVideoById.mockResolvedValue(videoData);
    mockFormatVideoDetails.mockReturnValue({ id: 'dQw4w9WgXcQ', title: 'Formatted Video' });

    const hook = setup();
    hook.current.inputRef.current = document.createElement('input');
    hook.current.inputRef.current.value = 'https://youtu.be/dQw4w9WgXcQ';

    await hook.current.handleAddToCourse();

    expect(mockExtractVideoId).toHaveBeenCalledWith('https://youtu.be/dQw4w9WgXcQ');
    expect(mockFetchVideoById).toHaveBeenCalledWith('dQw4w9WgXcQ');
    expect(mockFormatVideoDetails).toHaveBeenCalledWith(videoData);
    expect(mockAddItemsToCourse).toHaveBeenCalledWith(1, [
      { id: 'dQw4w9WgXcQ', title: 'Formatted Video' },
    ]);
    expect(hook.current.inputRef.current!.value).toBe('');
    expect(hook.current.error).toBeNull();
  });

  test('on valid video URL: catches fetch error and sets error message', async () => {
    mockExtractPlaylistId.mockReturnValue(null);
    mockExtractVideoId.mockReturnValue('dQw4w9WgXcQ');
    mockFetchVideoById.mockRejectedValue(new Error('Network error'));

    const hook = setup();
    hook.current.inputRef.current = document.createElement('input');
    hook.current.inputRef.current.value = 'https://youtu.be/dQw4w9WgXcQ';

    await hook.current.handleAddToCourse();

    expect(hook.current.error).toBe('Error al procesar la URL: Network error');
    expect(mockAddItemsToCourse).not.toHaveBeenCalled();
  });

  test('on valid playlist URL: fetches playlist, formats, and adds to course', async () => {
    mockExtractPlaylistId.mockReturnValue('PLabc123');
    mockExtractVideoId.mockReturnValue(null);

    const playlistData = {
      id: 'PLabc123',
      snippet: { title: 'Test playlist', description: 'Desc' },
      items: [],
    } as unknown as YoutubePlaylistResponse;
    mockFetchPlaylistById.mockResolvedValue(playlistData);
    mockFormatPlaylistDetails.mockReturnValue([
      { id: 'v1', title: 'Video 1' },
      { id: 'v2', title: 'Video 2' },
    ]);

    const hook = setup(2);
    hook.current.inputRef.current = document.createElement('input');
    hook.current.inputRef.current.value = 'https://youtube.com/playlist?list=PLabc123';

    await hook.current.handleAddToCourse();

    expect(mockExtractPlaylistId).toHaveBeenCalledWith(
      'https://youtube.com/playlist?list=PLabc123',
    );
    expect(mockFetchPlaylistById).toHaveBeenCalledWith('PLabc123');
    expect(mockFormatPlaylistDetails).toHaveBeenCalledWith(playlistData);
    expect(mockAddItemsToCourse).toHaveBeenCalledWith(2, [
      { id: 'v1', title: 'Video 1' },
      { id: 'v2', title: 'Video 2' },
    ]);
    expect(hook.current.inputRef.current!.value).toBe('');
    expect(hook.current.error).toBeNull();
  });

  test('sets error when playlist fetch returns null', async () => {
    mockExtractPlaylistId.mockReturnValue('PLabc123');
    mockExtractVideoId.mockReturnValue(null);
    mockFetchPlaylistById.mockResolvedValue(null);

    const hook = setup();
    hook.current.inputRef.current = document.createElement('input');
    hook.current.inputRef.current.value = 'https://youtube.com/playlist?list=PLabc123';

    await hook.current.handleAddToCourse();

    expect(hook.current.error).toBe('No se pudo obtener la lista de reproducción.');
    expect(mockAddItemsToCourse).not.toHaveBeenCalled();
  });

  test('sets error when video fetch returns null', async () => {
    mockExtractPlaylistId.mockReturnValue(null);
    mockExtractVideoId.mockReturnValue('dQw4w9WgXcQ');
    mockFetchVideoById.mockResolvedValue(null);

    const hook = setup();
    hook.current.inputRef.current = document.createElement('input');
    hook.current.inputRef.current.value = 'https://youtu.be/dQw4w9WgXcQ';

    await hook.current.handleAddToCourse();

    expect(hook.current.error).toBe('No se pudo obtener el video.');
    expect(mockAddItemsToCourse).not.toHaveBeenCalled();
  });

  test('clears input field after success', async () => {
    mockExtractPlaylistId.mockReturnValue(null);
    mockExtractVideoId.mockReturnValue('dQw4w9WgXcQ');
    mockFetchVideoById.mockResolvedValue({ id: 'dQw4w9WgXcQ' } as unknown as YoutubeVideoResponse);
    mockFormatVideoDetails.mockReturnValue({ id: 'dQw4w9WgXcQ' });

    const hook = setup();
    hook.current.inputRef.current = document.createElement('input');
    hook.current.inputRef.current.value = 'https://youtu.be/dQw4w9WgXcQ';

    await hook.current.handleAddToCourse();

    expect(hook.current.inputRef.current!.value).toBe('');
  });
});
