import React from 'react';
import { VideoMetadata } from '../types';
import { Clock, Eye, Calendar, Film, ListVideo, ExternalLink, Bookmark, Trash2 } from 'lucide-react';

interface VideoCardProps {
  data: VideoMetadata;
  isSaved?: boolean;
  onToggleSave?: (video: VideoMetadata) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ data, isSaved = false, onToggleSave }) => {
  return (
    <div className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-fade-in-up relative">
      <div className="md:w-5/12 relative group overflow-hidden">
        <img 
          src={data.thumbnailUrl} 
          alt={data.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-mono">
          {data.duration}
        </div>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      </div>

      <div className="p-6 md:w-7/12 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold text-white leading-tight line-clamp-2" title={data.title}>
              {data.title}
            </h2>
            <div className="flex items-center gap-2">
                {onToggleSave && (
                    <button 
                        onClick={() => onToggleSave(data)}
                        className={`p-2 rounded-lg transition-all ${isSaved 
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                            : 'bg-slate-700/50 text-slate-400 hover:bg-brand-500/10 hover:text-brand-400'}`}
                        title={isSaved ? "Remove from Library" : "Save to Library"}
                    >
                        {isSaved ? <Trash2 className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                )}
                <a 
                href={data.url} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-slate-700/50 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                <ExternalLink className="w-5 h-5" />
                </a>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-brand-400 font-medium">
            {data.isPlaylist ? <ListVideo className="w-4 h-4" /> : <Film className="w-4 h-4" />}
            <span>{data.channel}</span>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-500" />
              <span>{data.views}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>{data.publishedAt}</span>
            </div>
            {data.isPlaylist && (
              <div className="flex items-center gap-1.5">
                <ListVideo className="w-4 h-4 text-slate-500" />
                <span>{data.itemCount} Videos</span>
              </div>
            )}
            {!data.isPlaylist && (
                 <div className="flex items-center gap-1.5">
                 <Clock className="w-4 h-4 text-slate-500" />
                 <span>{data.duration}</span>
               </div>
            )}
          </div>

          <p className="mt-4 text-slate-400 text-sm line-clamp-3 leading-relaxed border-t border-slate-700/50 pt-4">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
