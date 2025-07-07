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
    if (gameState.gameStatus !== 'playing' || gameState.guessedLetters.has(letter)) {
      return;
    }

    const newGuessedLetters = new Set(gameState.guessedLetters);
    newGuessedLetters.add(letter);

    const isCorrectGuess = gameState.word.includes(letter);
    const newWrongGuesses = isCorrectGuess ? gameState.wrongGuesses : gameState.wrongGuesses + 1;

    // Check if word is complete
    const isWordComplete = gameState.word.split('').every(char => newGuessedLetters.has(char));
    
    let newGameStatus: 'playing' | 'won' | 'lost' = 'playing';
    if (isWordComplete) {
      newGameStatus = 'won';
    } else if (newWrongGuesses >= MAX_WRONG_GUESSES) {
      newGameStatus = 'lost';
    }

    setGameState({
      ...gameState,
      guessedLetters: newGuessedLetters,
      wrongGuesses: newWrongGuesses,
      gameStatus: newGameStatus
    });
  };

  const renderWord = () => {
    return gameState.word.split('').map((letter, index) => (
      <span key={index} className="mx-1 text-2xl font-bold border-b-2 border-gray-800 pb-1 min-w-8 text-center inline-block">
        {gameState.guessedLetters.has(letter) ? letter : '_'}
      </span>
    ));
  };

  const renderAlphabet = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.split('').map(letter => (
      <button
        key={letter}
        onClick={() => guessLetter(letter)}
        disabled={gameState.guessedLetters.has(letter) || gameState.gameStatus !== 'playing'}
        className={`m-1 px-3 py-2 rounded font-bold text-sm transition-colors ${
          gameState.guessedLetters.has(letter)
            ? gameState.word.includes(letter)
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
        }`}
      >
        {letter}
      </button>
    ));
  };

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
      <div className="font-mono text-lg leading-tight">
        {parts.slice(0, visibleParts).map((part, index) => (
          <div key={index}>{part}</div>
        ))}
      </div>
    );
  };

  const getStatusMessage = () => {
    switch (gameState.gameStatus) {
      case 'won':
        return '🎉 Congratulations! You won!';
      case 'lost':
        return `💀 Game Over! The word was: ${gameState.word}`;
      default:
        return `Wrong guesses: ${gameState.wrongGuesses}/${MAX_WRONG_GUESSES}`;
    }
  };

  const getStatusColor = () => {
    switch (gameState.gameStatus) {
      case 'won':
        return 'text-green-600';
      case 'lost':
        return 'text-red-600';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Hangman Game</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Hangman Drawing */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-6 rounded-lg mb-4">
              {renderHangman()}
            </div>
            <div className={`text-xl font-semibold mb-4 ${getStatusColor()}`}>
              {getStatusMessage()}
            </div>
          </div>

          {/* Game Area */}
          <div className="flex flex-col">
            {/* Word Display */}
            <div className="text-center mb-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Guess the Word:</h2>
              <div className="mb-6">
                {renderWord()}
              </div>
            </div>

            {/* Alphabet */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Choose a Letter:</h3>
              <div className="flex flex-wrap justify-center">
                {renderAlphabet()}
              </div>
            </div>

            {/* New Game Button */}
            <div className="text-center">
              <button
                onClick={initializeGame}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-colors"
              >
                New Game
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">How to Play:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
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