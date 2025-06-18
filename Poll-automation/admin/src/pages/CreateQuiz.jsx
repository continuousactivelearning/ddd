import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from '../components/AdminHeader';
import axios from '../utils/axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to clean and parse JSON response
const parseGeminiResponse = (text) => {
  try {
    // Remove markdown code block formatting if present
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error parsing response:', error);
    throw new Error('Failed to parse the generated questions. Please try again.');
  }
};

const CreateQuiz = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quizLink, setQuizLink] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const generateQuestions = async () => {
    if (!topic) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');

    let retryCount = 0;
    const maxRetries = 3;
    const baseDelay = 60000; // 60 seconds

    while (retryCount < maxRetries) {
      try {
        // Generate questions using Gemini
        const prompt = `Generate ${numQuestions} ${difficulty} difficulty API-related questions about ${topic} 
        Dont Link everything to js make the questions based on topic purely if given telision generate questions
         related to telivison if given currency regarding currencies like that dont link every topic to Api 
         let the topic be only that topic in future i may be give shirts cars etc it should be based on that topic not with api linkage and all
         . 
        For each question, provide:
        1. The question text
        2. Four multiple choice options
        3. The index of the correct answer (0-3)
        
        Format the response as a JSON array of objects with this structure:
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": number
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse the generated questions using the helper function
        const generatedQuestions = parseGeminiResponse(text);
        setQuestions(generatedQuestions);
        setSuccess('Questions generated successfully!');
        break; // Success, exit the retry loop
      } catch (err) {
        console.error('Error generating questions:', err);
        
        // Check if it's a rate limit error
        if (err.message?.includes('429') || err.message?.includes('quota')) {
          retryCount++;
          if (retryCount < maxRetries) {
            const waitTime = baseDelay * retryCount;
            setError(`Rate limit reached. Retrying in ${waitTime/1000} seconds...`);
            await delay(waitTime);
            continue;
          }
        }
        
        // If we've exhausted retries or it's a different error
        setError('Failed to generate questions. Please try again later or upgrade your API quota.');
        break;
      }
    }

    setLoading(false);
  };

  const createQuiz = async () => {
    if (questions.length === 0) {
      setError('Please generate questions first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/admin/quiz/create', {
        topic,
        difficulty,
        questions
      });

      setQuizLink(response.data.studentUrl);
      setShowLinkDialog(true);
      setSuccess('Quiz created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  const copyQuizLink = () => {
    navigator.clipboard.writeText(quizLink);
    setSuccess('Quiz link copied to clipboard!');
  };

  const handleEditQuestion = (index) => {
    setEditingQuestion(index);
    setEditedQuestion(questions[index]);
    setEditDialogOpen(true);
  };

  const saveEditedQuestion = () => {
    const newQuestions = [...questions];
    newQuestions[editingQuestion] = editedQuestion;
    setQuestions(newQuestions);
    setEditDialogOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminHeader />
      
      <Box sx={{ pt: '80px', px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 4 }}>
            Create New Quiz
          </Typography>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Quiz Details
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  label="Topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., JavaScript Basics, World History, etc."
                />
                
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={difficulty}
                    label="Difficulty"
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Number of Questions</InputLabel>
                  <Select
                    value={numQuestions}
                    label="Number of Questions"
                    onChange={(e) => setNumQuestions(e.target.value)}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Button
                variant="contained"
                onClick={generateQuestions}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                sx={{ mr: 2 }}
              >
                Generate Questions
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={createQuiz}
                disabled={loading || questions.length === 0}
              >
                Create Quiz
              </Button>
            </CardContent>
          </Card>

          {questions.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Generated Questions
                </Typography>
                
                <List>
                  {questions.map((q, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: 'background.paper',
                        mb: 2,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <ListItemText
                        primary={`${index + 1}. ${q.question}`}
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            {q.options.map((option, optIndex) => (
                              <Typography
                                key={optIndex}
                                variant="body2"
                                color={optIndex === q.correctAnswer ? 'success.main' : 'text.secondary'}
                                sx={{ ml: 2 }}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </Typography>
                            ))}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleEditQuestion(index)}
                        >
                          <EditIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError('')}
          >
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          </Snackbar>

          <Snackbar
            open={!!success}
            autoHideDuration={6000}
            onClose={() => setSuccess('')}
          >
            <Alert severity="success" onClose={() => setSuccess('')}>
              {success}
            </Alert>
          </Snackbar>

          <Dialog
            open={showLinkDialog}
            onClose={() => setShowLinkDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Quiz Created Successfully!</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Share this information with your students:
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Quiz Code: {quizLink.split('/').pop()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Students can use this code to access the quiz
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'background.paper',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    wordBreak: 'break-all'
                  }}
                >
                  {quizLink}
                </Typography>
                <IconButton onClick={copyQuizLink}>
                  <CopyIcon />
                </IconButton>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowLinkDialog(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Edit Question</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Question"
                value={editedQuestion.question}
                onChange={(e) => setEditedQuestion({
                  ...editedQuestion,
                  question: e.target.value
                })}
                sx={{ mb: 2, mt: 1 }}
              />
              
              {editedQuestion.options.map((option, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Option ${String.fromCharCode(65 + index)}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...editedQuestion.options];
                    newOptions[index] = e.target.value;
                    setEditedQuestion({
                      ...editedQuestion,
                      options: newOptions
                    });
                  }}
                  sx={{ mb: 2 }}
                />
              ))}

              <FormControl fullWidth>
                <InputLabel>Correct Answer</InputLabel>
                <Select
                  value={editedQuestion.correctAnswer}
                  label="Correct Answer"
                  onChange={(e) => setEditedQuestion({
                    ...editedQuestion,
                    correctAnswer: e.target.value
                  })}
                >
                  {editedQuestion.options.map((_, index) => (
                    <MenuItem key={index} value={index}>
                      Option {String.fromCharCode(65 + index)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveEditedQuestion} variant="contained">
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default CreateQuiz; 