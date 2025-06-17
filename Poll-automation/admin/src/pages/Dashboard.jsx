import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';

// Create motion components
const MotionCard = motion(Card);

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminHeader />
      
      <Box sx={{ pt: '80px', px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 4 }}>
            Admin Dashboard
          </Typography>

          <MotionCard
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('/create-quiz')}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Create New Quiz
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Generate AI-powered quizzes for your students
              </Typography>
            </CardContent>
          </MotionCard>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard; 