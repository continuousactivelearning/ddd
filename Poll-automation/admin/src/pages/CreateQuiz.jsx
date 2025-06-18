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
  Grid,
  Chip,
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
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();

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
      <Box sx={{ pt: { xs: '80px', md: '100px' }, px: { xs: 1, sm: 2, md: 0 }, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Container maxWidth="md" sx={{ width: '100%', ml: 0, mr: 'auto', pl: 0, pr: 0 }}>
          {/* Step Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, justifyContent: 'flex-start', ml: '150px', '@media (max-width: 768px)': { ml: '20px' } }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: questions.length === 0 ? 'primary.main' : 'success.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, boxShadow: 2, transition: 'all 0.3s' }}>1</Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: questions.length === 0 ? 'primary.main' : 'success.main', transition: 'all 0.3s' }}>Quiz Details</Typography>
            <Box sx={{ width: 40, height: 2, bgcolor: questions.length === 0 ? 'grey.300' : 'success.main', mx: 1, transition: 'all 0.3s' }} />
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: questions.length === 0 ? 'grey.300' : 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, boxShadow: 2, transition: 'all 0.3s' }}>2</Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: questions.length === 0 ? 'grey.400' : 'primary.main', transition: 'all 0.3s' }}>Questions</Typography>
          </Box>

          {/* Quiz Details Card */}
          <Card sx={{ 
            mb: 4, 
            borderRadius: '20px', 
            boxShadow: 4, 
            background: theme => theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
              : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', 
            p: { xs: 1, sm: 2, md: 3 }, 
            maxWidth: 700, 
            width: '100%', 
            ml: '250px', 
            mr: 'auto',
            '@media (max-width: 768px)': { 
              ml: '20px',
              mr: '20px',
              maxWidth: 'calc(100% - 40px)'
            }
          }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, color: 'primary.main', letterSpacing: '-0.02em' }}>
                Quiz Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 2 }}>
                <TextField
                  label="Quiz Topic"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  fullWidth
                  sx={{ flex: 2 }}
                  variant="outlined"
                  size="large"
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Difficulty</InputLabel>
                  <Select value={difficulty} label="Difficulty" onChange={e => setDifficulty(e.target.value)}>
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="# Questions"
                  type="number"
                  value={numQuestions}
                  onChange={e => setNumQuestions(Number(e.target.value))}
                  inputProps={{ min: 1, max: 20 }}
                  sx={{ maxWidth: 120 }}
                  variant="outlined"
                  size="large"
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={generateQuestions}
                  disabled={loading}
                  sx={{ borderRadius: '12px', fontWeight: 700, px: 4, py: 1.5, fontSize: '1.1rem', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: 2 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Questions'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Before/After Generation Experience */}
          {questions.length === 0 ? (
            <Box sx={{ 
              textAlign: 'left', 
              mt: 8, 
              mb: 8, 
              maxWidth: 700, 
              width: '100%', 
              ml: '250px', 
              mr: 'auto',
              '@media (max-width: 768px)': { 
                ml: '20px',
                mr: '20px',
                maxWidth: 'calc(100% - 40px)'
              }
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  color: 'text.secondary', 
                  fontWeight: 500,
                  animation: 'fadeInUp 1s ease-out',
                  '@keyframes fadeInUp': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(20px)'
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
              >
                Enter quiz details and click generate
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', opacity: 0.8, animation: 'fadeInUp 1s ease-out 0.3s both', '@keyframes fadeInUp': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(20px)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              } }}>
                Your AI-powered questions will appear here once generated
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            </Box>
          ) : (
            <>
              {/* Quiz Summary Card */}
              <Card sx={{ 
                mb: 4, 
                borderRadius: '20px', 
                boxShadow: 3, 
                background: theme => theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, #334155 0%, #475569 100%)' 
                  : 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)', 
                p: { xs: 1, sm: 2, md: 3 }, 
                maxWidth: 700, 
                width: '100%', 
                ml: '250px', 
                mr: 'auto',
                '@media (max-width: 768px)': { 
                  ml: '20px',
                  mr: '20px',
                  maxWidth: 'calc(100% - 40px)'
                }
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    Quiz Summary
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', mb: 1 }}>
                    <Chip label={topic} color="primary" sx={{ fontWeight: 700, fontSize: '1rem' }} />
                    <Chip label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} color="secondary" sx={{ fontWeight: 700, fontSize: '1rem' }} />
                    <Chip label={`${questions.length} Questions`} color="success" sx={{ fontWeight: 700, fontSize: '1rem' }} />
                  </Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={generateQuestions}
                    sx={{ borderRadius: '10px', fontWeight: 600, mt: 1 }}
                  >
                    Regenerate Questions
                  </Button>
                </CardContent>
              </Card>

              {/* Questions List */}
              <Box sx={{ 
                mb: 4, 
                ml: '250px', 
                mr: 'auto', 
                maxWidth: 700, 
                width: '100%',
                '@media (max-width: 768px)': { 
                  ml: '20px',
                  mr: '20px',
                  maxWidth: 'calc(100% - 40px)'
                }
              }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'primary.main', textAlign: 'left' }}>
                  Generated Questions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {questions.map((q, idx) => (
                    <Card key={idx} sx={{
                      borderRadius: '16px',
                      boxShadow: 2,
                      p: 2,
                      background: theme => theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
                        : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
                      position: 'relative',
                      width: '100%',
                      maxWidth: 700,
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%'
                    }}>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                          Q{idx + 1}: {q.question}
                        </Typography>
                        <List dense>
                          {q.options.map((opt, oidx) => (
                            <ListItem key={oidx} sx={{ pl: 0 }}>
                              <ListItemText
                                primary={opt}
                                sx={{ color: oidx === q.correctAnswer ? 'success.main' : 'text.primary', fontWeight: oidx === q.correctAnswer ? 700 : 500 }}
                              />
                            </ListItem>
                          ))}
                        </List>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditQuestion(idx)}
                            sx={{ borderRadius: '8px', fontWeight: 600 }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                            sx={{ borderRadius: '8px', fontWeight: 600 }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>

              {/* Create Quiz Button */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                mb: 4, 
                maxWidth: 700, 
                width: '100%', 
                ml: '150px', 
                mr: 'auto',
                '@media (max-width: 768px)': { 
                  ml: '20px',
                  mr: '20px',
                  maxWidth: 'calc(100% - 40px)'
                }
              }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={createQuiz}
                  disabled={loading}
                  sx={{ borderRadius: '12px', fontWeight: 700, px: 4, py: 1.5, fontSize: '1.1rem', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: 2 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Quiz'}
                </Button>
              </Box>

              {/* Success/Error Alerts */}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            </>
          )}

          {/* Quiz Link Dialog */}
          <Dialog open={showLinkDialog} onClose={() => setShowLinkDialog(false)}>
            <DialogTitle>Quiz Created!</DialogTitle>
            <DialogContent>
              <Typography sx={{ mb: 2 }}>Share this link with your students:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField value={quizLink} fullWidth InputProps={{ readOnly: true }} />
                <IconButton onClick={copyQuizLink} color="primary">
                  <CopyIcon />
                </IconButton>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowLinkDialog(false)} color="primary" variant="contained">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Question Dialog */}
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 800, color: 'primary.main', textAlign: 'center', pb: 0, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.2, px: { xs: 1, sm: 2 } }}>
              Edit Question
            </DialogTitle>
            <DialogContent sx={{ p: { xs: 1, sm: 3 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Question"
                  value={editedQuestion.question}
                  onChange={e => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
                  fullWidth
                  multiline
                  minRows={2}
                  sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.1rem' }, mt: 1 }}
                  InputLabelProps={{ style: { whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.2 } }}
                />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mt: 1 }}>Options</Typography>
                <Grid container spacing={2}>
                  {editedQuestion.options.map((opt, oidx) => (
                    <Grid item xs={12} sm={6} key={oidx}>
                      <TextField
                        label={`Option ${oidx + 1}`}
                        value={opt}
                        onChange={e => {
                          const newOptions = [...editedQuestion.options];
                          newOptions[oidx] = e.target.value;
                          setEditedQuestion({ ...editedQuestion, options: newOptions });
                        }}
                        fullWidth
                        sx={{ fontWeight: 500 }}
                      />
                    </Grid>
                  ))}
                </Grid>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Correct Answer</InputLabel>
                  <Select
                    value={editedQuestion.correctAnswer}
                    label="Correct Answer"
                    onChange={e => setEditedQuestion({ ...editedQuestion, correctAnswer: Number(e.target.value) })}
                  >
                    {editedQuestion.options.map((opt, oidx) => (
                      <MenuItem value={oidx} key={oidx}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: { xs: 1, sm: 3 }, pb: 2 }}>
              <Button onClick={() => setEditDialogOpen(false)} color="secondary" sx={{ fontWeight: 700, borderRadius: '10px', px: 3 }}>Cancel</Button>
              <Button onClick={saveEditedQuestion} color="primary" variant="contained" sx={{ fontWeight: 700, borderRadius: '10px', px: 3 }}>Save</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default CreateQuiz; 