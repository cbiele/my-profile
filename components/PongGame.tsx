import React, { useEffect, useRef, useState } from 'react';

interface PongGameProps {
  onBack: () => void;
}

export const PongGame: React.FC<PongGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Game Constants
  const PADDLE_HEIGHT = 80;
  const PADDLE_WIDTH = 12;
  const BALL_SIZE = 10;
  const WINNING_SCORE = 5;

  // Game State (Refs for performance)
  const gameState = useRef({
    playerY: 250,
    aiY: 250,
    ballX: 400,
    ballY: 300,
    ballSpeedX: 5,
    ballSpeedY: 3,
    running: true
  });

  // Reset Ball
  const resetBall = () => {
    gameState.current.ballX = 400;
    gameState.current.ballY = 300;
    gameState.current.ballSpeedX = -gameState.current.ballSpeedX;
    gameState.current.ballSpeedY = (Math.random() * 6) - 3;
  };

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (!gameState.current.running || gameOver) return;

      // Update AI
      const aiCenter = gameState.current.aiY + PADDLE_HEIGHT / 2;
      if (aiCenter < gameState.current.ballY - 35) {
        gameState.current.aiY += 4;
      } else if (aiCenter > gameState.current.ballY + 35) {
        gameState.current.aiY -= 4;
      }
      // Clamp AI
      gameState.current.aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, gameState.current.aiY));

      // Update Ball
      gameState.current.ballX += gameState.current.ballSpeedX;
      gameState.current.ballY += gameState.current.ballSpeedY;

      // Wall Collisions
      if (gameState.current.ballY <= 0 || gameState.current.ballY >= canvas.height) {
        gameState.current.ballSpeedY = -gameState.current.ballSpeedY;
      }

      // Paddle Collisions
      // Player
      if (
        gameState.current.ballX <= PADDLE_WIDTH + 10 &&
        gameState.current.ballY >= gameState.current.playerY &&
        gameState.current.ballY <= gameState.current.playerY + PADDLE_HEIGHT
      ) {
        gameState.current.ballSpeedX = -gameState.current.ballSpeedX;
        const deltaY = gameState.current.ballY - (gameState.current.playerY + PADDLE_HEIGHT / 2);
        gameState.current.ballSpeedY = deltaY * 0.25;
        // Speed up
        gameState.current.ballSpeedX *= 1.05;
      }

      // AI
      if (
        gameState.current.ballX >= canvas.width - PADDLE_WIDTH - 10 &&
        gameState.current.ballY >= gameState.current.aiY &&
        gameState.current.ballY <= gameState.current.aiY + PADDLE_HEIGHT
      ) {
        gameState.current.ballSpeedX = -gameState.current.ballSpeedX;
        const deltaY = gameState.current.ballY - (gameState.current.aiY + PADDLE_HEIGHT / 2);
        gameState.current.ballSpeedY = deltaY * 0.25;
      }

      // Scoring
      if (gameState.current.ballX < 0) {
        // AI Scores
        setScore(prev => {
          const newScore = { ...prev, ai: prev.ai + 1 };
          if (newScore.ai >= WINNING_SCORE) {
            setGameOver(true);
            setWinner('AI');
            gameState.current.running = false;
          }
          return newScore;
        });
        resetBall();
      } else if (gameState.current.ballX > canvas.width) {
        // Player Scores
        setScore(prev => {
          const newScore = { ...prev, player: prev.player + 1 };
          if (newScore.player >= WINNING_SCORE) {
            setGameOver(true);
            setWinner('PLAYER');
            gameState.current.running = false;
          }
          return newScore;
        });
        resetBall();
      }

      // Draw
      // Background (Sand 200)
      ctx.fillStyle = '#e7e2d5'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center Line
      ctx.strokeStyle = '#a8a29e'; // Stone 400
      ctx.setLineDash([10, 15]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.fillStyle = '#0d9488'; // Turquoise 500 (Player)
      ctx.fillRect(10, gameState.current.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
      
      ctx.fillStyle = '#c2410c'; // Terracotta 500 (Enemy)
      ctx.fillRect(canvas.width - PADDLE_WIDTH - 10, gameState.current.aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Ball
      ctx.fillStyle = '#44403c'; // Stone 900
      ctx.beginPath();
      ctx.arc(gameState.current.ballX, gameState.current.ballY, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameOver]);

  // Controls
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      // Center paddle on mouse
      gameState.current.playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, mouseY - PADDLE_HEIGHT / 2));
    };

    const handleTouchMove = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      e.preventDefault(); // Prevent scrolling
      const rect = canvas.getBoundingClientRect();
      const touchY = e.touches[0].clientY - rect.top;
      gameState.current.playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, touchY - PADDLE_HEIGHT / 2));
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
    setScore({ player: 0, ai: 0 });
    setGameOver(false);
    setWinner(null);
    gameState.current.running = true;
    resetBall();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-stone-800 tracking-wider flex items-center gap-2">
            <span className="text-terracotta-600">DESERT</span> PONG
          </h2>
          <p className="text-xs text-stone-500">MOUSE OR TOUCH TO MOVE</p>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-sand-200 rounded-full transition-colors text-stone-500 hover:text-stone-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        </button>
      </div>

      <div className="flex justify-between mb-4 font-mono shrink-0 px-8">
        <div className="text-center">
          <div className="text-xs text-stone-500">YOU</div>
          <div className="text-3xl font-bold text-turquoise-600">{score.player}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-stone-500">CPU</div>
          <div className="text-3xl font-bold text-terracotta-500">{score.ai}</div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center w-full relative">
        <canvas 
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full object-contain bg-sand-200 rounded-xl border border-stone-300 shadow-inner cursor-none"
        />
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in rounded-xl">
            <h3 className="text-4xl font-bold text-stone-900 mb-2">
              {winner === 'PLAYER' ? 'YOU WIN!' : 'GAME OVER'}
            </h3>
            <button 
              onClick={restartGame}
              className="mt-6 px-6 py-3 bg-terracotta-600 hover:bg-terracotta-500 text-white rounded-xl font-bold shadow-lg shadow-terracotta-500/25 transition-all transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};