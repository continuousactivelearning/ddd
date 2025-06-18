import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Google as GoogleIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { user, login, error, loading } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user && !loading) {
      navigate('/');
      return;
    }

    // Check for token in URL (only once)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token && !isProcessing) {
      setIsProcessing(true);
      login(token)
        .then(() => {
          // Remove token from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate('/');
        })
        .catch((err) => {
          console.error('Login error:', err);
          setIsProcessing(false);
        });
    }
  }, []); // Remove dependencies to prevent infinite loops

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/admin/auth/google';
  };

  // Show loading while processing login
  if (isProcessing || loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1c2e 0%, #2d1b69 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1c2e 0%, #2d1b69 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0
        }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              background: `rgba(255, 255, 255, ${Math.random() * 0.1})`,
              borderRadius: '50%',
              filter: 'blur(20px)'
            }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </Box>

      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
            >
              <AdminIcon
                sx={{
                  fontSize: 60,
                  color: '#fff',
                  mb: 2,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </motion.div>

            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 3,
                color: '#fff',
                fontWeight: 700,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Admin Portal
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                maxWidth: '400px'
              }}
            >
              Sign in with your Google account to access the admin dashboard
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error}
              </Alert>
            )}

            <Button
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={isProcessing}
              sx={{
                width: '100%',
                maxWidth: 300,
                py: 1.5,
                borderColor: 'divider',
                color: 'white',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              Sign in with Google
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login; 