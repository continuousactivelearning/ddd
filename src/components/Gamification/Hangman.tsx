import React, { useState, useEffect, useCallback } from 'react';

interface GameState {
  word: string;
  guessedLetters: Set<string>;
  wrongGuesses: number;
  gameStatus: 'playing' | 'won' | 'lost';
}

const WORDS = [
  'JAVASCRIPT', 'TYPESCRIPT', 'REACT', 'COMPUTER', 'PROGRAMMING',
  'HANGMAN', 'CHALLENGE', 'DEVELOPER', 'FUNCTION', 'VARIABLE',
  'ALGORITHM', 'DATABASE', 'FRONTEND', 'BACKEND', 'FRAMEWORK'
];

const MAX_WRONG_GUESSES = 6;

const HangmanGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    word: '',
    guessedLetters: new Set(),
    wrongGuesses: 0,
    gameStatus: 'playing'
  });

  const initializeGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setGameState({
      word: randomWord,
      guessedLetters: new Set(),
      wrongGuesses: 0,
      gameStatus: 'playing'
    });
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const guessLetter = (letter: string) => {
    if (gameState.gameStatus !== 'playing' || gameState.guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(gameState.guessedLetters);
    newGuessedLetters.add(letter);

    const isCorrectGuess = gameState.word.includes(letter);
    const newWrongGuesses = isCorrectGuess ? gameState.wrongGuesses : gameState.wrongGuesses + 1;

    const isWordComplete = gameState.word.split('').every(char => newGuessedLetters.has(char));
    const newGameStatus: 'playing' | 'won' | 'lost' =
      isWordComplete ? 'won' : newWrongGuesses >= MAX_WRONG_GUESSES ? 'lost' : 'playing';

    setGameState({
      ...gameState,
      guessedLetters: newGuessedLetters,
      wrongGuesses: newWrongGuesses,
      gameStatus: newGameStatus
    });
  };

  const renderWord = () =>
    gameState.word.split('').map((letter, i) => (
      <span
        key={i}
        style={{
          display: 'inline-block',
          minWidth: '2rem',
          backgroundColor: '#ffffff',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          borderBottom: '2px solid #1f2937',
          margin: '0 0.25rem',
          paddingBottom: '0.25rem'
        }}
      >
        {gameState.guessedLetters.has(letter) ? letter : '_'}
      </span>
    ));

  const renderAlphabet = () =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
      const isGuessed = gameState.guessedLetters.has(letter);
      const isCorrect = gameState.word.includes(letter);
      const isDisabled = isGuessed || gameState.gameStatus !== 'playing';

      let backgroundColor = '#3b82f6';
      if (isGuessed) backgroundColor = isCorrect ? '#22c55e' : '#ef4444';

      return (
        <button
          key={letter}
          onClick={() => guessLetter(letter)}
          disabled={isDisabled}
         style={{
  margin: '0.25rem',
  padding: '0.5rem 0.75rem',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '0.875rem',
  color: '#fff',
  backgroundColor,
  opacity: isDisabled ? 0.5 : 1,
  transition: 'all 0.3s',
  width: '40px', // force fixed width
  height: '40px', // force fixed height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}

        >
          {letter}
        </button>
      );
    });

  const renderHangman = () => {
    const parts = [
      '  +---+',
      '  |   |',
      '  |   O',
      '  |  /|\\',
      '  |  / \\',
      '  |',
      '======='
    ];
    const visibleParts = Math.min(gameState.wrongGuesses + 2, parts.length);

    return (
      <div style={{ fontFamily: 'monospace', fontSize: '1.125rem', lineHeight: '1.4' }}>
        {parts.slice(0, visibleParts).map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    );
  };

  const getStatusMessage = () => {
    if (gameState.gameStatus === 'won') return '🎉 Congratulations! You won!';
    if (gameState.gameStatus === 'lost') return `💀 Game Over! The word was: ${gameState.word}`;
    return `Wrong guesses: ${gameState.wrongGuesses}/${MAX_WRONG_GUESSES}`;
  };

  const getStatusColor = () => {
    if (gameState.gameStatus === 'won') return '#16a34a';
    if (gameState.gameStatus === 'lost') return '#dc2626';
    return '#374151';
  };

  return (
    <div
      style={{
        padding: '2rem',
        paddingLeft: '230px',
        backgroundColor: '#f9fafb',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}
      >
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
          Hangman Game
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                backgroundColor: '#333',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}
            >
              {renderHangman()}
            </div>
            <div style={{ color: getStatusColor(), fontSize: '1.25rem', fontWeight: '600' }}>
              {getStatusMessage()}
            </div>
          </div>

          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Guess the Word:
              </h2>
              <div>{renderWord()}</div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                Choose a Letter:
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {renderAlphabet()}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={initializeGame}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#8b5cf6',
                  color: '#fff',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                New Game
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#eff6ff',
            borderRadius: '12px'
          }}
        >
          <h3 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '0.5rem' }}>How to Play:</h3>
          <ul style={{ color: '#1e3a8a', fontSize: '0.875rem', lineHeight: '1.5' }}>
            <li>• Guess letters by clicking on them</li>
            <li>• You have {MAX_WRONG_GUESSES} wrong guesses before the game ends</li>
            <li>• Correct guesses are shown in green, wrong ones in red</li>
            <li>• Win by guessing all letters in the word!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HangmanGame;
