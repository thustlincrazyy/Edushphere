import React, { useState } from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

export function SimonSays({ onComplete }: { onComplete: (score: number) => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);

  const playSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setActiveColor(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setActiveColor(null);
    }
    setGameState('playing');
  };

  const startNextRound = (currentSequence: number[]) => {
    const nextSequence = [...currentSequence, Math.floor(Math.random() * 4)];
    setSequence(nextSequence);
    setUserSequence([]);
    setGameState('showing');
    playSequence(nextSequence);
  };

  const handleColorClick = (index: number) => {
    if (gameState !== 'playing') return;

    const newUserSeq = [...userSequence, index];
    setUserSequence(newUserSeq);

    if (index !== sequence[newUserSeq.length - 1]) {
      setGameState('ended');
      onComplete(score);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setScore(s => s + 1);
      setTimeout(() => startNextRound(sequence), 1000);
    }
  };

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="text-6xl mb-6">🎯</div>
        <h2 className="text-3xl font-bold mb-4">Simon Says</h2>
        <p className="text-muted-foreground mb-8">Watch the pattern and repeat it. The sequence gets longer every round!</p>
        <Button size="lg" onClick={() => startNextRound([])} className="rounded-full">Start Game</Button>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <h2 className="text-4xl font-bold mb-2">Game Over!</h2>
        <p className="text-2xl text-muted-foreground mb-8">Score: {score}</p>
        <Button size="lg" onClick={() => startNextRound([])} className="rounded-full">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-8 text-2xl font-bold">Round: {sequence.length} | Score: {score}</div>
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {COLORS.map((color, i) => (
          <motion.div
            key={i}
            onClick={() => handleColorClick(i)}
            animate={{ 
              scale: activeColor === i ? 1.1 : 1, 
              filter: activeColor === i ? 'brightness(1.5)' : 'brightness(1)' 
            }}
            className={`w-24 h-24 md:w-40 md:h-40 rounded-2xl md:rounded-[2.5rem] cursor-pointer shadow-lg transition-all ${color} ${activeColor === i ? 'opacity-100 ring-4 ring-white' : 'opacity-60 hover:opacity-80'}`}
          />
        ))}
      </div>
      <div className="mt-8 font-medium text-primary">
        {gameState === 'showing' ? "Watch Carefully..." : "Your Turn!"}
      </div>
    </div>
  );
}
