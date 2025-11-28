export interface VideoFormat {
  id: string;
  quality: string;
  format: string;
  size: string;
  fps?: number;
  hasAudio: boolean;
  type: 'video' | 'audio';
}

export interface VideoMetadata {
  id: string;
  url: string;
  title: string;
  channel: string;
  views: string;
  publishedAt: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  isPlaylist: boolean;
  itemCount?: number; // For playlists
  formats: VideoFormat[];
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface DownloadTask {
  id: string;
  formatId: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  filename: string;
}
