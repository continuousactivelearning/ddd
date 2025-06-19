import React, { useState, useRef } from 'react';
import { Box, IconButton, TextField, Paper, Typography, CircularProgress, Fade, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API setup (same as CreateQuiz.jsx)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const Chatbot = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am Gemini. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: 'user', text: input }]);
    setLoading(true);
    setError('');
    const userMessage = input;
    setInput('');
    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'bot')
        .map((m) => `${m.role === 'user' ? 'User' : 'Bot'}: ${m.text}`)
        .join('\n');
      const prompt = `${history}\nUser: ${userMessage}\nBot:`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setMessages((msgs) => [...msgs, { role: 'bot', text: text.trim() }]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Theming
  const isDark = theme.palette.mode === 'dark';
  const chatBg = isDark ? '#181C24' : '#fff';
  const userMsgBg = isDark ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)';
  const botMsgBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)';
  const borderColor = isDark ? '#232B3B' : '#E2E8F0';
  const headerBg = isDark ? 'linear-gradient(90deg, #232B3B 0%, #6366F1 100%)' : 'linear-gradient(90deg, #6366F1 0%, #A5B4FC 100%)';

  return (
    <>
      {/* Floating Chat Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: 2000,
          m: 3,
        }}
      >
        <Fade in={!open}>
          <IconButton
            color="primary"
            size="large"
            onClick={() => setOpen(true)}
            sx={{
              background: userMsgBg,
              color: '#fff',
              boxShadow: 6,
              '&:hover': { background: userMsgBg, opacity: 0.92 },
              width: 64,
              height: 64,
              borderRadius: 2,
              p: 0,
            }}
          >
            <ChatIcon sx={{ fontSize: 36 }} />
          </IconButton>
        </Fade>
      </Box>

      {/* Chat Window */}
      <Fade in={open}>
        <Paper
          elevation={12}
          sx={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: 400,
            maxWidth: '98vw',
            height: 520,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: chatBg,
            border: `1.5px solid ${borderColor}`,
            zIndex: 2100,
            boxShadow: isDark
              ? '0 8px 32px rgba(99,102,241,0.18), 0 1.5px 8px rgba(0,0,0,0.25)'
              : '0 8px 32px rgba(99,102,241,0.10), 0 1.5px 8px rgba(0,0,0,0.08)',
            m: 0,
          }}
        >
          {/* Header */}
          <Box sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: headerBg,
            color: '#fff',
            borderBottom: `1.5px solid ${borderColor}`,
            minHeight: 56,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>Gemini Chatbot</Typography>
            <IconButton onClick={() => setOpen(false)} sx={{ color: '#fff', ml: 1 }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{
            flex: 1,
            p: 2,
            overflowY: 'auto',
            background: chatBg,
            transition: 'background 0.3s',
            borderBottom: `1.5px solid ${borderColor}`,
          }}>
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.2,
                    borderRadius: 2,
                    maxWidth: '80%',
                    background: msg.role === 'user' ? userMsgBg : botMsgBg,
                    color: msg.role === 'user' ? '#fff' : (isDark ? '#F1F5F9' : '#1A1C2E'),
                    fontWeight: 500,
                    fontSize: '1rem',
                    boxShadow: msg.role === 'user' ? 2 : 0,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CircularProgress size={18} color="primary" />
                <Typography variant="body2" color="text.secondary">Gemini is typing...</Typography>
              </Box>
            )}
            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>
            )}
            <div ref={chatEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{
            p: 2,
            borderTop: `1.5px solid ${borderColor}`,
            background: isDark ? '#22293A' : '#F4F7FB',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: 64,
          }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              sx={{
                background: isDark ? '#232B3B' : '#fff',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default Chatbot; 