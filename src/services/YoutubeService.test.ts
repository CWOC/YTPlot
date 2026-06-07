import { describe, test, expect } from 'vitest';
import { YoutubeService } from './YoutubeService';
import type { YoutubePlaylistResponse, YoutubeVideoResponse } from '@/types/video.d';

describe('YoutubeService — extractVideoId', () => {
  test('extracts from standard watch URL', () => {
    expect(YoutubeService.extractVideoId('https://youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  test('extracts from short youtu.be URL', () => {
    expect(YoutubeService.extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  test('extracts with extra query params', () => {
    expect(
      YoutubeService.extractVideoId('https://youtube.com/watch?v=dQw4w9WgXcQ&list=PLabc123&t=30'),
    ).toBe('dQw4w9WgXcQ');
  });

  test('returns null for URL without video', () => {
    expect(YoutubeService.extractVideoId('https://example.com')).toBeNull();
  });

  test('returns null for empty string', () => {
    expect(YoutubeService.extractVideoId('')).toBeNull();
  });
});

describe('YoutubeService — extractPlaylistId', () => {
  test('extracts from URL with list param', () => {
    expect(YoutubeService.extractPlaylistId('https://youtube.com/watch?v=abc&list=PLabc123')).toBe(
      'PLabc123',
    );
  });

  test('returns null for URL without list', () => {
    expect(YoutubeService.extractPlaylistId('https://youtube.com/watch?v=abc')).toBeNull();
  });

  test('returns null for empty string', () => {
    expect(YoutubeService.extractPlaylistId('')).toBeNull();
  });
});

describe('YoutubeService — formatVideoDetailsIntoCourse', () => {
  const mockVideoResponse: YoutubeVideoResponse = {
    etag: 'etag1',
    id: 'dQw4w9WgXcQ',
    kind: 'youtube#video',
    snippet: {
      categoryId: '10',
      channelId: 'UC123',
      channelTitle: 'Test Channel',
      defaultAudioLanguage: 'en',
      defaultLanguage: 'en',
      description: 'A test video',
      liveBroadcastContent: 'none',
      localized: { description: 'A test video', title: 'Test Video' },
      publishedAt: '2024-01-01T00:00:00Z',
      thumbnails: {
        default: { url: 'https://img.com/default.jpg', width: 120, height: 90 },
        medium: { url: 'https://img.com/medium.jpg', width: 320, height: 180 },
        high: { url: 'https://img.com/high.jpg', width: 480, height: 360 },
        maxres: { url: 'https://img.com/maxres.jpg', width: 1280, height: 720 },
        standard: { url: 'https://img.com/standard.jpg', width: 640, height: 480 },
      },
      title: 'Test Video',
    },
  };

  test('maps fields correctly', () => {
    const result = YoutubeService.formatVideoDetailsIntoCourse(mockVideoResponse);

    expect(result.type).toBe('youtube');
    expect(result.title).toBe('Test Video');
    expect(result.description).toBe('A test video');
    expect(result.thumbnail).toBe('https://img.com/medium.jpg');
    expect(result.publishedAt).toBe('2024-01-01T00:00:00Z');
    expect(result.progress).toBe(0);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe('Test Video');
    expect(result.items[0].channelTitle).toBe('Test Channel');
  });
});

describe('YoutubeService — formatPlaylistDetailsIntoCourse', () => {
  const mockPlaylistResponse: YoutubePlaylistResponse = {
    etag: 'etag1',
    id: 'PLabc123',
    kind: 'youtube#playlist',
    snippet: {
      channelId: 'UC123',
      channelTitle: 'Test Channel',
      description: 'A test playlist',
      localized: { description: 'A test playlist', title: 'Test Playlist' },
      publishedAt: '2024-01-01T00:00:00Z',
      thumbnails: {
        default: { url: 'https://img.com/default.jpg', width: 120, height: 90 },
        medium: { url: 'https://img.com/medium.jpg', width: 320, height: 180 },
        high: { url: 'https://img.com/high.jpg', width: 480, height: 360 },
        maxres: { url: 'https://img.com/maxres.jpg', width: 1280, height: 720 },
        standard: { url: 'https://img.com/standard.jpg', width: 640, height: 480 },
      },
      title: 'Test Playlist',
    },
    items: [
      {
        contentDetails: { videoId: 'vid001', videoPublishedAt: '2024-01-01T00:00:00Z' },
        etag: 'etag2',
        id: 'item1',
        kind: 'youtube#playlistItem',
        snippet: {
          channelId: 'UC123',
          channelTitle: 'Test Channel',
          description: 'First video',
          playlistId: 'PLabc123',
          position: 0,
          publishedAt: '2024-01-01T00:00:00Z',
          resourceId: { kind: 'youtube#video', videoId: 'vid001' },
          thumbnails: {
            default: { url: 'https://img.com/default.jpg', width: 120, height: 90 },
            medium: { url: 'https://img.com/medium.jpg', width: 320, height: 180 },
            high: { url: 'https://img.com/high.jpg', width: 480, height: 360 },
            maxres: { url: 'https://img.com/maxres.jpg', width: 1280, height: 720 },
            standard: { url: 'https://img.com/standard.jpg', width: 640, height: 480 },
          },
          title: 'First Video',
          videoOwnerChannelId: 'UC123',
          videoOwnerChannelTitle: 'Test Channel',
        },
      },
    ],
  };

  test('maps playlist fields correctly', () => {
    const result = YoutubeService.formatPlaylistDetailsIntoCourse(mockPlaylistResponse);

    expect(result.type).toBe('youtube');
    expect(result.title).toBe('Test Playlist');
    expect(result.description).toBe('A test playlist');
    expect(result.thumbnail).toBe('https://img.com/medium.jpg');
    expect(result.progress).toBe(0);
  });

  test('maps playlist items correctly', () => {
    const result = YoutubeService.formatPlaylistDetailsIntoCourse(mockPlaylistResponse);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe('vid001');
    expect(result.items[0].title).toBe('First Video');
    expect(result.items[0].channelTitle).toBe('Test Channel');
    expect(result.items[0].thumbnail).toBe('https://img.com/medium.jpg');
  });
});
