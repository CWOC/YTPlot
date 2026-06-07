import type {
  YoutubePlaylistResponse,
  YoutubeVideoResponse,
  Video,
  CourseFromInsertVideo,
  CourseFromInsertPlaylist,
} from '@/types/video.d';

const YOUTUBE_V3_API_KEY = import.meta.env.VITE_YOUTUBE_V3_API_KEY;

export class YoutubeService {
  private static apiKey = YOUTUBE_V3_API_KEY;
  private static apiVideoUrl = 'https://www.googleapis.com/youtube/v3/videos';
  private static apiPlaylistUrl = 'https://www.googleapis.com/youtube/v3/playlists';
  private static apiPlaylistItemsUrl = 'https://www.googleapis.com/youtube/v3/playlistItems';

  constructor() {}

  private static async verifyApiKey() {
    if (!YoutubeService.apiKey) {
      throw new Error('YouTube API key is not set. Please check your environment variables.');
    }
  }

  static extractVideoId(url: string) {
    const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|\/|$)/);

    return videoIdMatch ? videoIdMatch[1] : null;
  }

  static extractPlaylistId(url: string) {
    const playlistIdMatch = url.match(/[?&]list=([0-9A-Za-z_-]+)/);

    return playlistIdMatch ? playlistIdMatch[1] : null;
  }

  static async fetchVideoById(videoId: string): Promise<YoutubeVideoResponse | null> {
    await YoutubeService.verifyApiKey();

    const response = await fetch(
      `${YoutubeService.apiVideoUrl}?part=snippet,contentDetails&id=${videoId}&key=${YoutubeService.apiKey}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch video data: ${response.statusText}`);
    }

    const data = await response.json();

    return data.items[0] || null;
  }

  static async fetchPlaylistById(playlistId: string): Promise<YoutubePlaylistResponse | null> {
    await YoutubeService.verifyApiKey();

    const queryPlaylist = fetch(
      `${YoutubeService.apiPlaylistUrl}?part=snippet&maxResults=50&id=${playlistId}&key=${YoutubeService.apiKey}`,
    );
    const queryPlaylistItems = fetch(
      `${YoutubeService.apiPlaylistItemsUrl}?part=snippet,contentDetails&playlistId=${playlistId}&key=${YoutubeService.apiKey}`,
    );

    const [playlistResponse, playlistItemsResponse] = await Promise.all([
      queryPlaylist,
      queryPlaylistItems,
    ]);

    if (!playlistResponse.ok || !playlistItemsResponse.ok) {
      throw new Error(`Failed to fetch playlist data: ${playlistResponse.statusText}`);
    }

    const playlistData = await playlistResponse.json();
    const playlistItemsData = await playlistItemsResponse.json();

    if (!playlistData || !playlistItemsData) {
      return null;
    }

    return { ...playlistData.items[0], items: playlistItemsData.items };
  }

  static formatVideoDetails(video: YoutubeVideoResponse): Video {
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.medium.url,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      completed: false,
    };
  }

  static formatVideoDetailsIntoCourse(video: YoutubeVideoResponse): CourseFromInsertVideo {
    return {
      title: video.snippet.title,
      type: 'youtube',
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.medium.url,
      publishedAt: video.snippet.publishedAt,
      items: [
        {
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.medium.url,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          notes: '',
          completed: false,
        },
      ],
      progress: 0,
    };
  }

  static formatPlaylistDetailsIntoCourse(
    playlist: YoutubePlaylistResponse,
  ): CourseFromInsertPlaylist {
    return {
      title: playlist.snippet.title,
      type: 'youtube',
      description: playlist.snippet.description,
      thumbnail: playlist.snippet.thumbnails.medium.url,
      publishedAt: playlist.snippet.publishedAt,
      items: playlist.items.map((item: Video) => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        notes: '',
        completed: false,
      })),
      progress: 0,
    };
  }

  static formatPlaylistDetails(playlist: YoutubePlaylistResponse): Video[] {
    return playlist.items.map((item: Video) => ({
      id: item.contentDetails.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      completed: false,
    }));
  }
}
