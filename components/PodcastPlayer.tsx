import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, X } from 'lucide-react';
import { ContentItem } from '../types';

interface PodcastPlayerProps {
  episode: ContentItem | null;
  onClose: () => void;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ episode, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (episode) {
      setIsPlaying(true);
      setProgress(0);
    }
  }, [episode]);

  // Simulate progress
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!episode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 md:px-8 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        <img src={episode.thumbnail} alt="cover" className="w-12 h-12 rounded object-cover" />
        <div className="hidden md:block overflow-hidden">
          <h4 className="text-sm font-semibold text-white truncate">{episode.title}</h4>
          <p className="text-xs text-zinc-400 truncate">{episode.author.name}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-6">
          <button className="text-zinc-400 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all shadow-lg shadow-indigo-500/20"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md flex items-center gap-3 text-xs text-zinc-500 font-mono">
          <span>02:14</span>
          <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full relative" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span>{episode.duration}</span>
        </div>
      </div>

      {/* Volume & Close */}
      <div className="w-1/4 flex items-center justify-end gap-4">
        <div className="hidden md:flex items-center gap-2 text-zinc-400">
          <Volume2 size={18} />
          <div className="w-20 h-1 bg-zinc-800 rounded-full">
            <div className="w-2/3 h-full bg-zinc-500 rounded-full"></div>
          </div>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-red-400 transition-colors">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default PodcastPlayer;
