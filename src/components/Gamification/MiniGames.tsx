
import { useNavigate } from "react-router-dom";
import { Sparkles, Brain, Map } from "lucide-react";

const MiniGames = () => {
  const navigate = useNavigate();

  const games = [
    {
      name: "Memory Map",
      icon: <Map className="w-8 h-8" />,
      color: "from-emerald-400 via-teal-500 to-blue-600",
      shadow: "shadow-emerald-500/25",
      hoverShadow: "hover:shadow-emerald-500/40",
      path: "/memory-map",
      description: "Test your spatial memory",
    },
    {
      name: "Quiz",
      icon: <Brain className="w-8 h-8" />,
      color: "from-purple-500 via-violet-600 to-pink-600",
      shadow: "shadow-purple-500/25",
      hoverShadow: "hover:shadow-purple-500/40",
      path: "/quiz",
      description: "Challenge your knowledge",
    },
    {
      name: "Short Questions",
      icon: <Sparkles className="w-8 h-8" />,
      color: "from-amber-400 via-orange-500 to-red-500",
      shadow: "shadow-orange-500/25",
      hoverShadow: "hover:shadow-orange-500/40",
      path: "/short-questions",
      description: "Quick thinking challenges",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Mini Games
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Choose your challenge and test your skills!
          </p>
        </div>

        {/* Games Grid - Now horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <div
              key={game.name}
              className="group relative overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <button
                onClick={() => navigate(game.path)}
                className={`
                  relative w-full p-6 rounded-3xl bg-gradient-to-br ${game.color} 
                  text-white shadow-2xl ${game.shadow} ${game.hoverShadow}
                  transform hover:scale-[1.02] hover:-translate-y-2 
                  transition-all duration-500 ease-out
                  border border-white/20 backdrop-blur-sm
                  active:scale-[0.98] active:translate-y-0
                  overflow-hidden
                  min-h-[200px] flex flex-col justify-center items-center
                `}
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 -left-4 w-24 h-24 bg-white rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-0 -right-4 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300 mb-4 inline-block">
                    {game.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                  <p className="text-white/80 text-sm font-medium">{game.description}</p>
                  
                  {/* Arrow indicator */}
                  <div className="flex justify-center items-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300 mt-4">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="flex justify-center mt-12 space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniGames;
