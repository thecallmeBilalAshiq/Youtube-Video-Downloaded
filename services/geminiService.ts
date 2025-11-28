import { GoogleGenAI } from "@google/genai";
import { VideoMetadata } from '../types';
import { generateMockFormats } from '../utils/youtubeUtils';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchVideoMetadata = async (url: string, videoId: string | null, playlistId: string | null): Promise<VideoMetadata> => {
  
  const isPlaylist = !!playlistId;
  const id = playlistId || videoId || 'unknown';

  // We use Gemini Search Grounding to find real details about the video
  const prompt = `
    Find detailed metadata for this YouTube URL: ${url}
    
    If it is a video, find: Title, Channel Name, Exact View Count, Upload Date, Duration, and a short description.
    If it is a playlist, find: Playlist Title, Channel Name, Item count, and description.

    Return ONLY a JSON object with these keys:
    - title (string)
    - channel (string)
    - views (string) - e.g. "1.2M views"
    - publishedAt (string)
    - description (string) - max 200 characters
    - duration (string) - e.g. "10:05" or "25 videos"
    
    Do not use markdown formatting. Just raw JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "";
    // Attempt to clean and parse JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let data: any = {};
    
    if (jsonMatch) {
      try {
        data = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn("Failed to parse Gemini JSON, falling back to raw text extraction or defaults.");
      }
    }

    const maxResThumbnail = videoId 
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : `https://img.youtube.com/vi/${id}/mqdefault.jpg`; // Fallback for playlists usually needs a video ID, but we'll use a placeholder or generic logic if possible. For playlists, usually the first video thumb is used, but we don't have it easily without API. Let's assume videoId is present or use a placeholder.

    // If it's a playlist only URL, we might not have a good thumbnail without a video ID.
    // We will use a generic placeholder if videoId is null.
    const finalThumbnail = videoId ? maxResThumbnail : 'https://picsum.photos/800/450?grayscale';

    return {
      id: id,
      url: url,
      title: data.title || "Unknown Title",
      channel: data.channel || "Unknown Channel",
      views: data.views || "N/A",
      publishedAt: data.publishedAt || "Recently",
      description: data.description || "No description available.",
      thumbnailUrl: finalThumbnail,
      duration: data.duration || (isPlaylist ? "Playlist" : "--:--"),
      isPlaylist: isPlaylist,
      itemCount: isPlaylist ? parseInt(data.duration) || 0 : undefined,
      formats: generateMockFormats(isPlaylist)
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails
    return {
      id: id,
      url: url,
      title: "Video/Playlist Metadata Unavailable",
      channel: "YouTube",
      views: "--",
      publishedAt: "--",
      description: "Could not fetch details. Please check the link and try again.",
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://picsum.photos/800/450',
      duration: "--:--",
      isPlaylist: isPlaylist,
      formats: generateMockFormats(isPlaylist)
    };
  }
};
