import React, { useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel, TextField, Radio, RadioGroup, FormControlLabel, Snackbar, Alert, Card, CardContent, List, ListItem, ListItemText, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import VoiceRecorder from '../components/VoiceRecorder';
import axios from '../utils/axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const VoiceQuizPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdQuizId, setCreatedQuizId] = useState(null);
  const [topic, setTopic] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  if (authLoading) {
    return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>;
  }
  if (!user) {
    navigate('/admin/login');
    return null;
  }

  // Handler for when audio and transcript are saved from VoiceRecorder
  const handleAudioSave = (blob, transcriptText) => {
    setAudioBlob(blob);
    setAudioURL(URL.createObjectURL(blob));
    setTranscript(transcriptText);
    setQuestions([]);
  };

  const handleGenerateQuestions = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await axios.post('/api/admin/quiz/generate-questions-from-transcript', { transcript, numQuestions });
      setQuestions(res.data.questions || []);
      setTopic(res.data.topic || 'Voice Quiz');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  };

  // Editable questions logic
  const handleQuestionChange = (idx, value) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, question: value } : q));
  };
  const handleOptionChange = (qIdx, oIdx, value) => {
    setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, options: q.options.map((opt, j) => j === oIdx ? value : opt) } : q));
  };
  const handleCorrectChange = (qIdx, value) => {
    setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, correctAnswer: Number(value) } : q));
  };

  const handleCreateQuiz = async () => {
    setCreating(true);
    setError('');
    try {
      // Use topic from state, not transcript slice
      const difficulty = 'medium';
      const res = await axios.post('/api/admin/quiz/create', {
        topic,
        difficulty,
        questions
      });
      setSuccess(true);
      setCreatedQuizId(res.data.quizId);
      // Do NOT redirect. Just show the success message and let the user decide.
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/admin/login');
      } else {
        setError(err.response?.data?.message || 'Failed to create quiz');
      }
    } finally {
      setCreating(false);
    }
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
    <Box sx={{ minHeight: '100vh', bgcolor: theme => theme.palette.mode === 'dark' ? 'background.default' : 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', py: 6 }}>
      <Paper elevation={6} sx={{ maxWidth: 700, width: '100%', p: 5, borderRadius: 6, mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: theme => theme.palette.mode === 'dark' ? 'rgba(30,30,40,0.98)' : 'rgba(255,255,255,0.95)' }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: theme => theme.palette.mode === 'dark' ? '#ff7eb3' : '#ff758c', textAlign: 'center' }}>
          Poll Creator
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: theme => theme.palette.mode === 'dark' ? '#b39ddb' : '#7e3ff2', textAlign: 'center' }}>
          Record your Meeting, generate questions, and create polls in seconds!
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {!audioBlob && (
          <VoiceRecorder onSave={handleAudioSave} />
        )}
        {audioBlob && transcript && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme => theme.palette.mode === 'dark' ? '#ff7eb3' : '#ff758c', mb: 1 }}>Transcript:</Typography>
            <Paper sx={{ p: 2, mb: 2, bgcolor: theme => theme.palette.mode === 'dark' ? '#23243a' : '#f6f6f6', borderRadius: 2, fontSize: '1.1rem', color: theme => theme.palette.mode === 'dark' ? '#fff' : '#23243a' }}>{transcript}</Paper>
            <FormControl sx={{ minWidth: 180, mb: 2 }}>
              <InputLabel id="num-questions-label">Number of Questions</InputLabel>
              <Select labelId="num-questions-label" value={numQuestions} label="Number of Questions" onChange={e => setNumQuestions(Number(e.target.value))}>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" sx={{ fontWeight: 700, px: 4, py: 1.5, borderRadius: 3, ml: 2 }} disabled={generating} onClick={handleGenerateQuestions}>
              {generating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Generate Questions'}
            </Button>
          </Box>
        )}
        {questions.length > 0 && (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: theme => theme.palette.mode === 'dark' ? '#b39ddb' : '#7e3ff2', mb: 2 }}>Generated Questions</Typography>
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
            <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} sx={{ fontWeight: 700, px: 4, py: 1.5, borderRadius: 3, mt: 4 }} onClick={handleCreateQuiz} disabled={creating}>
              {creating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Quiz'}
            </Button>
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
          </Box>
        )}
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Quiz created successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default VoiceQuizPage;
