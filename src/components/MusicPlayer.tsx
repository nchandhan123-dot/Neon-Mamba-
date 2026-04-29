import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Cybernetic Horizon (AI Generated)",
    artist: "Neural Synths",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    gradient: "from-neon-cyan to-blue-600"
  },
  {
    id: 2,
    title: "Neon Pulse (AI Generated)",
    artist: "Algorithmia",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    gradient: "from-neon-magenta to-purple-600"
  },
  {
    id: 3,
    title: "Grid Runner (AI Generated)",
    artist: "Deep Learning",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    gradient: "from-neon-lime to-green-600"
  }
];

export const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);

  const handlePrev = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-sm ml-auto mr-auto lg:m-0 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(255,0,255,0.1)]">
      {/* Neon background accent */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-magenta blur-[100px] opacity-30 rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-cyan blur-[100px] opacity-30 rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-6 ">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 shrink-0 rounded-lg bg-gradient-to-br ${track.gradient} shadow-lg shadow-black flex items-center justify-center border border-white/10`}>
            {/* Spinning fake record/CD */}
            <div className={`w-8 h-8 rounded-full border-4 border-white/20 bg-black/20 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}></div>
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-white font-bold text-lg truncate drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{track.title}</h3>
            <p className="text-neon-cyan text-sm font-mono truncate">{track.artist}</p>
          </div>
        </div>

        <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${track.gradient} shadow-[0_0_10px_currentColor] transition-all duration-300 ease-linear`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-white">
          <button onClick={toggleMute} className="p-2 text-neutral-400 hover:text-white transition-colors focus:outline-none">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <div className="flex items-center gap-4">
            <button onClick={handlePrev} className="p-2 text-white hover:text-neon-magenta transition-colors hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] focus:outline-none">
              <SkipBack size={24} fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay} 
              className="p-4 rounded-full bg-white text-black transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.6)] focus:outline-none flex items-center justify-center w-14 h-14"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>

            <button onClick={handleNext} className="p-2 text-white hover:text-neon-cyan transition-colors hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] focus:outline-none">
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
    </div>
  );
};
