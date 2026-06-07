import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/preact';
import { useYoutube } from './useYoutube';
import type { YoutubePlaylistResponse, YoutubeVideoResponse } from '@/types/video.d';

const {
  mockExtractPlaylistId,
  mockExtractVideoId,
  mockFetchPlaylistById,
  mockFetchVideoById,
  mockFormatPlaylist,
  mockFormatVideo,
  mockAddCourse,
  mockLoadRecentCourses,
  mockLoadAllCourses,
} = vi.hoisted(() => ({
  mockExtractPlaylistId: vi.fn(),
  mockExtractVideoId: vi.fn(),
  mockFetchPlaylistById: vi.fn(),
  mockFetchVideoById: vi.fn(),
  mockFormatPlaylist: vi.fn(),
  mockFormatVideo: vi.fn(),
  mockAddCourse: vi.fn(),
  mockLoadRecentCourses: vi.fn(),
  mockLoadAllCourses: vi.fn(),
}));

vi.mock('@/services/YoutubeService', () => ({
  YoutubeService: {
    extractPlaylistId: mockExtractPlaylistId,
    extractVideoId: mockExtractVideoId,
    fetchPlaylistById: mockFetchPlaylistById,
    fetchVideoById: mockFetchVideoById,
    formatPlaylistDetailsIntoCourse: mockFormatPlaylist,
    formatVideoDetailsIntoCourse: mockFormatVideo,
  },
}));

vi.mock('@/services/IndexedDBService', () => ({
  IndexedDBService: {
    addCourse: mockAddCourse,
  },
}));

vi.mock('@/stores/courseStore', () => ({
  useCourseStore: Object.assign(vi.fn(), {
    getState: vi.fn(() => ({
      loadRecentCourses: mockLoadRecentCourses,
      loadAllCourses: mockLoadAllCourses,
    })),
  }),
}));

function setup() {
  const result: { current: ReturnType<typeof useYoutube> } = {
    current: undefined as never,
  };
  function Harness() {
    result.current = useYoutube();
    return null;
  }
  render(<Harness />);
  return result;
}

describe('useYoutube', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('returns error for empty URL', async () => {
    const hook = setup();

    await hook.current.handleCreateCourse('');

    expect(hook.current.error).toBe('Por favor, ingresa una URL de YouTube.');
    expect(mockAddCourse).not.toHaveBeenCalled();
  });

  test('returns error when URL has no video or playlist ID', async () => {
    mockExtractPlaylistId.mockReturnValue(null);
    mockExtractVideoId.mockReturnValue(null);

    const hook = setup();

    await hook.current.handleCreateCourse('https://example.com');

    expect(hook.current.error).toBe(
      'La URL ingresada no es válida. Asegúrate de que sea un enlace de lista de reproducción o video de YouTube.',
    );
    expect(mockAddCourse).not.toHaveBeenCalled();
  });

  test('processes a valid playlist URL', async () => {
    mockExtractPlaylistId.mockReturnValue('PLabc123');
    mockExtractVideoId.mockReturnValue(null);

    const playlistData = {
      id: 'PLabc123',
      snippet: { title: 'Test playlist', description: 'Desc', publishedAt: '2024-01-01T00:00:00Z', channelTitle: 'Channel', thumbnails: { medium: { url: 'https://img.com/m.jpg', width: 320, height: 180 } } },
      items: [],
    } as unknown as YoutubePlaylistResponse;
    mockFetchPlaylistById.mockResolvedValue(playlistData);
    mockFormatPlaylist.mockReturnValue({ title: 'Formatted Playlist' });

    const hook = setup();

    await hook.current.handleCreateCourse('https://youtube.com/playlist?list=PLabc123');

    expect(mockFetchPlaylistById).toHaveBeenCalledWith('PLabc123');
    expect(mockFormatPlaylist).toHaveBeenCalledWith(playlistData);
    expect(mockAddCourse).toHaveBeenCalledWith({ title: 'Formatted Playlist' });
    expect(mockLoadRecentCourses).toHaveBeenCalled();
    expect(mockLoadAllCourses).toHaveBeenCalled();
    expect(hook.current.error).toBeNull();
  });

  test('processes a valid video URL', async () => {
    mockExtractPlaylistId.mockReturnValue(null);
    mockExtractVideoId.mockReturnValue('dQw4w9WgXcQ');

    const videoData = { id: 'dQw4w9WgXcQ', snippet: { title: 'Test Vid' } } as unknown as YoutubeVideoResponse;
    mockFetchVideoById.mockResolvedValue(videoData);
    mockFormatVideo.mockReturnValue({ title: 'Formatted Video' });

    const hook = setup();

    await hook.current.handleCreateCourse('https://youtu.be/dQw4w9WgXcQ');

    expect(mockFetchVideoById).toHaveBeenCalledWith('dQw4w9WgXcQ');
    expect(mockFormatVideo).toHaveBeenCalledWith(videoData);
    expect(mockAddCourse).toHaveBeenCalledWith({ title: 'Formatted Video' });
    expect(mockLoadRecentCourses).toHaveBeenCalled();
    expect(mockLoadAllCourses).toHaveBeenCalled();
    expect(hook.current.error).toBeNull();
  });

  test('returns error when API returns null', async () => {
    mockExtractPlaylistId.mockReturnValue('PLabc123');
    mockExtractVideoId.mockReturnValue(null);
    mockFetchPlaylistById.mockResolvedValue(null);

    const hook = setup();

    await hook.current.handleCreateCourse('https://youtube.com/playlist?list=PLabc123');

    expect(hook.current.error).toBe(
      'No se pudo obtener información de la URL proporcionada. Verifica que el enlace sea correcto y accesible.',
    );
    expect(mockAddCourse).not.toHaveBeenCalled();
  });

  test('handles exceptions gracefully', async () => {
    mockExtractPlaylistId.mockReturnValue('PLabc123');
    mockExtractVideoId.mockReturnValue(null);
    mockFetchPlaylistById.mockRejectedValue(new Error('Network error'));

    const hook = setup();

    await hook.current.handleCreateCourse('https://youtube.com/playlist?list=PLabc123');

    expect(hook.current.error).toBe('Error al procesar la URL: Network error');
    expect(mockAddCourse).not.toHaveBeenCalled();
  });
});
