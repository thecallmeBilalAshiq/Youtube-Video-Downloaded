import { VideoMetadata } from '../types';

export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const extractPlaylistId = (url: string): string | null => {
  const regExp = /[?&]list=([^#&?]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export const generateMockFormats = (isPlaylist: boolean): import('../types').VideoFormat[] => {
  if (isPlaylist) {
    return [
      { id: 'pl-zip-best', quality: 'Best Available', format: 'ZIP', size: '~250 MB', hasAudio: true, type: 'video' },
      { id: 'pl-mp3-all', quality: 'Audio Only', format: 'ZIP (MP3)', size: '~45 MB', hasAudio: true, type: 'audio' },
    ];
  }

  return [
    { id: '4k-mp4', quality: '2160p (4K)', format: 'MP4', size: '450.2 MB', fps: 60, hasAudio: true, type: 'video' },
    { id: '1440p-mp4', quality: '1440p (2K)', format: 'MP4', size: '215.8 MB', fps: 60, hasAudio: true, type: 'video' },
    { id: '1080p-mp4', quality: '1080p (HD)', format: 'MP4', size: '124.5 MB', fps: 60, hasAudio: true, type: 'video' },
    { id: '720p-mp4', quality: '720p', format: 'MP4', size: '65.2 MB', fps: 30, hasAudio: true, type: 'video' },
    { id: '480p-mp4', quality: '480p', format: 'MP4', size: '32.1 MB', fps: 30, hasAudio: true, type: 'video' },
    { id: '360p-mp4', quality: '360p', format: 'MP4', size: '18.5 MB', fps: 30, hasAudio: true, type: 'video' },
    { id: 'audio-mp3', quality: '320kbps', format: 'MP3', size: '8.4 MB', hasAudio: true, type: 'audio' },
    { id: 'audio-m4a', quality: '128kbps', format: 'M4A', size: '3.2 MB', hasAudio: true, type: 'audio' },
  ];
};

export const downloadBlob = (content: Blob | string, filename: string, mimeType?: string) => {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType || 'text/plain' }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Local Storage Helpers
const STORAGE_KEY = 'streamfetch_library';

export const getSavedVideos = (): VideoMetadata[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to read from local storage", e);
    return [];
  }
};

export const saveVideo = (video: VideoMetadata): boolean => {
  try {
    const saved = getSavedVideos();
    if (saved.some(v => v.id === video.id)) return false;
    
    const newSaved = [video, ...saved];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
    return true;
  } catch (e) {
    console.error("Failed to save to local storage", e);
    return false;
  }
};

export const removeVideo = (id: string): VideoMetadata[] => {
  try {
    const saved = getSavedVideos();
    const newSaved = saved.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
    return newSaved;
  } catch (e) {
    console.error("Failed to remove from local storage", e);
    return [];
  }
};
