import React, { useState, useEffect, useCallback, useRef } from 'react';

// Constants
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const SWIPE_THRESHOLD = 30;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface SnakeGameProps {
  onBack: () => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onBack }) => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPaused, setIsPaused] = useState(false);
  
  const directionRef = useRef<Direction>('RIGHT');
  const speedRef = useRef<number>(INITIAL_SPEED);
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    while (true) {
      const newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) return newFood;
    }
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    speedRef.current = INITIAL_SPEED;
    setIsPaused(false);
  };

  const changeDirection = useCallback((newDir: Direction) => {
    const currentDir = directionRef.current;
    if (newDir === 'UP' && currentDir !== 'DOWN') directionRef.current = 'UP';
    if (newDir === 'DOWN' && currentDir !== 'UP') directionRef.current = 'DOWN';
    if (newDir === 'LEFT' && currentDir !== 'RIGHT') directionRef.current = 'LEFT';
    if (newDir === 'RIGHT' && currentDir !== 'LEFT') directionRef.current = 'RIGHT';
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }
      switch (e.key) {
        case 'ArrowUp': changeDirection('UP'); break;
        case 'ArrowDown': changeDirection('DOWN'); break;
        case 'ArrowLeft': changeDirection('LEFT'); break;
        case 'ArrowRight': changeDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, changeDirection]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartRef.current.x - touchEndX;
    const diffY = touchStartRef.current.y - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > SWIPE_THRESHOLD) {
        if (diffX > 0) changeDirection('LEFT');
        else changeDirection('RIGHT');
      }
    } else {
      if (Math.abs(diffY) > SWIPE_THRESHOLD) {
        if (diffY > 0) changeDirection('UP');
        else changeDirection('DOWN');
      }
    }
    touchStartRef.current = null;
  };

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };
        setDirection(directionRef.current);

        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE || 
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snakeHighScore', newScore.toString());
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
          speedRef.current = Math.max(50, speedRef.current - SPEED_INCREMENT);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const gameInterval = setInterval(moveSnake, speedRef.current);
    return () => clearInterval(gameInterval);
  }, [food, gameOver, isPaused, generateFood, highScore]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-stone-800 tracking-wider flex items-center gap-2">
            <span className="text-turquoise-600">TURQUOISE</span> SNAKE
          </h2>
          <p className="text-xs text-stone-500">ARROWS OR SWIPE</p>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-sand-200 rounded-full transition-colors text-stone-500 hover:text-stone-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      <div className="flex justify-between mb-4 text-sm font-mono shrink-0">
        <div className="bg-white px-4 py-2 rounded-lg border border-stone-200 shadow-sm">
          <span className="text-stone-500">SCORE:</span> <span className="text-stone-900 font-bold">{score}</span>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-stone-200 shadow-sm">
          <span className="text-stone-500">BEST:</span> <span className="text-turquoise-600 font-bold">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 min-h-0 flex items-center justify-center w-full">
        <div 
          className="relative aspect-square w-full max-h-full bg-sand-200 rounded-xl border-2 border-stone-300 overflow-hidden shadow-inner touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            backgroundImage: 'radial-gradient(#d6d3d1 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          <div 
            className="bg-terracotta-600 rounded-full shadow-sm animate-pulse transform scale-75"
            style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1 }}
          />
          {snake.map((segment, i) => (
            <div 
              key={`${segment.x}-${segment.y}-${i}`}
              className={`${i === 0 ? 'bg-turquoise-600 z-10' : 'bg-turquoise-500'} rounded-sm border border-sand-200`}
              style={{ gridColumnStart: segment.x + 1, gridRowStart: segment.y + 1 }}
            >
              {i === 0 && (
                <div className="w-full h-full relative">
                  <div className={`absolute bg-stone-900 w-[20%] h-[20%] rounded-full ${
                    directionRef.current === 'UP' ? 'top-1 left-1' : directionRef.current === 'DOWN' ? 'bottom-1 left-1' : directionRef.current === 'LEFT' ? 'top-1 left-1' : 'top-1 right-1'
                  }`} />
                  <div className={`absolute bg-stone-900 w-[20%] h-[20%] rounded-full ${
                    directionRef.current === 'UP' ? 'top-1 right-1' : directionRef.current === 'DOWN' ? 'bottom-1 right-1' : directionRef.current === 'LEFT' ? 'bottom-1 left-1' : 'bottom-1 right-1'
                  }`} />
                </div>
              )}
            </div>
          ))}

          {gameOver && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-fade-in">
              <h3 className="text-3xl font-bold text-stone-900 mb-2">GAME OVER</h3>
              <p className="text-stone-600 mb-6">Score: {score}</p>
              <button onClick={resetGame} className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-500 text-white rounded-xl font-bold shadow-lg shadow-terracotta-500/25 transition-all transform hover:scale-105 active:scale-95">
                Play Again
              </button>
            </div>
          )}
          
          {isPaused && !gameOver && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
               <h3 className="text-2xl font-bold text-stone-800 tracking-widest">PAUSED</h3>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};