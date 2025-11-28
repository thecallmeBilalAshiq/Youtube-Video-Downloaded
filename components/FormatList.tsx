import React, { useState } from 'react';
import { VideoFormat } from '../types';
import { Download, CheckCircle, FileVideo, Music, AlertCircle } from 'lucide-react';
import { downloadBlob } from '../utils/youtubeUtils';

interface FormatListProps {
  formats: VideoFormat[];
  videoTitle: string;
}

const FormatList: React.FC<FormatListProps> = ({ formats, videoTitle }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [completedId, setCompletedId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDownload = (format: VideoFormat) => {
    if (downloadingId) return;

    setDownloadingId(format.id);
    setProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          setCompletedId(format.id);
          
          // Generate a realistic looking file name and blob
          const extension = format.format.toLowerCase();
          const safeTitle = videoTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
          const filename = `${safeTitle}_${format.quality}.${extension}`;
          
          // Create a 1MB dummy buffer to simulate file size
          const dummyData = new Uint8Array(1024 * 1024); 
          const mimeType = format.type === 'video' ? `video/${extension}` : `audio/${extension}`;
          const blob = new Blob([dummyData], { type: mimeType });

          downloadBlob(blob, filename);

          setTimeout(() => setCompletedId(null), 3000);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
  };

  return (
    <div className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mt-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-brand-400" />
          Available Formats
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-brand-900/30 text-brand-400 rounded border border-brand-500/20">
          Fast Server
        </span>
      </div>

      <div className="space-y-3">
        {formats.map((format) => (
          <div 
            key={format.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-brand-500/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${format.type === 'video' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                {format.type === 'video' ? <FileVideo className="w-6 h-6" /> : <Music className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-lg">{format.quality}</span>
                    <span className="text-xs font-mono text-slate-500 px-1.5 py-0.5 bg-slate-800 rounded uppercase border border-slate-700">
                        {format.format}
                    </span>
                    {!format.hasAudio && (
                        <span className="text-xs text-red-400 border border-red-900/50 px-1.5 py-0.5 rounded bg-red-900/10" title="Video Only (No Sound)">
                            Muted
                        </span>
                    )}
                </div>
                <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                   <span>{format.size}</span>
                   {format.fps && <span className="w-1 h-1 rounded-full bg-slate-600"></span>}
                   {format.fps && <span>{format.fps}fps</span>}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDownload(format)}
              disabled={!!downloadingId}
              className={`
                relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all
                ${completedId === format.id 
                  ? 'bg-green-500 text-white cursor-default' 
                  : 'bg-slate-700 hover:bg-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/20 active:scale-95'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {downloadingId === format.id ? (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{progress}%</span>
                    <div className="w-16 h-1.5 bg-slate-900/50 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-white transition-all duration-200"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
              ) : completedId === format.id ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Done</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex gap-3 text-yellow-200/80 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-500" />
        <p>
            Files are downloaded to your device storage. Due to browser restrictions, these are simulated files for the demo. In a production environment, this would connect to a media processing server.
        </p>
      </div>
    </div>
  );
};

export default FormatList;
