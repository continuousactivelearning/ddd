import React, { useRef, useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Box, IconButton, CircularProgress, Typography, Paper } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button } from '@mui/material';

const VoiceRecorder = ({ onSave }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startRecording = async () => {
    setAudioURL(null);
    setAudioBlob(null);
    setTranscript('');
    setRecordingTime(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new window.MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSave = async () => {
    if (audioBlob) {
      setUploading(true);
      setUploadResult(null);
      setTranscript('');
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        const res = await axios.post('/api/admin/quiz/upload-audio', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setUploadResult({ success: true, message: res.data.message });
        setTranscript(res.data.transcript || '');
        if (onSave) onSave(audioBlob, res.data.transcript || '');
      } catch (err) {
        setUploadResult({ success: false, message: err.response?.data?.message || 'Upload failed' });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleReRecord = () => {
    setAudioURL(null);
    setAudioBlob(null);
    setTranscript('');
    setUploadResult(null);
    setRecordingTime(0);
  };

  return (
    <Box sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 320, width: '100%' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: theme => theme.palette.mode === 'dark' ? '#ff7eb3' : '#7e3ff2' }}>
        Voice Recorder
      </Typography>
      {/* Recording UI */}
      {!audioURL && (
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', mb: 1 }}>
            <IconButton
              onClick={recording ? stopRecording : startRecording}
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: recording ? 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' : 'linear-gradient(135deg, #7e3ff2 0%, #b39ddb 100%)',
                color: '#fff',
                boxShadow: recording ? '0 0 24px 8px #ff7eb3' : '0 2px 8px rgba(99,102,241,0.12)',
                transition: 'all 0.3s',
                '&:hover': {
                  background: recording ? 'linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%)' : 'linear-gradient(135deg, #b39ddb 0%, #7e3ff2 100%)',
                  transform: 'scale(1.08)',
                },
                zIndex: 2,
              }}
              disabled={uploading}
            >
              {recording ? <MicIcon sx={{ fontSize: 56, animation: 'pulse 1.2s infinite' }} /> : <MicIcon sx={{ fontSize: 56 }} />}
            </IconButton>
            {recording && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  border: '4px solid #ff7eb3',
                  animation: 'pulseRing 1.2s infinite',
                  zIndex: 1,
                }}
              />
            )}
            <style>{`
              @keyframes pulse {
                0% { box-shadow: 0 0 0 0 #ff7eb3; }
                70% { box-shadow: 0 0 0 24px rgba(255,126,179,0); }
                100% { box-shadow: 0 0 0 0 rgba(255,126,179,0); }
              }
              @keyframes pulseRing {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                70% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.2); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(1.4); }
              }
            `}</style>
          </Box>
          <Typography variant="body1" sx={{ color: recording ? '#ff7eb3' : '#7e3ff2', fontWeight: 600, mt: 1 }}>
            {recording ? 'Recording... Click to stop' : 'Click to start recording'}
          </Typography>
          {recording && (
            <Typography variant="h6" sx={{ color: '#ff7eb3', fontWeight: 700, mt: 1, letterSpacing: 1 }}>
              {formatTime(recordingTime)}
            </Typography>
          )}
        </Box>
      )}
      {/* After Recording UI */}
      {audioURL && (
        <Box sx={{ mb: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <audio src={audioURL} controls style={{ width: '100%' }} />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReRecord}
              disabled={uploading}
              sx={{ fontWeight: 700, borderRadius: 3, px: 3, py: 1 }}
            >
              Re-record
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={uploading}
              sx={{ fontWeight: 700, borderRadius: 3, px: 3, py: 1 }}
            >
              {uploading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save & Upload'}
            </Button>
          </Box>
        </Box>
      )}
      {uploadResult && (
        <Typography sx={{ mt: 2, color: uploadResult.success ? 'green' : 'red', fontWeight: 600 }}>
          {uploadResult.message}
        </Typography>
      )}
      {transcript && (
        <Box sx={{ mt: 3, background: '#f6f6f6', p: 2, borderRadius: 2, width: '100%' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#7e3ff2', mb: 1 }}>Transcript:</Typography>
          <Typography variant="body2" sx={{ color: '#23243a' }}>{transcript}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default VoiceRecorder; 