import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Users, Settings, Share } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './OnlineMeet.css';

const OnlineMeet = () => {
  const { user } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const screenShareVideoRef = useRef(null);
  const [screenShareStream, setScreenShareStream] = useState(null);

  // Mock participants data
  const participants = [
    { id: 1, name: 'John Doe', role: 'Teacher', isSpeaking: true },
    { id: 2, name: 'Alice Smith', role: 'Student', isSpeaking: false },
    { id: 3, name: 'Bob Johnson', role: 'Student', isSpeaking: false },
    { id: 4, name: 'Emma Wilson', role: 'Student', isSpeaking: false },
    { id: 5, name: 'Michael Brown', role: 'Student', isSpeaking: false },
  ];

  useEffect(() => {
    // Get user's video stream
    const setupVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    setupVideo();

    // Cleanup
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [screenShareStream]);

  const handleLeaveCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      }
    if (screenShareStream) {
      screenShareStream.getTracks().forEach(track => track.stop());
    }
    window.history.back();
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always'
          },
          audio: false
        });
        setScreenShareStream(stream);
        setIsScreenSharing(true);

        // Handle screen share stop
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenShareStream(null);
        };
      } else {
        if (screenShareStream) {
          screenShareStream.getTracks().forEach(track => track.stop());
        }
        setScreenShareStream(null);
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
      setScreenShareStream(null);
      setIsScreenSharing(false);
    }
  };

  useEffect(() => {
    if (screenShareVideoRef.current && screenShareStream) {
      screenShareVideoRef.current.srcObject = screenShareStream;
    }
  }, [screenShareStream]);

  return (
    <div className="online-meet-container">
      <div className="meet-header">
        <div className="meet-info">
          <h2>Class Meeting</h2>
          <span className="meet-time">00:45:30</span>
        </div>
        <div className="meet-controls">
          <button className="control-button" onClick={toggleMute}>
            {isMuted ? <MicOff /> : <Mic />}
          </button>
          <button className="control-button" onClick={toggleVideo}>
            {isVideoOff ? <VideoOff /> : <Video />}
          </button>
          <button 
            className={`control-button ${isScreenSharing ? 'active' : ''}`} 
            onClick={toggleScreenShare}
          >
            <Share />
          </button>
          <button className="control-button" onClick={() => setShowParticipants(!showParticipants)}>
            <Users />
          </button>
          <button className="control-button" onClick={() => setShowChat(!showChat)}>
            <MessageSquare />
          </button>
          <button className="control-button" onClick={() => {}}>
            <Settings />
          </button>
          <button className="leave-button" onClick={handleLeaveCall}>
            <PhoneOff />
            Leave
          </button>
        </div>
      </div>

      <div className="meet-content">
        <div className="video-grid">
          {isScreenSharing && (
            <div className="video-tile screen-share">
              <video
                ref={screenShareVideoRef}
                autoPlay
                playsInline
                className="screen-share-video"
              />
            </div>
          )}
          {/* User's own video */}
          <div className="video-tile self-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="video-element"
            />
            <div className="participant-info">
              <span className="participant-name">You</span>
              <span className="participant-role">Student</span>
            </div>
          </div>

          {/* Other participants */}
          {participants.map((participant) => (
            <div key={participant.id} className={`video-tile ${participant.isSpeaking ? 'speaking' : ''}`}>
              <div className="video-placeholder">
                <div className="participant-info">
                  <span className="participant-name">{participant.name}</span>
                  <span className="participant-role">{participant.role}</span>
                </div>
                {participant.isSpeaking && <div className="speaking-indicator" />}
              </div>
            </div>
          ))}
        </div>

        {showParticipants && (
          <div className="participants-sidebar">
            <h3>Participants ({participants.length + 1})</h3>
            <div className="participants-list">
              <div className="participant-item">
                <div className="participant-avatar">
                  {user?.name?.charAt(0) || 'Y'}
                </div>
                <div className="participant-details">
                  <span className="participant-name">You</span>
                  <span className="participant-role">Student</span>
                </div>
                {!isMuted && <div className="speaking-dot" />}
              </div>
              {participants.map((participant) => (
                <div key={participant.id} className="participant-item">
                  <div className="participant-avatar">
                    {participant.name.charAt(0)}
                  </div>
                  <div className="participant-details">
                    <span className="participant-name">{participant.name}</span>
                    <span className="participant-role">{participant.role}</span>
                  </div>
                  {participant.isSpeaking && <div className="speaking-dot" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {showChat && (
          <div className="chat-sidebar">
            <h3>Chat</h3>
            <div className="chat-messages">
              {/* Chat messages would go here */}
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Type a message..." />
              <button>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineMeet; 