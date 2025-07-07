import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_FOOD: Position = { x: 15, y: 15 };
const GAME_SPEED = 150;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setIsGameRunning(false);
  }, []);

  const moveSnake = useCallback(() => {
    if (!isGameRunning || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      // Move head based on direction
      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collisions
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsGameRunning(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsGameRunning(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameRunning, gameOver, highScore, generateFood]);

  // Game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isGameRunning) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
          break;
        case ' ':
          e.preventDefault();
          setIsGameRunning(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameRunning]);

  const toggleGame = () => {
    if (gameOver) {
      resetGame();
    } else {
      setIsGameRunning(!isGameRunning);
    }
  };

  const getCellClass = (x: number, y: number): string => {
    const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
    const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    if (isSnakeHead) return 'bg-green-600 rounded-sm shadow-md';
    if (isSnakeBody) return 'bg-green-400 rounded-sm';
    if (isFood) return 'bg-red-500 rounded-full shadow-lg animate-pulse';
    return 'bg-gray-100 hover:bg-gray-200 transition-colors';
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Snake Game</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Trophy className="w-4 h-4" />
            <span>High: {highScore}</span>
          </div>
        </div>
        <div className="text-xl font-semibold text-green-600">
          Score: {score}
        </div>
      </div>

      {/* Game Board */}
      <div className="relative mb-6 border-4 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <div 
          className="grid gap-0.5 p-2"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            return (
              <div
                key={index}
                className={`w-4 h-4 ${getCellClass(x, y)}`}
              />
            );
          })}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
              <p className="text-lg mb-4">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={toggleGame}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={gameOver}
        >
          {isGameRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isGameRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 max-w-md">
        <p className="mb-2">Use arrow keys to control the snake</p>
        <p>Eat the red food to grow and increase your score!</p>
        <p className="mt-2 text-xs">Press spacebar to pause during gameplay</p>
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 mt-4 md:hidden">
        <div></div>
        <button
          onTouchStart={() => setDirection(prev => prev !== 'DOWN' ? 'UP' : prev)}
          className="p-3 bg-gray-200 rounded-lg active:bg-gray-300"
        >
          ↑
        </button>
        <div></div>
        <button
          onTouchStart={() => setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev)}
          className="p-3 bg-gray-200 rounded-lg active:bg-gray-300"
        >
          ←
        </button>
        <div></div>
        <button
          onTouchStart={() => setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev)}
          className="p-3 bg-gray-200 rounded-lg active:bg-gray-300"
        >
          →
        </button>
        <div></div>
        <button
          onTouchStart={() => setDirection(prev => prev !== 'UP' ? 'DOWN' : prev)}
          className="p-3 bg-gray-200 rounded-lg active:bg-gray-300"
        >
          ↓
        </button>
        <div></div>
      </div>
    </div>
  );
};

export default SnakeGame;