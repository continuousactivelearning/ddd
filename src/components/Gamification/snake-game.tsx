import React, { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];
const INITIAL_FOOD: Position = { x: 15, y: 15 };
const GAME_SPEED = 200;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    // Using memory storage instead of localStorage
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setIsGameRunning(false);
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    if (!isGameRunning || gameOver) return;

    setDirection(nextDirection);

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      // Move head based on direction
      switch (nextDirection) {
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
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, food, isGameRunning, gameOver, highScore, generateFood]);

  // Game loop
  useEffect(() => {
    if (!isGameRunning || gameOver) return;
    
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake, isGameRunning, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }
      
      if (e.key === ' ') {
        if (gameOver) {
          resetGame();
        } else {
          setIsGameRunning(!isGameRunning);
        }
        return;
      }

      if (!isGameRunning || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setNextDirection(prev => direction !== 'DOWN' ? 'UP' : prev);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setNextDirection(prev => direction !== 'UP' ? 'DOWN' : prev);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setNextDirection(prev => direction !== 'RIGHT' ? 'LEFT' : prev);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setNextDirection(prev => direction !== 'LEFT' ? 'RIGHT' : prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameRunning, gameOver, direction, resetGame]);

  const startGame = () => {
    if (gameOver) {
      resetGame();
    }
    setIsGameRunning(true);
  };

  const getSnakeSegmentType = (x: number, y: number): string | null => {
    const headIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
    if (headIndex === -1) return null;
    
    if (headIndex === 0) return 'head';
    if (headIndex === snake.length - 1) return 'tail';
    return 'body';
  };

  const getSnakeCurveClass = (segmentIndex: number): React.CSSProperties => {
    if (segmentIndex === 0 || segmentIndex === snake.length - 1) return {};
    
    const prev = snake[segmentIndex - 1];
    const current = snake[segmentIndex];
    const next = snake[segmentIndex + 1];
    
    const fromDir = prev.x > current.x ? 'RIGHT' : prev.x < current.x ? 'LEFT' : prev.y > current.y ? 'DOWN' : 'UP';
    const toDir = next.x > current.x ? 'RIGHT' : next.x < current.x ? 'LEFT' : next.y > current.y ? 'DOWN' : 'UP';
    
    if ((fromDir === 'UP' && toDir === 'RIGHT') || (fromDir === 'LEFT' && toDir === 'DOWN')) return { borderBottomLeftRadius: '50%' };
    if ((fromDir === 'UP' && toDir === 'LEFT') || (fromDir === 'RIGHT' && toDir === 'DOWN')) return { borderBottomRightRadius: '50%' };
    if ((fromDir === 'DOWN' && toDir === 'RIGHT') || (fromDir === 'LEFT' && toDir === 'UP')) return { borderTopLeftRadius: '50%' };
    if ((fromDir === 'DOWN' && toDir === 'LEFT') || (fromDir === 'RIGHT' && toDir === 'UP')) return { borderTopRightRadius: '50%' };
    
    return {};
  };

  const getCellStyle = (x: number, y: number): React.CSSProperties => {
    const segmentType = getSnakeSegmentType(x, y);
    const isFood = food.x === x && food.y === y;

    let baseStyle: React.CSSProperties = {
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    };
    
    if (segmentType) {
      const segmentIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
      const curveStyle = getSnakeCurveClass(segmentIndex);
      
      if (segmentType === 'head') {
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #4ade80, #16a34a)',
          borderRadius: '50%',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25)',
          border: '2px solid #15803d'
        };
      } else if (segmentType === 'tail') {
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #86efac, #22c55e)',
          borderRadius: '50%'
        };
      } else {
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #86efac, #22c55e)',
          borderRadius: curveStyle.borderTopLeftRadius ? '0' : '8px',
          ...curveStyle,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        };
      }
    }
    
    if (isFood) {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #f87171, #dc2626, #b91c1c)',
        borderRadius: '50%',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25)',
        border: '2px solid #fca5a5'
      };
    }
    
    return baseStyle;
  };

  const getCellContent = (x: number, y: number): React.ReactNode => {
    const segmentType = getSnakeSegmentType(x, y);
    const isFood = food.x === x && food.y === y;

    if (segmentType === 'head') {
      // Snake head with eyes based on direction
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {direction === 'UP' || direction === 'DOWN' ? (
            <>
              <div style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                backgroundColor: '#7f1d1d',
                borderRadius: '50%',
                left: '4px',
                top: '4px'
              }}></div>
              <div style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                backgroundColor: '#7f1d1d',
                borderRadius: '50%',
                right: '4px',
                top: '4px'
              }}></div>
            </>
          ) : (
            <>
              <div style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                backgroundColor: '#7f1d1d',
                borderRadius: '50%',
                top: '4px',
                left: '4px'
              }}></div>
              <div style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                backgroundColor: '#7f1d1d',
                borderRadius: '50%',
                bottom: '4px',
                left: '4px'
              }}></div>
            </>
          )}
        </div>
      );
    }
    
    if (isFood) {
      return (
        <div style={{
          width: '16px',
          height: '16px',
          background: 'linear-gradient(135deg, #fca5a5, #f87171, #dc2626)',
          borderRadius: '50%',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
            borderRadius: '50%'
          }}></div>
        </div>
      );
    }
    
    return '';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px',
      paddingLeft: '240px',
      background: 'transparent',
      color: '#4ade80',
      fontFamily: 'monospace',
      minHeight: '100vh'
    }}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      
      {/* Retro Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#4ade80',
          filter: 'drop-shadow(0 4px 3px rgba(0, 0, 0, 0.25))'
        }}>
          🐍 REALISTIC SNAKE 🐍
        </h1>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          fontSize: '18px'
        }}>
          <div>SCORE: <span style={{ color: '#facc15', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25))' }}>
            {score.toString().padStart(4, '0')}
          </span></div>
          <div>HIGH: <span style={{ color: '#f87171', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25))' }}>
            {highScore.toString().padStart(4, '0')}
          </span></div>
        </div>
      </div>

      {/* Game Board */}
      <div style={{
        position: 'relative',
        border: '4px solid #4ade80',
        background: 'linear-gradient(135deg, #111827, #1f2937, #111827)',
        padding: '8px',
        marginBottom: '24px',
        borderRadius: '8px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1px',
          backgroundColor: 'rgba(55, 65, 81, 0.2)',
          padding: '4px',
          borderRadius: '4px'
        }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            return (
              <div
                key={index}
                style={getCellStyle(x, y)}
              >
                {getCellContent(x, y)}
              </div>
            );
          })}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div style={{
            position: 'absolute',
            inset: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #f87171'
          }}>
            <div style={{ textAlign: 'center', color: '#f87171', fontWeight: 'bold' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>GAME OVER</div>
              <div style={{ fontSize: '20px', marginBottom: '16px' }}>FINAL SCORE: {score}</div>
              {score === highScore && score > 0 && (
                <div style={{ color: '#facc15', fontSize: '18px', marginBottom: '16px' }}>★ NEW HIGH SCORE! ★</div>
              )}
              <div style={{ fontSize: '14px' }}>
                <div>PRESS SPACE OR ENTER TO PLAY AGAIN</div>
              </div>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!isGameRunning && !gameOver && (
          <div style={{
            position: 'absolute',
            inset: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #4ade80'
          }}>
            <div style={{ textAlign: 'center', color: '#4ade80' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>PRESS SPACE TO START</div>
              <div style={{ fontSize: '14px' }}>
                <div>USE ARROW KEYS OR WASD TO MOVE</div>
                <div>EAT THE DIAMONDS TO GROW</div>
                <div>DON'T HIT THE WALLS OR YOURSELF</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <button
          onClick={startGame}
          style={{
            padding: '8px 24px',
            backgroundColor: '#16a34a',
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '4px',
            border: 'none',
            marginRight: '16px',
            cursor: isGameRunning && !gameOver ? 'not-allowed' : 'pointer',
            opacity: isGameRunning && !gameOver ? 0.5 : 1
          }}
          disabled={isGameRunning && !gameOver}
          onMouseOver={(e) => {
            if (!(isGameRunning && !gameOver)) {
              e.currentTarget.style.backgroundColor = '#22c55e';
            }
          }}
          onMouseOut={(e) => {
            if (!(isGameRunning && !gameOver)) {
              e.currentTarget.style.backgroundColor = '#16a34a';
            }
          }}
        >
          {gameOver ? 'PLAY AGAIN' : 'START GAME'}
        </button>
        
        <button
          onClick={resetGame}
          style={{
            padding: '8px 24px',
            backgroundColor: '#dc2626',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
        >
          RESET
        </button>
      </div>

      {/* Instructions */}
      <div style={{
        textAlign: 'center',
        fontSize: '14px',
        color: '#86efac',
        maxWidth: '384px',
        border: '1px solid #4ade80',
        padding: '16px',
        borderRadius: '4px'
      }}>
        <div style={{ color: '#4ade80', fontWeight: 'bold', marginBottom: '8px' }}>CONTROLS:</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          textAlign: 'left'
        }}>
          <div>↑↓←→ : Move Snake</div>
          <div>WASD : Move Snake</div>
          <div>SPACE : Start/Pause</div>
          <div>ENTER : Restart (when game over)</div>
        </div>
      </div>

      {/* Mobile Touch Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
        marginTop: '24px'
      }}>
        <div></div>
        <button
          onTouchStart={() => setNextDirection(prev => direction !== 'DOWN' ? 'UP' : prev)}
          style={{
            padding: '16px',
            backgroundColor: '#16a34a',
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '4px',
            border: 'none',
            fontSize: '20px',
            cursor: (!isGameRunning || gameOver) ? 'not-allowed' : 'pointer',
            opacity: (!isGameRunning || gameOver) ? 0.5 : 1
          }}
          disabled={!isGameRunning || gameOver}
        >
          ↑
        </button>
        <div></div>
        <button
          onTouchStart={() => setNextDirection(prev => direction !== 'RIGHT' ? 'LEFT' : prev)}
          style={{
            padding: '16px',
            backgroundColor: '#16a34a',
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '4px',
            border: 'none',
            fontSize: '20px',
            cursor: (!isGameRunning || gameOver) ? 'not-allowed' : 'pointer',
            opacity: (!isGameRunning || gameOver) ? 0.5 : 1
          }}
          disabled={!isGameRunning || gameOver}
        >
          ←
        </button>
        <button
          onTouchStart={() => setIsGameRunning(!isGameRunning)}
          style={{
            padding: '16px',
            backgroundColor: '#d97706',
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ⏸
        </button>
        <button
          onTouchStart={() => setNextDirection(prev => direction !== 'LEFT' ? 'RIGHT' : prev)}
          style={{
            padding: '16px',
            backgroundColor: '#16a34a',
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '4px',
            border: 'none',
            fontSize: '20px',
            cursor: (!isGameRunning || gameOver) ? 'not-allowed' : 'pointer',
            opacity: (!isGameRunning || gameOver) ? 0.5 : 1
          }}
          disabled={!isGameRunning || gameOver}
        >
          →
        </button>
        <div></div>
        <button
          onTouchStart={() => setNextDirection(prev => direction !== 'UP' ? 'DOWN' : prev)}
          style={{
            padding: '16px',
            backgroundColor: '#16a34a',
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '4px',
            border: 'none',
            fontSize: '20px',
            cursor: (!isGameRunning || gameOver) ? 'not-allowed' : 'pointer',
            opacity: (!isGameRunning || gameOver) ? 0.5 : 1
          }}
          disabled={!isGameRunning || gameOver}
        >
          ↓
        </button>
        <div></div>
      </div>
    </div>
  );
};

export default SnakeGame;