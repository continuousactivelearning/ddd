import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap, Brain, Target, TrendingUp } from 'lucide-react';

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
}

const EducationalChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "🎓 Hey there! I'm your DDD Learning Assistant. Ready to make learning fun and rewarding? What would you like to explore today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses: Record<string, string> = {
    'hello': "Hello there! 👋 Welcome to DDD! I'm excited to help you learn today. What subject sparks your curiosity most?",
    'help': "I'm your personal learning companion! Here's how I can help:\n\n✨ Explain complex topics simply\n📚 Provide study strategies\n📈 Track your progress\n🎯 Suggest resources\n💪 Keep you motivated\n\nWhat challenge can we tackle together?",
    'progress': "🌟 Your learning journey is impressive!\n\n📊 You're building incredible momentum! Every question you ask is progress. Keep going! 🚀",
    'motivation': "🌟 You're absolutely crushing it! Remember:\n\n💡 Curiosity is your superpower\n🧠 Your brain grows with every challenge\n🎯 Progress over perfection, always\n🔥 Small steps lead to big victories\n\nYou've got this! What's your next learning goal? 💪✨",
    'study tips': "🎯 Here are some game-changing study techniques:\n\n⏰ Pomodoro Technique (25min focus + 5min break)\n🗣️ Teach concepts out loud (Feynman method)\n🗺️ Create colorful mind maps\n🔄 Practice active recall regularly\n📅 Space out your learning sessions\n🎮 Gamify your progress\n\nWhich one resonates with your learning style?"
  };

  const getResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lowercaseInput.includes(key)) {
        return response;
      }
    }
    
    if (lowercaseInput.includes('math') || lowercaseInput.includes('mathematics')) {
      return "🔢 Mathematics is like a beautiful puzzle! Whether it's algebra, calculus, geometry, or statistics, every problem has an elegant solution waiting to be discovered.\n\nWhat specific math topic would you like to explore? I'll help break it down into bite-sized, conquerable pieces! 🧮✨";
    }
    
    if (lowercaseInput.includes('science') || lowercaseInput.includes('physics') || lowercaseInput.includes('chemistry') || lowercaseInput.includes('biology')) {
      return "🔬 Science is pure magic! From the tiniest atoms to vast galaxies, from chemical reactions to biological processes - everything has a fascinating story.\n\nWhich scientific realm calls to you? I'll help you uncover the wonders hidden in complex concepts! 🌟🧬";
    }
    
    if (lowercaseInput.includes('english') || lowercaseInput.includes('literature') || lowercaseInput.includes('writing')) {
      return "📚 Language and literature are the keys to human expression! Whether you're crafting essays, analyzing literature, mastering grammar, or unleashing creativity through writing.\n\nWhat writing adventure shall we embark on together? 🖋️✨";
    }
    
    const defaultResponses = [
      "🤔 That's a fascinating question! I love your curiosity. While I'd like to dive deeper into that specific topic, let me guide you toward the perfect learning approach.\n\nWhat aspect would you like to explore first? Let's break it down together! 🎯",
      "💡 Excellent thinking! Your questions show real intellectual curiosity. Learning happens when we dare to ask.\n\nTell me more about what you're trying to understand, and I'll help you find the perfect path forward! 🚀",
      "🌟 I appreciate you bringing this challenge to me! Every question is a stepping stone to mastery.\n\nLet's tackle this together - what's your current understanding, and where would you like to go deeper? 🧠"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: getResponse(inputValue),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: Brain, text: "Study Tips", action: "study tips", color: "from-purple-500 to-pink-500" },
    { icon: TrendingUp, text: "Progress", action: "progress", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, text: "Motivate Me", action: "motivation", color: "from-orange-500 to-red-500" },
    { icon: Target, text: "Set Goals", action: "I want to set learning goals", color: "from-green-500 to-emerald-500" }
  ];

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Quick Actions Header */}
      <div className="p-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Quick Start</h3>
            <p className="text-xs text-gray-600">Choose a topic to explore</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className={`flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r ${action.color} text-white text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105`}
            >
              <action.icon className="w-3 h-3" />
              <span>{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}>
                {message.type === 'user' ? 
                  <User className="w-3 h-3 text-white" /> : 
                  <Bot className="w-3 h-3 text-white" />
                }
              </div>
              <div className={`rounded-xl p-3 shadow-sm ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                  : 'bg-white border border-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg px-3 py-2 transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">Press Enter to send</p>
      </div>
    </div>
  );
};

export default EducationalChatbot;