import { useNavigate } from "react-router-dom";
import { Sparkles, Brain, Map } from "lucide-react";
import type { CSSProperties } from "react";

const MiniGames = () => {
  const navigate = useNavigate();

  const games = [
    {
      name: "Matchmaking Game",
      icon: <Map size={28} />,
      color: "linear-gradient(to bottom right, #34d399, #0ea5e9)",
      path: "/matchmaking",
      description: "Flip and match memory challenge",
    },
    {
      name: "Quiz",
      icon: <Brain size={28} />,
      color: "linear-gradient(to bottom right, #8b5cf6, #ec4899)",
      path: "/quiz",
      description: "Challenge your knowledge",
    },
    {
      name: "Hangman Game",
      icon: <Sparkles size={28} />,
      color: "linear-gradient(to bottom right, #fbbf24, #ef4444)",
      path: "/hangman",
      description: "Classic word guessing fun",
    },
  ];

  const containerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1.5rem",
    flexWrap: "wrap",
    width: "100%",
    padding: "2rem",
    boxSizing: "border-box",
  };

  const buttonStyle = (gradient: string): CSSProperties => ({
    background: gradient,
    borderRadius: "20px",
    padding: "1.25rem",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    cursor: "pointer",
    minWidth: "200px",
    minHeight: "180px",
    flex: "1 1 220px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  });

  const buttonHoverStyle: CSSProperties = {
    transform: "scale(1.03) translateY(-4px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  };

  const bubbleStyle = (top = false): CSSProperties => ({
    position: "absolute",
    width: top ? "60px" : "80px",
    height: top ? "60px" : "80px",
    backgroundColor: "white",
    borderRadius: "50%",
    opacity: 0.1,
    filter: "blur(20px)",
    animation: "pulse 2s infinite",
    top: top ? "0" : undefined,
    bottom: !top ? "0" : undefined,
    left: top ? "-20px" : undefined,
    right: !top ? "-20px" : undefined,
  });

  const tooltipStyle: CSSProperties = {
    position: "absolute",
    top: "8px",
    right: "12px",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "10px",
    color: "#fff",
    opacity: 0,
    transition: "opacity 0.3s ease",
  };

  const dotStyle = (delay: string): CSSProperties => ({
    width: "6px",
    height: "6px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    animation: "bounce 1.2s infinite",
    animationDelay: delay,
  });

  return (
    <div style={{ padding: "1.5rem", boxSizing: "border-box", width: "100%" }}>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Mini Games</h1>
      <div style={containerStyle}>
        {games.map((game, index) => (
          <div
            key={index}
            style={{ position: "relative", transition: "transform 0.3s ease" }}
            onMouseEnter={(e) => {
              const div = e.currentTarget as HTMLDivElement;
              const button = div.querySelector(".hover-button") as HTMLButtonElement;
              const tooltip = div.querySelector(".tooltip") as HTMLDivElement;
              if (button) Object.assign(button.style, buttonHoverStyle);
              if (tooltip) tooltip.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              const div = e.currentTarget as HTMLDivElement;
              const button = div.querySelector(".hover-button") as HTMLButtonElement;
              const tooltip = div.querySelector(".tooltip") as HTMLDivElement;
              if (button) {
                button.style.transform = "";
                button.style.boxShadow = "";
              }
              if (tooltip) tooltip.style.opacity = "0";
            }}
          >
            <button
              onClick={() => navigate(game.path)}
              style={buttonStyle(game.color)}
              className="hover-button"
            >
              <div style={bubbleStyle(true)}></div>
              <div style={bubbleStyle(false)}></div>
              <div className="tooltip" style={tooltipStyle}>Get ready for something fun!</div>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  marginBottom: "1rem",
                }}
              >
                {game.icon}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: "bold", margin: 0 }}>{game.name}</h3>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>
                {game.description}
              </p>
              <div style={{ display: "flex", gap: "6px", marginTop: "1rem", opacity: 0.7 }}>
                <div style={dotStyle("0s")}></div>
                <div style={dotStyle("0.1s")}></div>
                <div style={dotStyle("0.2s")}></div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniGames;
