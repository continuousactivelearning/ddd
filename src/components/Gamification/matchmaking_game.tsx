import React, { useEffect, useState } from "react";

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const symbols = [
  "🔥", "⚡", "🚀", "🎯", "🔧", "⚙️", "🎮", "🏆", "💻", "💻"
];

const MatchmakingGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIdx, secondIdx] = flippedCards;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.symbol === secondCard.symbol) {
        const updatedCards = cards.map((card, i) =>
          i === firstIdx || i === secondIdx
            ? { ...card, isMatched: true }
            : card
        );
        setCards(updatedCards);
        setMatchedPairs((prev) => [...prev, firstCard.symbol]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          const updatedCards = cards.map((card, i) =>
            i === firstIdx || i === secondIdx
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(updatedCards);
          setFlippedCards([]);
        }, 900);
      }

      setMoves((prev) => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedPairs.length === symbols.length) {
      setGameWon(true);
      setScore(Math.max(1000 - timeElapsed * 5, 100));
    }
  }, [matchedPairs]);

  const initializeGame = () => {
    const fullSet = [...symbols, ...symbols];
    const shuffled = fullSet
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimeElapsed(0);
    setGameWon(false);
    setGameStarted(true);
    setScore(0);
  };

  const handleCardClick = (index: number) => {
    if (
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedCards.length === 2
    ) {
      return;
    }

    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);
    setFlippedCards((prev) => [...prev, index]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingLeft: "240px",
        padding: "2rem",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.25rem" }}>
          💻 Matchmaking Game 🎮
        </h1>
        <p style={{ fontSize: "1rem", color: "#444" }}>
          Moves: <strong>{moves}</strong> | Time: <strong>{timeElapsed}s</strong>
        </p>
        {gameWon && (
          <p style={{ color: "green", fontWeight: "bold", marginTop: "0.5rem" }}>
            🎉 You matched all pairs! Score: {score}
          </p>
        )}
        <button
          onClick={initializeGame}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.2rem",
            backgroundColor: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🔁 Restart Game
        </button>
      </div>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)", // ⬅️ Fixed 5 columns
    gap: "1rem",
    maxWidth: "700px",
    margin: "0 auto",
  }}
>

        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            style={{
              height: "80px",
              backgroundColor: "#f3f4f6",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              cursor: "pointer",
              userSelect: "none",
              opacity: card.isMatched ? 0.3 : 1,
              transform: card.isFlipped ? "rotateY(180deg)" : "none",
              transition: "transform 0.3s ease",
            }}
          >
            {card.isFlipped || card.isMatched ? card.symbol : "❓"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchmakingGame;
