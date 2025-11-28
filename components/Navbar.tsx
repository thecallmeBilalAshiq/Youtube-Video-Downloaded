import React from 'react';
import { Youtube, Download, Menu, Library, Home } from 'lucide-react';

interface NavbarProps {
  onLibraryClick: () => void;
  onHomeClick: () => void;
  activeView: 'home' | 'library';
}

const Navbar: React.FC<NavbarProps> = ({ onLibraryClick, onHomeClick, activeView }) => {
  return (
    <nav className="w-full h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={onHomeClick}
      >
        <div className="bg-red-600 p-1.5 rounded-lg shadow-lg shadow-red-500/20">
          <Youtube className="w-6 h-6 text-white fill-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          StreamFetch
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-6 text-slate-400 text-sm font-medium">
        <button 
          onClick={onHomeClick}
          className={`flex items-center gap-2 transition-colors ${activeView === 'home' ? 'text-white' : 'hover:text-white'}`}
        >
          <Home className="w-4 h-4" />
          Home
        </button>
        <button 
          onClick={onLibraryClick}
          className={`flex items-center gap-2 transition-colors ${activeView === 'library' ? 'text-white' : 'hover:text-white'}`}
        >
          <Library className="w-4 h-4" />
          Saved Videos
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 hover:bg-slate-800 rounded-md text-slate-400">
          <Menu className="w-5 h-5" />
        </button>
        <button className="hidden md:flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-brand-500/20">
          <Download className="w-4 h-4" />
          <span>Desktop App</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
