import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  { q: "What is the capital of India?", a: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], c: 1 },
  { q: "Which planet is known as the Red Planet?", a: ["Mars", "Venus", "Jupiter", "Saturn"], c: 0 },
  { q: "What is the square root of 144?", a: ["10", "11", "12", "14"], c: 2 },
  { q: "Who wrote 'Romeo and Juliet'?", a: ["Dickens", "Shakespeare", "Austen", "Twain"], c: 1 },
  { q: "What is the chemical symbol for Water?", a: ["O2", "CO2", "H2O", "HO2"], c: 2 },
  { q: "Which is the largest ocean on Earth?", a: ["Atlantic", "Indian", "Arctic", "Pacific"], c: 3 },
  { q: "How many bones are in the adult human body?", a: ["206", "196", "216", "226"], c: 0 },
  { q: "What is the speed of light?", a: ["300,000 km/s", "150,000 km/s", "400,000 km/s", "200,000 km/s"], c: 0 }
];

export function SpeedQuiz({ onComplete }: { onComplete: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [feedback, setFeedback] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    if (feedback !== null) return;
    setFeedback(index);
    if (index === QUESTIONS[current].c) {
      setScore(s => s + 25);
    }
    setTimeout(() => {
      setFeedback(null);
      if (current < QUESTIONS.length - 1) {
        setCurrent(current + 1);
      } else {
        setGameState('ended');
        onComplete(score + (index === QUESTIONS[current].c ? 25 : 0));
      }
    }, 600);
  };

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="text-6xl mb-6">⏱️</div>
        <h2 className="text-3xl font-bold mb-4">Speed Quiz</h2>
        <p className="text-muted-foreground mb-8">Test your general knowledge! 25 points per correct answer.</p>
        <Button size="lg" onClick={() => setGameState('playing')} className="rounded-full">Start Quiz</Button>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <h2 className="text-4xl font-bold mb-2">Quiz Finished!</h2>
        <p className="text-2xl text-muted-foreground mb-8">Final Score: {score}</p>
        <Button size="lg" onClick={() => { setGameState('playing'); setCurrent(0); setScore(0); }} className="rounded-full">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 w-full max-w-2xl mx-auto">
      <div className="mb-4 text-primary font-bold">Question {current + 1} of {QUESTIONS.length}</div>
      <div className="w-full h-2 bg-gray-100 rounded-full mb-12 overflow-hidden">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }} />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
          <h3 className="text-2xl font-bold mb-8 text-center">{QUESTIONS[current].q}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUESTIONS[current].a.map((ans, i) => (
              <Button
                key={i}
                variant={feedback === null ? "outline" : i === QUESTIONS[current].c ? "default" : feedback === i ? "destructive" : "outline"}
                className={`h-16 text-lg rounded-xl transition-all ${feedback === null ? 'hover:border-primary hover:bg-primary/5' : ''}`}
                onClick={() => handleAnswer(i)}
              >
                {ans}
              </Button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
