import React, { useState } from 'react';
import { Search, Link as LinkIcon, Loader2, XCircle } from 'lucide-react';
import { extractVideoId, extractPlaylistId } from '../utils/youtubeUtils';

interface InputSectionProps {
  onSearch: (url: string, videoId: string | null, playlistId: string | null) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onSearch, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) return;

    const videoId = extractVideoId(url);
    const playlistId = extractPlaylistId(url);

    if (!videoId && !playlistId) {
      setError('Invalid YouTube URL. Please provide a valid video or playlist link.');
      return;
    }

    onSearch(url, videoId, playlistId);
  };

  const handleClear = () => {
    setUrl('');
    setError('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
        Download YouTube <span className="text-brand-400">Videos & Playlists</span>
      </h1>
      <p className="text-slate-400 mb-8 text-lg">
        Convert and download in 4K, 1080p, MP3, and more. Fast, free, and secure.
      </p>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <LinkIcon className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
          placeholder="Paste YouTube link here..."
          className={`w-full bg-slate-800/50 border-2 ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-brand-500'} text-white rounded-2xl py-4 pl-12 pr-32 outline-none transition-all shadow-xl backdrop-blur-sm placeholder:text-slate-600 focus:bg-slate-800`}
        />
        
        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
          {url && !isLoading && (
             <button 
             type="button"
             onClick={handleClear}
             className="text-slate-500 hover:text-white transition-colors p-1"
           >
             <XCircle className="w-5 h-5" />
           </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-brand-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing</span>
              </>
            ) : (
              <>
                <span>Start</span>
                <Search className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-3 text-red-400 text-sm flex items-center justify-center gap-2 animate-pulse">
           <XCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-500">
        <span className="px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700">No software required</span>
        <span className="px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700">Support 4K & 8K</span>
        <span className="px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700">Mobile Friendly</span>
      </div>
    </div>
  );
};

export default InputSection;
