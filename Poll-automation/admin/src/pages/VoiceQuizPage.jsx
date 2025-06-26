import React, { useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import VoiceRecorder from '../components/VoiceRecorder';
import axios from '../utils/axios';

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

  const handleCreateQuiz = () => {
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      navigate('/admin');
    }, 1200);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme => theme.palette.mode === 'dark' ? 'background.default' : 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', py: 6 }}>
      <Paper elevation={6} sx={{ maxWidth: 700, width: '100%', p: 5, borderRadius: 6, mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: theme => theme.palette.mode === 'dark' ? 'rgba(30,30,40,0.98)' : 'rgba(255,255,255,0.95)' }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: theme => theme.palette.mode === 'dark' ? '#ff7eb3' : '#ff758c', textAlign: 'center' }}>
          Voice to Quiz
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: theme => theme.palette.mode === 'dark' ? '#b39ddb' : '#7e3ff2', textAlign: 'center' }}>
          Record your voice, generate questions, and create a quiz in seconds!
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
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
            <Typography variant="h5" sx={{ fontWeight: 800, color: theme => theme.palette.mode === 'dark' ? '#b39ddb' : '#7e3ff2', mb: 2 }}>Edit Questions</Typography>
            {questions.map((q, idx) => (
              <Paper key={idx} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: theme => theme.palette.mode === 'dark' ? '#2a2a3a' : '#f3f0ff' }}>
                <TextField
                  label={`Question ${idx + 1}`}
                  value={q.question}
                  onChange={e => handleQuestionChange(idx, e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                {q.options.map((opt, oidx) => (
                  <TextField
                    key={oidx}
                    label={`Option ${String.fromCharCode(65 + oidx)}`}
                    value={opt}
                    onChange={e => handleOptionChange(idx, oidx, e.target.value)}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                ))}
                <FormControl component="fieldset" sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Correct Answer:</Typography>
                  <RadioGroup
                    row
                    value={q.correctAnswer}
                    onChange={e => handleCorrectChange(idx, e.target.value)}
                  >
                    {q.options.map((opt, oidx) => (
                      <FormControlLabel
                        key={oidx}
                        value={oidx}
                        control={<Radio color="success" />}
                        label={String.fromCharCode(65 + oidx)}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Paper>
            ))}
            <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} sx={{ fontWeight: 700, px: 4, py: 1.5, borderRadius: 3, mt: 2 }} onClick={handleCreateQuiz} disabled={creating}>
              {creating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Quiz'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default VoiceQuizPage; 