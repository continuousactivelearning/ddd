import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LogOut, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Moon,
  Mail,
  User,
  Bell,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Trophy
} from 'lucide-react';
import { 
  Box, 
  Typography, 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider,
  useTheme as useMuiTheme,
  Badge,
  Tooltip,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import axios from '../utils/axios';
import { io } from 'socket.io-client';
import './AdminHeader.css';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = useMuiTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  // Debug: Log user data
  useEffect(() => {
    if (user) {
      console.log('User data in AdminHeader:', user);
      console.log('User avatar:', user.avatar);
      console.log('User name:', user.name);
      console.log('User email:', user.email);
    }
  }, [user]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      // Authenticate with the server
      newSocket.emit('authenticate', user._id);

      // Listen for new notifications
      newSocket.on('new_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data);
        
        // Calculate unread count
        const unread = response.data.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Fetch unread count periodically
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get('/api/notifications/unread-count');
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleNotificationItemClick = async (notification) => {
    try {
      if (!notification.read) {
        await axios.patch(`/api/notifications/${notification._id}/read`);
        setNotifications(prev => 
          prev.map(n => 
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'quiz_activated':
        return <Play size={16} color="#10B981" />;
      case 'quiz_deactivated':
        return <Pause size={16} color="#F59E0B" />;
      case 'quiz_completed':
        return <CheckCircle size={16} color="#3B82F6" />;
      case 'quiz_created':
        return <AlertCircle size={16} color="#8B5CF6" />;
      case 'new_quiz_available':
        return <BookOpen size={16} color="#10B981" />;
      case 'quiz_result':
        return <Trophy size={16} color="#F59E0B" />;
      default:
        return <Bell size={16} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'quiz_activated':
      case 'new_quiz_available':
        return 'success';
      case 'quiz_deactivated':
      case 'quiz_result':
        return 'warning';
      case 'quiz_completed':
        return 'info';
      case 'quiz_created':
        return 'primary';
      default:
        return 'default';
    }
  };

  // Function to get user's avatar
  const getUserAvatar = () => {
    // If user has an avatar, use it
    if (user?.avatar) {
      return user.avatar;
    }
    
    // For Gmail users, you can implement Google profile picture fetching here
    // For now, we'll use the fallback
    return null;
  };

  // Function to get user's initials
  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'A';
  };

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    zIndex: 1000,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    background: isScrolled 
      ? theme.palette.mode === 'dark' 
        ? 'rgba(15, 23, 42, 0.98)' 
        : 'rgba(255, 255, 255, 0.98)'
      : theme.palette.mode === 'dark' 
        ? 'rgba(15, 23, 42, 1)' 
      : 'rgba(255, 255, 255, 1)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: isScrolled 
      ? theme.palette.mode === 'dark'
        ? '0 8px 32px rgba(0, 0, 0, 0.4)'
        : '0 8px 32px rgba(0, 0, 0, 0.12)'
      : 'none',
  };

  return (
    <header style={headerStyle}>
      {/* Left: Logo and Title */}
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1.5, sm: 2, md: 3 },
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5 },
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
            fontWeight: 900,
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.03em',
            filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 32, sm: 36, md: 40 },
              height: { xs: 32, sm: 36, md: 40 },
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'rotate(10deg) scale(1.1)',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
              }
            }}
          >
            <Zap size={20} color="white" sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            QuizMaster
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontWeight: 600,
            display: { xs: 'none', lg: 'block' },
            fontSize: '1.1rem',
            opacity: 0.8
          }}
        >
          Admin Dashboard
        </Typography>
      </Box>

      {/* Right: Actions and User Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 1.5 } }}>
        {/* Theme Toggle */}
        <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton
            onClick={toggleTheme}
            disableRipple
            sx={{
              width: { xs: 40, sm: 44, md: 48 },
              height: { xs: 40, sm: 44, md: 48 },
              borderRadius: '14px',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.04)',
              color: theme.palette.primary.main,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.15)' 
                  : 'rgba(0, 0, 0, 0.08)',
                transform: 'scale(1.1) rotate(180deg)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:active': {
                transform: 'scale(0.95)',
              }
            }}
          >
            <Fade in={true} timeout={300}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Fade>
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleNotificationClick}
            disableRipple
            sx={{
              width: { xs: 40, sm: 44, md: 48 },
              height: { xs: 40, sm: 44, md: 48 },
              borderRadius: '14px',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.04)',
              color: theme.palette.text.primary,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.15)' 
                  : 'rgba(0, 0, 0, 0.08)',
                transform: 'scale(1.1)',
              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:active': {
                transform: 'scale(0.95)',
              }
            }}
          >
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <Bell size={18} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Profile */}
        <Box
          onClick={handleProfileClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5, md: 2 },
            padding: { xs: '6px 12px', sm: '8px 16px' },
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'rgba(0, 0, 0, 0.04)',
            border: `1px solid ${theme.palette.divider}`,
            '&:hover': {
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.15)' 
                : 'rgba(0, 0, 0, 0.08)',
              transform: 'translateY(-2px)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                : '0 8px 25px rgba(0, 0, 0, 0.1)',
              borderColor: theme.palette.primary.main,
            },
            '&:focus': {
              outline: 'none',
            }
          }}
        >
          <Avatar
            src={getUserAvatar()}
            onError={(e) => {
              console.log('Avatar failed to load, using fallback');
              e.target.style.display = 'none';
            }}
            sx={{
              width: { xs: 36, sm: 40, md: 44 },
              height: { xs: 36, sm: 40, md: 44 },
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              border: `3px solid ${theme.palette.primary.main}`,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
              }
            }}
          >
            {getUserInitials()}
          </Avatar>
          
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.text.primary,
                lineHeight: 1.2,
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' }
              }}
            >
              {user?.name || 'Admin User'}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.text.secondary,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                fontWeight: 500
              }}
            >
              <Mail size={10} />
              {user?.email || 'admin@example.com'}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center', 
            transition: 'all 0.3s ease',
            transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            <ChevronDown size={16} />
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 280,
              borderRadius: '20px',
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 12px 40px rgba(0, 0, 0, 0.5)'
                : '0 12px 40px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info Section */}
          <Box sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: 'white',
            textAlign: 'center'
          }}>
            <Avatar
              src={getUserAvatar()}
              onError={(e) => {
                console.log('Profile menu avatar failed to load, using fallback');
                e.target.style.display = 'none';
              }}
              sx={{
                width: 60,
                height: 60,
                background: 'rgba(255, 255, 255, 0.2)',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                fontSize: '1.5rem',
                fontWeight: 700,
                mx: 'auto',
                mb: 2
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {user?.name || 'Admin User'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
              {user?.email || 'admin@example.com'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
              Administrator
            </Typography>
          </Box>

          <Divider />
          
          <MenuItem 
            onClick={handleClose}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 2,
              px: 3,
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.05)',
              }
            }}
          >
            <User size={18} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              View Profile
            </Typography>
          </MenuItem>
          
          <Divider />
          
          <MenuItem 
            onClick={handleLogout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 2,
              px: 3,
              color: '#EF4444',
              '&:hover': {
                background: 'rgba(239, 68, 68, 0.1)',
              }
            }}
          >
            <LogOut size={18} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Sign Out
            </Typography>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: {
              mt: 1,
              width: 380,
              maxHeight: 400,
              borderRadius: '20px',
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 12px 40px rgba(0, 0, 0, 0.5)'
                : '0 12px 40px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* Notifications Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.02)' 
              : 'rgba(0, 0, 0, 0.02)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {unreadCount} unread notifications
            </Typography>
          </Box>

          {/* Notifications List */}
          <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  onClick={() => handleNotificationItemClick(notification)}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    background: !notification.read 
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(99, 102, 241, 0.1)'
                        : 'rgba(99, 102, 241, 0.05)'
                      : 'transparent',
                    '&:hover': {
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.05)',
                    },
                    cursor: 'pointer'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {notification.quizName || notification.title}
                        </Typography>
                        <Chip 
                          label={notification.type.replace(/_/g, ' ')} 
                          color={getNotificationColor(notification.type)}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {formatTimeAgo(notification.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <ListItem sx={{ py: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  No notifications
                </Typography>
              </ListItem>
            )}
          </List>
        </Menu>
      </Box>
    </header>
  );
};

export default AdminHeader; 