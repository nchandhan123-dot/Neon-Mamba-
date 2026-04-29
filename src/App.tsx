import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 font-sans selection:bg-neon-magenta selection:text-white pb-12 flex flex-col pt-8 lg:pt-0">
      {/* Header */}
      <header className="p-6 md:p-8 text-center lg:text-left lg:px-16 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl lg:sticky top-0 z-50 shadow-2xl shadow-black/50">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-magenta tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] uppercase">
          Neon<span className="font-light opacity-80">Synth</span>
        </h1>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-start justify-center flex-1">
        {/* Game Side - Center focus */}
        <section className="w-full lg:w-3/5 flex justify-center order-1 focus-within:ring-0">
           <SnakeGame />
        </section>

        {/* Music Player Side */}
        <aside className="w-full lg:w-2/5 flex flex-col gap-8 order-2 sticky top-32">
           <div className="text-center lg:text-left space-y-4 max-w-sm mx-auto lg:mx-0">
              <h2 className="text-2xl font-bold text-white tracking-wide uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Audio Stream</h2>
              <p className="text-neutral-400 text-sm leading-relaxed border-l-2 border-neon-magenta pl-4 italic">
                Playing AI-generated synthetic waveforms. Control the playback below while surviving the grid.
              </p>
           </div>
           <MusicPlayer />
        </aside>
      </main>
    </div>
  );
}
