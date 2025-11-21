import React, { useState } from 'react';
import { SnakeGame } from './SnakeGame';
import { PongGame } from './PongGame';
import { BreakoutGame } from './BreakoutGame';

type GameType = 'MENU' | 'SNAKE' | 'PONG' | 'BREAKOUT';

export const ArcadeOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeGame, setActiveGame] = useState<GameType>('MENU');

  const renderGame = () => {
    switch (activeGame) {
      case 'SNAKE':
        return <SnakeGame onBack={() => setActiveGame('MENU')} />;
      case 'PONG':
        return <PongGame onBack={() => setActiveGame('MENU')} />;
      case 'BREAKOUT':
        return <BreakoutGame onBack={() => setActiveGame('MENU')} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/30 backdrop-blur-md animate-fade-in p-4">
      <div className="bg-sand-100 border-2 border-terracotta-500/20 rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden relative">
        
        {/* Menu View */}
        {activeGame === 'MENU' && (
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-stone-900 tracking-tighter">
                  DESERT<span className="text-terracotta-600">.ARCADE</span>
                </h2>
                <p className="text-stone-500 text-sm">Take a break. No tokens required.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-200 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-y-auto">
              
              {/* Snake Card */}
              <button 
                onClick={() => setActiveGame('SNAKE')}
                className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-turquoise-500 transition-all hover:shadow-xl hover:shadow-turquoise-500/10 text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-turquoise-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="h-32 bg-sand-200/50 flex items-center justify-center border-b border-stone-100">
                  <div className="grid grid-cols-3 gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                     <div className="w-4 h-4 bg-turquoise-600 rounded-sm"></div>
                     <div className="w-4 h-4 bg-turquoise-600 rounded-sm"></div>
                     <div className="w-4 h-4 bg-turquoise-600 rounded-sm"></div>
                     <div className="w-4 h-4 bg-transparent"></div>
                     <div className="w-4 h-4 bg-transparent"></div>
                     <div className="w-4 h-4 bg-turquoise-600 rounded-sm"></div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-1">Turquoise Snake</h3>
                  <p className="text-stone-500 text-sm">The classic grid crawler. Eat bits, get long, don't crash.</p>
                </div>
              </button>

              {/* Pong Card */}
              <button 
                onClick={() => setActiveGame('PONG')}
                className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-terracotta-500 transition-all hover:shadow-xl hover:shadow-terracotta-500/10 text-left"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-terracotta-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="h-32 bg-sand-200/50 flex items-center justify-center border-b border-stone-100">
                    <div className="w-full px-8 flex justify-between items-center opacity-60 group-hover:opacity-100">
                       <div className="w-2 h-8 bg-stone-400 rounded-full"></div>
                       <div className="w-3 h-3 bg-stone-400 rounded-full"></div>
                       <div className="w-2 h-8 bg-terracotta-500 rounded-full"></div>
                    </div>
                 </div>
                 <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-1">Desert Pong</h3>
                  <p className="text-stone-500 text-sm">The original tennis sim. Defeat the AI in a match to 5.</p>
                </div>
              </button>

              {/* Breakout Card */}
              <button 
                onClick={() => setActiveGame('BREAKOUT')}
                className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-500 transition-all hover:shadow-xl hover:shadow-amber-500/10 text-left"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="h-32 bg-sand-200/50 flex flex-col items-center justify-center gap-2 border-b border-stone-100">
                    <div className="flex gap-1 opacity-60 group-hover:opacity-100">
                       <div className="w-8 h-3 bg-terracotta-500 rounded-sm"></div>
                       <div className="w-8 h-3 bg-turquoise-600 rounded-sm"></div>
                       <div className="w-8 h-3 bg-transparent rounded-sm border border-amber-500/30 border-dashed"></div>
                    </div>
                    <div className="w-2 h-2 bg-stone-400 rounded-full mt-2"></div>
                    <div className="w-12 h-2 bg-amber-500 rounded-full mt-2"></div>
                 </div>
                 <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-1">Breakout</h3>
                  <p className="text-stone-500 text-sm">Smash the bricks. Keep the ball alive. Pure arcade action.</p>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* Game View */}
        {activeGame !== 'MENU' && (
          <div className="flex-1 p-4 md:p-6 overflow-hidden">
            {renderGame()}
          </div>
        )}

      </div>
    </div>
  );
};