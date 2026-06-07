export type YoutubePlaylistResponse = {
  etag: string;
  id: string;
  items: [];
  kind: string;
  snippet: Snippet;
};

type PlaylistItemResponse = {
  contentDetails: ContentDetails;
  etag: string;
  id: string;
  kind: string;
  snippet: SnippetPlaylistItem;
};

type Snippet = {
  channelId: string;
  channelTitle: string;
  description: string;
  localized: Localized;
  publishedAt: string;
  thumbnails: Thumbnails;
  title: string;
};

type Localized = {
  description: string;
  title: string;
};

type Thumbnails = {
  default: Thumbnail;
  high: Thumbnail;
  maxres: Thumbnail;
  medium: Thumbnail;
  standard: Thumbnail;
};

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

type ContentDetails = {
  videoId: string;
  videoPublishedAt: string;
};

type SnippetPlaylistItem = {
  channelId: string;
  channelTitle: string;
  description: string;
  playlistId: string;
  position: number;
  publishedAt: string;
  resourceId: ResourceId;
  thumbnails: Thumbnails;
  title: string;
  videoOwnerChannelId: string;
  videoOwnerChannelTitle: string;
};

type ResourceId = {
  kind: string;
  videoId: string;
};

export type YoutubeVideoResponse = {
  etag: string;
  id: string;
  kind: string;
  snippet: SnippetVideo;
};

type SnippetVideo = {
  categoryId: string;
  channelId: string;
  channelTitle: string;
  defaultAudioLanguage: string;
  defaultLanguage: string;
  description: string;
  liveBroadcastContent: string;
  localized: Localized;
  publishedAt: string;
  thumbnails: Thumbnails;
  title: string;
};

type ContentDetailsVideo = {
  caption: string;
  contentRating: ContentRating;
  definition: string;
  dimension: string;
  duration: string;
  licensedContent: boolean;
  projection: string;
};

type ContentRating = {
  acbRating: string;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
};

export type InsertVideo = Omit<Video, 'id'>;

export type CourseFromInsertVideo = Omit<Video, 'id', 'channelTitle'> & {
  type: 'youtube' | 'manual';
  items: Video[];
  progress: number;
  notes: string;
};

export type Course = {
  id: number;
  type: 'youtube' | 'manual';
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  items: Video[];
  progress: number;
  notes: string;
};

export type InsertCourse = Omit<Course, 'id'>;

export type CourseFromInsertPlaylist = Omit<Course, 'id', 'channelTitle'> & {
  items: InsertVideo[];
};
