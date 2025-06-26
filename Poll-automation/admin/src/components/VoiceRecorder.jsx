import React, { useRef, useState } from 'react';
import axios from '../utils/axios';

const VoiceRecorder = ({ onSave }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    setAudioURL(null);
    setAudioBlob(null);
    setTranscript('');
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

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8, maxWidth: 400 }}>
      <h3>Voice Recorder</h3>
      <div style={{ marginBottom: 8 }}>
        {!recording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording} style={{ color: 'red' }}>Stop Recording</button>
        )}
      </div>
      {audioURL && (
        <div style={{ marginBottom: 8 }}>
          <audio src={audioURL} controls />
        </div>
      )}
      {audioBlob && (
        <button onClick={handleSave} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save & Upload'}
        </button>
      )}
      {uploadResult && (
        <div style={{ marginTop: 8, color: uploadResult.success ? 'green' : 'red' }}>
          {uploadResult.message}
        </div>
      )}
      {transcript && (
        <div style={{ marginTop: 12, background: '#f6f6f6', padding: 8, borderRadius: 4 }}>
          <strong>Transcript:</strong>
          <div style={{ marginTop: 4 }}>{transcript}</div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder; 