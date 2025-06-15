import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';

interface Props {
  url: string;
}

const CoursePlayer: React.FC<Props> = ({ url }) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [seconds, setSeconds] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    if (seconds > 0 && seconds % 30 === 0) {
      setShowQuestion(true);
    }
  }, [seconds]);

  return (
    <div className="space-y-4">
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={!showQuestion}
        controls
        onProgress={({ playedSeconds }) => setSeconds(Math.floor(playedSeconds))}
        width="100%"
        height="400px"
      />
      {showQuestion && (
        <div className="p-4 bg-yellow-100 rounded shadow">
          <p><strong>Quiz Time!</strong> Answer this before continuing...</p>
          {/* Replace with actual question logic */}
          <button
            onClick={() => setShowQuestion(false)}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
