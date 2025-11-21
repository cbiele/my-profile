import React, { useEffect, useRef, useState } from 'react';

interface BreakoutGameProps {
  onBack: () => void;
}

export const BreakoutGame: React.FC<BreakoutGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 15;
  const BALL_RADIUS = 6;
  const BRICK_ROW_COUNT = 5;
  const BRICK_COL_COUNT = 8;
  const BRICK_HEIGHT = 24;
  const BRICK_PADDING = 10;
  const BRICK_OFFSET_TOP = 30;
  const BRICK_OFFSET_LEFT = 35;

  const gameState = useRef({
    ballX: 400,
    ballY: 300,
    dx: 4,
    dy: -4,
    paddleX: 350,
    bricks: [] as { x: number; y: number; status: number }[],
    running: true
  });

  const initBricks = () => {
    const bricks = [];
    for (let c = 0; c < BRICK_COL_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        bricks.push({ x: 0, y: 0, status: 1 });
      }
    }
    gameState.current.bricks = bricks;
  };

  useEffect(() => {
    initBricks();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      if (!gameState.current.running) return;

      // Clear
      ctx.fillStyle = '#e7e2d5'; // Sand 200
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bricks
      let activeBricks = 0;
      const brickWidth = (canvas.width - (2 * BRICK_OFFSET_LEFT) - (BRICK_COL_COUNT - 1) * BRICK_PADDING) / BRICK_COL_COUNT;
      
      gameState.current.bricks.forEach((b, i) => {
        if (b.status === 1) {
          activeBricks++;
          const col = Math.floor(i / BRICK_ROW_COUNT);
          const row = i % BRICK_ROW_COUNT;
          const brickX = (col * (brickWidth + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
          const brickY = (row * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
          b.x = brickX;
          b.y = brickY;

          // Gradient for bricks (Terracotta to Turquoise)
          const gradient = ctx.createLinearGradient(brickX, brickY, brickX, brickY + BRICK_HEIGHT);
          gradient.addColorStop(0, '#c2410c'); // Terracotta 500
          gradient.addColorStop(1, '#0d9488'); // Turquoise 500
          
          ctx.beginPath();
          ctx.roundRect(brickX, brickY, brickWidth, BRICK_HEIGHT, 4);
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.closePath();

          // Collision detection
          if (
            gameState.current.ballX > b.x &&
            gameState.current.ballX < b.x + brickWidth &&
            gameState.current.ballY > b.y &&
            gameState.current.ballY < b.y + BRICK_HEIGHT
          ) {
            gameState.current.dy = -gameState.current.dy;
            b.status = 0;
            setScore(s => s + 10);
          }
        }
      });

      if (activeBricks === 0) {
        setWon(true);
        gameState.current.running = false;
      }

      // Ball
      ctx.beginPath();
      ctx.arc(gameState.current.ballX, gameState.current.ballY, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#44403c'; // Stone 900
      ctx.fill();
      ctx.closePath();

      // Paddle
      ctx.beginPath();
      ctx.roundRect(gameState.current.paddleX, canvas.height - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT, 8);
      ctx.fillStyle = '#d97706'; // Amber 600
      ctx.fill();
      ctx.closePath();

      // Movement
      gameState.current.ballX += gameState.current.dx;
      gameState.current.ballY += gameState.current.dy;

      // Wall Collision
      if (gameState.current.ballX + gameState.current.dx > canvas.width - BALL_RADIUS || gameState.current.ballX + gameState.current.dx < BALL_RADIUS) {
        gameState.current.dx = -gameState.current.dx;
      }
      if (gameState.current.ballY + gameState.current.dy < BALL_RADIUS) {
        gameState.current.dy = -gameState.current.dy;
      } else if (gameState.current.ballY + gameState.current.dy > canvas.height - BALL_RADIUS) {
        if (gameState.current.ballX > gameState.current.paddleX && gameState.current.ballX < gameState.current.paddleX + PADDLE_WIDTH) {
           // Paddle Hit
           gameState.current.dy = -gameState.current.dy;
           // Add spin/angle based on where it hit
           const hitPoint = gameState.current.ballX - (gameState.current.paddleX + PADDLE_WIDTH/2);
           gameState.current.dx = hitPoint * 0.15; 
        } else {
           // Game Over
           setGameOver(true);
           gameState.current.running = false;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [won, gameOver]);

  // Controls
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      // Scale for canvas resolution vs CSS size
      const scaleX = canvas.width / rect.width;
      const canvasX = relativeX * scaleX;
      
      if (canvasX > 0 && canvasX < canvas.width) {
        gameState.current.paddleX = canvasX - PADDLE_WIDTH / 2;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.touches[0].clientX - rect.left;
      const scaleX = canvas.width / rect.width;
      const canvasX = relativeX * scaleX;
      
      if (canvasX > 0 && canvasX < canvas.width) {
        gameState.current.paddleX = canvasX - PADDLE_WIDTH / 2;
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
       canvas.addEventListener('mousemove', handleMouseMove);
       canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  const restartGame = () => {
    gameState.current.ballX = 400;
    gameState.current.ballY = 300;
    gameState.current.dx = 4;
    gameState.current.dy = -4;
    gameState.current.paddleX = 350;
    gameState.current.running = true;
    setGameOver(false);
    setWon(false);
    setScore(0);
    initBricks();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-stone-800 tracking-wider flex items-center gap-2">
            <span className="text-terracotta-600">BREAK</span> OUT
          </h2>
          <p className="text-xs text-stone-500">MOUSE OR TOUCH TO SLIDE</p>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-sand-200 rounded-full transition-colors text-stone-500 hover:text-stone-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        </button>
      </div>

      <div className="flex justify-between mb-4 font-mono shrink-0">
        <div className="bg-white px-4 py-2 rounded-lg border border-stone-200 shadow-sm">
          <span className="text-stone-500">SCORE:</span> <span className="text-stone-900 font-bold">{score}</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center w-full relative">
        <canvas 
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full object-contain bg-sand-200 rounded-xl border border-stone-300 shadow-inner cursor-col-resize"
        />

        {(gameOver || won) && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in rounded-xl">
             <h3 className="text-4xl font-bold text-stone-900 mb-2">
               {won ? 'YOU WON!' : 'GAME OVER'}
             </h3>
             <p className="text-stone-600 mb-6">Final Score: {score}</p>
             <button 
               onClick={restartGame}
               className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-500 text-white rounded-xl font-bold shadow-lg shadow-terracotta-500/25 transition-all transform hover:scale-105"
             >
               Play Again
             </button>
           </div>
        )}
      </div>
    </div>
  );
};