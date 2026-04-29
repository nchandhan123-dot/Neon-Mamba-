import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const GAME_SPEED = 120; // ms per frame

type Point = { x: number; y: number };

export const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [nextDir, setNextDir] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default page scrolling for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key === 'Enter') resetGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y === 0) setNextDir({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y === 0) setNextDir({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x === 0) setNextDir({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x === 0) setNextDir({ x: 1, y: 0 });
          break;
        case ' ': // Spacebar to Pause
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir, gameOver]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = nextDir;
        setDir(currentDir); // Lock in the valid direction for this frame

        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        // Collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food interaction
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          spawnFood(newSnake);
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [nextDir, food, gameOver, isPaused]);

  const handleGameOver = () => {
    setGameOver(true);
    setHighScore((prev) => Math.max(prev, score));
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 1, y: 0 });
    setNextDir({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    spawnFood([{ x: 10, y: 10 }]);
  };

  const spawnFood = (currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  };

  // Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellW = width / GRID_SIZE;
    const cellH = height / GRID_SIZE;

    // Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid Lines
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= width; i += cellW) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    // Draw Food (Neon Magenta Glow)
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    const centerX = food.x * cellW + cellW / 2;
    const centerY = food.y * cellH + cellH / 2;
    ctx.arc(centerX, centerY, cellW / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0; // Reset

    // Draw Snake (Neon Lime Glow)
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#39ff14';
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#39ff14';
      ctx.fillRect(segment.x * cellW + 1, segment.y * cellH + 1, cellW - 2, cellH - 2);
    });
    ctx.shadowBlur = 0; // Reset

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[400px]">
      <div className="flex justify-between w-full px-5 py-3 border-b-2 border-neon-cyan shadow-[0_4px_15px_rgba(0,243,255,0.15)] bg-neutral-900 rounded-t-xl text-neon-cyan font-mono text-xl uppercase tracking-widest">
        <div>Score: <span className="text-white">{score}</span></div>
        <div>High: <span className="text-white">{highScore}</span></div>
      </div>

      <div className="relative group w-full aspect-square">
        {/* Glow behind the canvas */}
        <div className="absolute -inset-1 bg-gradient-to-br from-neon-magenta to-neon-cyan rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 pointer-events-none"></div>
        
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative w-full h-full bg-black rounded-lg border border-neutral-800 z-10"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg border-2 border-neon-magenta text-neon-magenta z-20 backdrop-blur-sm">
            <h2 className="text-4xl font-black mb-4 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,0,255,0.8)] text-center">System<br/>Failure</h2>
            <p className="mb-6 font-mono text-white">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-neutral-900 border border-neon-magenta hover:bg-neon-magenta hover:text-black transition-all font-bold uppercase tracking-widest text-sm focus:outline-none hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] rounded"
            >
              Reboot System
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-20 backdrop-blur-sm border-2 border-white/20">
            <h2 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse">Paused</h2>
          </div>
        )}
      </div>

      <div className="text-neutral-500 font-mono text-xs sm:text-sm text-center leading-relaxed max-w-[300px]">
        Use <span className="text-neon-cyan brightness-125">Arrow Keys</span> or <span className="text-neon-cyan brightness-125">WASD</span> to move.<br/>
        Press <span className="text-neon-cyan brightness-125">Space</span> to pause.
      </div>
    </div>
  );
};
