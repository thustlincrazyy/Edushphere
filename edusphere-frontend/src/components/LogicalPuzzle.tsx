import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export function LogicalPuzzle({ onComplete }: { onComplete: (score: number) => void }) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    let t = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    // Shuffle
    for (let i = 0; i < 100; i++) {
      const neighbors = getNeighbors(t.indexOf(0));
      const move = neighbors[Math.floor(Math.random() * neighbors.length)];
      t = swap(t, t.indexOf(0), move);
    }
    setTiles(t);
    setMoves(0);
  };

  const getNeighbors = (index: number) => {
    const neighbors = [];
    if (index >= 3) neighbors.push(index - 3);
    if (index < 6) neighbors.push(index + 3);
    if (index % 3 !== 0) neighbors.push(index - 1);
    if ((index + 1) % 3 !== 0) neighbors.push(index + 1);
    return neighbors;
  };

  const swap = (arr: number[], i: number, j: number) => {
    const newArr = [...arr];
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    return newArr;
  };

  const handleTileClick = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    const neighbors = getNeighbors(emptyIndex);
    if (neighbors.includes(index)) {
      setTiles(swap(tiles, emptyIndex, index));
      setMoves(m => m + 1);
    }
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (tiles.length > 0 && tiles.every((t, i) => t === (i === 8 ? 0 : i + 1))) {
      onComplete(Math.max(200 - moves, 50));
    }
  }, [tiles]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-3xl font-bold mb-4">Logical Slide</h2>
      <p className="text-muted-foreground mb-8">Moves: <span className="text-primary font-bold">{moves}</span></p>
      
      <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-2xl shadow-inner">
        {tiles.map((tile, i) => (
          <motion.div
            key={i}
            layout
            onClick={() => handleTileClick(i)}
            className={`w-24 h-24 rounded-xl flex items-center justify-center text-3xl font-bold cursor-pointer shadow-md transition-colors ${tile === 0 ? 'bg-transparent shadow-none' : 'bg-white text-primary hover:bg-gray-50'}`}
          >
            {tile !== 0 && tile}
          </motion.div>
        ))}
      </div>

      {tiles.length > 0 && tiles.every((t, i) => t === (i === 8 ? 0 : i + 1)) && (
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Solved! 🧩</h3>
          <Button onClick={initGame} className="rounded-full px-8">Play Again</Button>
        </div>
      )}
    </div>
  );
}
