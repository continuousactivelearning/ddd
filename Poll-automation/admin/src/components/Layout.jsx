import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Badge, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AccountCircle, Notifications, Settings, Logout, Person } from '@mui/icons-material';
import { useState } from 'react';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1a237e 0%, #0d47a1 100%)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  height: '70px',
  borderRadius: 0,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 24px',
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

const ActionSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Layout = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="fixed" elevation={0}>
        <StyledToolbar>
          <LogoSection>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '1px'
              }}
            >
              Poll Automation
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                ml: 1,
                fontWeight: 500
              }}
            >
              Admin Dashboard
            </Typography>
          </LogoSection>
          <ActionSection>
            <IconButton
              size="large"
              color="inherit"
              sx={{ 
                '&:hover': { 
                  transform: 'scale(1.1)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }, 
                transition: 'all 0.2s',
                p: 1
              }}
            >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Notifications />
              </StyledBadge>
            </IconButton>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
              sx={{ 
                '&:hover': { 
                  transform: 'scale(1.1)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }, 
                transition: 'all 0.2s',
                p: 1
              }}
            >
              <Avatar 
                sx={{ 
                  width: 35, 
                  height: 35,
                  bgcolor: 'primary.light',
                  border: '2px solid rgba(255,255,255,0.2)'
                }}
              >
                <Person />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  borderRadius: 2,
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                    typography: 'body2',
                  },
                },
              }}
            >
              <MenuItem onClick={handleClose}>
                <Person sx={{ mr: 2, fontSize: 20 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Settings sx={{ mr: 2, fontSize: 20 }} />
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
                <Logout sx={{ mr: 2, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </ActionSection>
        </StyledToolbar>
      </StyledAppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 9, sm: 10 },
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 2, sm: 3 },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 