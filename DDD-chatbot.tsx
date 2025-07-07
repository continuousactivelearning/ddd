import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BookOpen, Award, TrendingUp, MessageCircle, Lightbulb, Target } from 'lucide-react';

const EducationalChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your DDD Learning Assistant 🎓 I'm here to help you with your studies, track your progress, and make learning more engaging. What would you like to explore today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userStats, setUserStats] = useState({
    questionsAsked: 0,
    topicsExplored: 0,
    streakDays: 1,
    achievementPoints: 0
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    'hello': "Hello! Welcome to DDD! I'm excited to help you learn today. What subject interests you most?",
    'help': "I can assist you with:\n• Explaining complex topics\n• Providing study tips\n• Tracking your learning progress\n• Suggesting resources\n• Motivating you to reach your goals\n\nWhat would you like help with?",
    'progress': `Great question! Here's your learning journey so far:\n• Questions asked: ${userStats.questionsAsked}\n• Topics explored: ${userStats.topicsExplored}\n• Current streak: ${userStats.streakDays} days\n• Achievement points: ${userStats.achievementPoints}\n\nKeep up the amazing work! 🌟`,
    'motivation': "You're doing fantastic! Remember, every question you ask and every topic you explore makes you smarter. Learning is a journey, not a destination. Keep that curiosity alive! 💪✨",
    'study tips': "Here are some proven study techniques:\n• Use the Pomodoro Technique (25 min focus + 5 min break)\n• Teach concepts to others (or explain them out loud)\n• Create visual mind maps\n• Practice active recall\n• Space out your learning sessions\n\nWhich technique would you like to try first?",
    'dashboard': "Your learning dashboard shows real-time insights about your progress! It tracks your engagement, identifies knowledge gaps, and celebrates your achievements. This gamified approach releases dopamine and makes learning addictive in the best way possible! 🎮📊"
  };

  const getResponse = (input) => {
    const lowercaseInput = input.toLowerCase();
    
    // Check for keyword matches
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lowercaseInput.includes(key)) {
        return response;
      }
    }
    
    // Subject-specific responses
    if (lowercaseInput.includes('math') || lowercaseInput.includes('mathematics')) {
      return "Mathematics is fascinating! Whether you're working on algebra, calculus, geometry, or statistics, I can help break down complex problems into manageable steps. What specific math topic are you studying?";
    }
    
    if (lowercaseInput.includes('science') || lowercaseInput.includes('physics') || lowercaseInput.includes('chemistry') || lowercaseInput.includes('biology')) {
      return "Science opens up the mysteries of our universe! I love helping students understand scientific concepts through real-world examples and interactive explanations. Which science area interests you most?";
    }
    
    if (lowercaseInput.includes('english') || lowercaseInput.includes('literature') || lowercaseInput.includes('writing')) {
      return "Language and literature are powerful tools for expression and understanding! I can help with essay writing, literary analysis, grammar, or creative writing. What writing challenge are you facing?";
    }
    
    // Default encouraging responses
    const defaultResponses = [
      "That's an interesting question! While I'd love to dive deeper into that specific topic, I can help you find the right resources and study strategies. What aspect would you like to explore first?",
      "Great curiosity! Learning happens best when we ask questions. Let me help you break this down into manageable pieces. Can you tell me more about what you're trying to understand?",
      "I appreciate you bringing this to me! Every question is a step forward in your learning journey. How can I best support your understanding of this topic?",
      "Excellent question! This shows you're thinking critically. While I may not have all the specific details, I can guide you toward the right learning approach. What's your current understanding of this topic?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      questionsAsked: prev.questionsAsked + 1,
      topicsExplored: prev.topicsExplored + (Math.random() > 0.7 ? 1 : 0),
      achievementPoints: prev.achievementPoints + 10
    }));

    // Simulate bot typing
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: getResponse(inputValue),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: BookOpen, text: "Study Tips", action: "study tips" },
    { icon: TrendingUp, text: "My Progress", action: "progress" },
    { icon: Lightbulb, text: "Get Motivated", action: "motivation" },
    { icon: Target, text: "Set Goals", action: "I want to set learning goals" }
  ];

  const handleQuickAction = (action) => {
    setInputValue(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar with Stats */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">DDD Assistant</h2>
          <p className="text-gray-600">Your Learning Companion</p>
        </div>
        
        {/* User Stats Dashboard */}
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Questions Asked</p>
                <p className="text-2xl font-bold">{userStats.questionsAsked}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Topics Explored</p>
                <p className="text-2xl font-bold">{userStats.topicsExplored}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Achievement Points</p>
                <p className="text-2xl font-bold">{userStats.achievementPoints}</p>
              </div>
              <Award className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Learning Streak</p>
                <p className="text-2xl font-bold">{userStats.streakDays} days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <action.icon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">DDD Learning Assistant</h1>
              <p className="text-sm text-gray-600">Making learning engaging and dopamine-driven</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                }`}>
                  {message.type === 'user' ? 
                    <User className="w-5 h-5 text-white" /> : 
                    <Bot className="w-5 h-5 text-white" />
                  }
                </div>
                <div className={`rounded-lg p-4 ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white shadow-md border border-gray-200'
                }`}>
                  <p className="whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-2 ${
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
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white shadow-md border border-gray-200 rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white rounded-lg px-4 py-2 transition-colors duration-200 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalChatbot;