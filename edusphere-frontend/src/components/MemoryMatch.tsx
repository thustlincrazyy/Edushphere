import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const EMOJIS = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍒', '🍍', '🥝'];

export function MemoryMatch({ onComplete }: { onComplete: (score: number) => void }) {
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
      }
      setTimeout(() => setFlipped([]), 800);
      setMoves(m => m + 1);
    }
  }, [flipped]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      onComplete(Math.max(100 - moves, 10));
    }
  }, [matched]);

  const handleFlip = (index: number) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      setFlipped([...flipped, index]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full">
      <h2 className="text-3xl font-bold mb-4">Memory Match</h2>
      <p className="text-muted-foreground mb-8 text-xl">Moves: <span className="font-bold text-primary">{moves}</span></p>
      
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            onClick={() => handleFlip(i)}
            className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg md:rounded-2xl flex items-center justify-center text-2xl md:text-4xl cursor-pointer shadow-soft transition-all ${flipped.includes(i) || matched.includes(i) ? 'bg-white' : 'bg-primary/20 rotate-y-180'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {(flipped.includes(i) || matched.includes(i)) ? card.emoji : '❓'}
          </motion.div>
        ))}
      </div>

      {matched.length === cards.length && (
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-green-600 mb-4">You Won! 🏆</h3>
          <Button onClick={initGame} className="rounded-full px-8">Play Again</Button>
        </div>
      )}
    </div>
  );
}
