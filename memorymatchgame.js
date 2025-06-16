import React, { useState, useEffect } from 'react';

const MatchmakingGame = () => {
  const symbols = ['🔥', '⚡', '🚀', '🎯', '🔧', '⚙️', '🎮', '🏆'];
  
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  const initializeGame = () => {
    const gameCards = [...symbols, ...symbols].map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
    setTimeElapsed(0);
    setGameStarted(false);
  };

  const handleCardClick = (cardId) => {
    if (!gameStarted) setGameStarted(true);
    
    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setMatchedPairs(prev => [...prev, firstCard.symbol]);
          setFlippedCards([]);
          
          // Check if game is won
          if (matchedPairs.length + 1 === symbols.length) {
            setGameWon(true);
          }
        }, 500);
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 max-w-xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            🎯 Memory Match Pro
          </h1>
          
          <div className="flex justify-center gap-6 text-base font-medium text-gray-300 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">⏱️</span>
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-400">🎯</span>
              <span>{moves} moves</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">⚡</span>
              <span>{matchedPairs.length}/{symbols.length} pairs</span>
            </div>
          </div>

          {gameWon && (
            <div className="bg-green-600 text-white rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold">🏆 Victory Achieved! 🏆</h2>
              <p className="text-base">Completed in {moves} moves and {formatTime(timeElapsed)}</p>
            </div>
          )}

          <button
            onClick={initializeGame}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {gameWon ? '🔄 New Game' : '🎮 Reset'}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => {
            let cardClasses = "w-full h-20 rounded-lg cursor-pointer flex items-center justify-center text-2xl font-bold transition-all ";
            
            if (card.isMatched) {
              cardClasses += "bg-green-600 text-white";
            } else if (card.isFlipped) {
              cardClasses += "bg-blue-600 text-white";
            } else {
              cardClasses += "bg-gray-600 hover:bg-gray-500 text-gray-300";
            }
            
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={cardClasses}
              >
                {card.isFlipped || card.isMatched ? card.symbol : '❓'}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-4 text-gray-400">
          <p className="text-sm">Click cards to flip them and find matching pairs!</p>
        </div>
      </div>
    </div>
  );
};

export default MatchmakingGame;