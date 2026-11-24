import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle, XCircle, Timer, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MathSprint({ onComplete }: { onComplete: (score: number) => void }) {
  const [question, setQuestion] = useState({ a: 0, b: 0, op: '+', ans: 0 });
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateQuestion = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, ans;
    if (op === '*') {
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      ans = a * b;
    } else {
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      ans = op === '+' ? a + b : a - b;
    }
    setQuestion({ a, b, op, ans });
    setInput('');
  };

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState('ended');
      onComplete(score);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(input) === question.ans) {
      setScore((s) => s + 10);
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        generateQuestion();
      }, 500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 500);
    }
    setInput('');
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateQuestion();
  };

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="text-6xl mb-6">➕</div>
        <h2 className="text-3xl font-bold mb-4">Math Sprint</h2>
        <p className="text-muted-foreground mb-8 max-w-md">Solve as many math problems as you can in 60 seconds. Each correct answer gives you 10 points!</p>
        <Button size="lg" onClick={startGame} className="rounded-full px-12 py-6 text-xl shadow-glow">Start Game</Button>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <Trophy className="w-20 h-20 text-yellow-500 mb-6 animate-bounce" />
        <h2 className="text-4xl font-bold mb-2">Game Over!</h2>
        <p className="text-2xl text-muted-foreground mb-8">Your Score: <span className="text-primary font-bold">{score}</span></p>
        <Button size="lg" onClick={startGame} className="rounded-full px-12 shadow-soft">Play Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full relative overflow-hidden bg-white">
      <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-1 md:gap-2 text-lg md:text-2xl font-bold">
        <Timer className="text-primary w-5 h-5 md:w-6 md:h-6" /> {timeLeft}s
      </div>
      <div className="absolute top-4 right-4 md:top-8 md:right-8 text-lg md:text-2xl font-bold text-green-600">
        Score: {score}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={question.ans} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center w-full max-w-sm px-4">
          <div className="text-4xl md:text-7xl font-black mb-8 md:mb-12 flex items-center justify-center gap-3 md:gap-6">
            <span>{question.a}</span>
            <span className="text-primary">{question.op}</span>
            <span>{question.b}</span>
            <span className="text-gray-300">=</span>
            <span className="text-primary">?</span>
          </div>

          <form onSubmit={handleSubmit} className="relative inline-block">
            <input
              autoFocus
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-4xl md:text-6xl font-bold text-center w-32 md:w-48 border-b-4 border-primary focus:outline-none bg-transparent pb-2"
              placeholder="?"
            />
            <div className="absolute -right-16 top-1/2 -translate-y-1/2">
               {feedback === 'correct' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} className="text-green-500"><CheckCircle size={48} /></motion.div>}
               {feedback === 'wrong' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} className="text-red-500"><XCircle size={48} /></motion.div>}
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
