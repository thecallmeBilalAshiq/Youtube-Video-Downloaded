import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import InputSection from './components/InputSection';
import VideoCard from './components/VideoCard';
import FormatList from './components/FormatList';
import { VideoMetadata, AppState } from './types';
import { fetchVideoMetadata } from './services/geminiService';
import { getSavedVideos, saveVideo, removeVideo } from './utils/youtubeUtils';
import { Toaster, toast } from 'react-hot-toast';
import { Library, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [savedVideos, setSavedVideos] = useState<VideoMetadata[]>([]);
  const [view, setView] = useState<'home' | 'library'>('home');

  useEffect(() => {
    setSavedVideos(getSavedVideos());
  }, []);

  const handleSearch = async (url: string, videoId: string | null, playlistId: string | null) => {
    setView('home');
    setAppState(AppState.LOADING);
    setVideoData(null);

    try {
      const data = await fetchVideoMetadata(url, videoId, playlistId);
      setVideoData(data);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      toast.error("Failed to fetch video details");
    }
  };

  const toggleSaveVideo = (video: VideoMetadata) => {
    const isSaved = savedVideos.some(v => v.id === video.id);
    if (isSaved) {
      const newHistory = removeVideo(video.id);
      setSavedVideos(newHistory);
      toast.success("Removed from Library");
    } else {
      const success = saveVideo(video);
      if (success) {
        setSavedVideos(getSavedVideos());
        toast.success("Saved to Library");
      }
    }
  };

  const handleLibraryClick = () => {
    setView('library');
    setSavedVideos(getSavedVideos());
  };

  const handleHomeClick = () => {
    setView('home');
  };

  const loadFromLibrary = (video: VideoMetadata) => {
    setVideoData(video);
    setAppState(AppState.SUCCESS);
    setView('home');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans selection:bg-brand-500/30">
      <Navbar 
        onLibraryClick={handleLibraryClick} 
        onHomeClick={handleHomeClick}
        activeView={view}
      />
      
      <main className="flex-grow flex flex-col items-center pb-20 relative">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="z-10 w-full">
            {view === 'home' && (
              <>
                <InputSection onSearch={handleSearch} isLoading={appState === AppState.LOADING} />

                <div className="w-full max-w-3xl mx-auto px-4 mt-10 transition-all duration-500">
                    {appState === AppState.SUCCESS && videoData && (
                        <div className="animate-fade-in space-y-8">
                            <VideoCard 
                              data={videoData} 
                              isSaved={savedVideos.some(v => v.id === videoData.id)}
                              onToggleSave={toggleSaveVideo}
                            />
                            <FormatList formats={videoData.formats} videoTitle={videoData.title} />
                        </div>
                    )}

                    {appState === AppState.IDLE && (
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                            <FeatureCard 
                                icon="⚡" 
                                title="Ultra Fast" 
                                desc="Optimized processing engine for quick link analysis." 
                            />
                            <FeatureCard 
                                icon="🔒" 
                                title="Secure" 
                                desc="No data logging. Your downloads are private." 
                            />
                            <FeatureCard 
                                icon="💎" 
                                title="High Quality" 
                                desc="Support for 4K, 8K, and 60fps streams." 
                            />
                        </div>
                    )}
                </div>
              </>
            )}

            {view === 'library' && (
              <div className="w-full max-w-5xl mx-auto px-4 mt-10">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="bg-brand-600 p-2 rounded-xl">
                      <Library className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Saved Videos</h2>
                    <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-sm border border-slate-700">
                      {savedVideos.length} items
                    </span>
                 </div>

                 {savedVideos.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-800 border-dashed">
                       <Library className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                       <h3 className="text-xl font-semibold text-slate-300">Your library is empty</h3>
                       <p className="text-slate-500 mt-2">Save videos here to download them later.</p>
                       <button 
                         onClick={handleHomeClick}
                         className="mt-6 px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-medium transition-all"
                       >
                         Find Videos
                       </button>
                    </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {savedVideos.map(video => (
                        <div key={video.id} className="relative group">
                          <VideoCard 
                            data={video} 
                            isSaved={true}
                            onToggleSave={toggleSaveVideo}
                          />
                          <button 
                            onClick={() => loadFromLibrary(video)}
                            className="absolute bottom-6 right-6 z-10 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-black/50 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300"
                          >
                            <span>Download Options</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                     ))}
                   </div>
                 )}
              </div>
            )}
        </div>
      </main>

      <footer className="w-full py-6 text-center text-slate-600 text-sm z-10 border-t border-slate-800 bg-slate-900 mt-auto">
        <p>&copy; {new Date().getFullYear()} StreamFetch. Demo Application.</p>
      </footer>
      
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155'
        }
      }} />
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
    <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 text-center hover:bg-slate-800/50 transition-colors cursor-default">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{desc}</p>
    </div>
);

export default App;
