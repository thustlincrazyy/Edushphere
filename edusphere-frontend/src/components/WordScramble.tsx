import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const WORDS = [
  'ALGEBRA', 'SCIENCE', 'HISTORY', 'PHYSICS', 'BIOLOGY', 'PYTHON', 'REACT', 'CODING',
  'GRAVITY', 'ENERGY', 'EQUATION', 'CELLS', 'GENETICS', 'GEOGRAPHY', 'LITERATURE'
];

export function WordScramble({ onComplete }: { onComplete: (score: number) => void }) {
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');

  const nextWord = () => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(w);
    setScrambled(w.split('').sort(() => Math.random() - 0.5).join(''));
    setInput('');
  };

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState('ended');
      onComplete(score);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toUpperCase() === word) {
      setScore(s => s + 20);
      nextWord();
    } else {
      setInput('');
    }
  };

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="text-6xl mb-6">🔤</div>
        <h2 className="text-3xl font-bold mb-4">Word Scramble</h2>
        <p className="text-muted-foreground mb-8">Unscramble educational words as fast as you can! 20 points per word.</p>
        <Button size="lg" onClick={() => { setGameState('playing'); nextWord(); }} className="rounded-full">Start Game</Button>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <h2 className="text-4xl font-bold mb-2">Time's Up!</h2>
        <p className="text-2xl text-muted-foreground mb-8">Score: {score}</p>
        <Button size="lg" onClick={() => { setGameState('playing'); setTimeLeft(60); setScore(0); nextWord(); }} className="rounded-full">Play Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="absolute top-8 flex gap-8 text-xl font-bold">
        <div className="text-primary">Time: {timeLeft}s</div>
        <div className="text-green-600">Score: {score}</div>
      </div>
      <div className="text-6xl font-black tracking-widest mb-12 text-primary">{scrambled}</div>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          autoFocus
          className="w-full text-3xl p-4 rounded-2xl border-2 border-primary/20 text-center uppercase font-bold focus:border-primary outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Unscramble..."
        />
        <Button className="w-full mt-4 h-14 text-xl rounded-2xl">Submit</Button>
      </form>
    </div>
  );
}
