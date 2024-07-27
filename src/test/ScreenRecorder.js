import React, { useState, useRef } from 'react';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp8, opus', // Specify codecs
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert(
        'Failed to start recording. Please check your permissions and try again.',
      );
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop()); // Stop the stream tracks
    setIsRecording(false);
  };

  return (
    <div>
      <h1>Screen Recorder</h1>
      {isRecording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {videoUrl && (
        <div>
          <h2>Recorded Video</h2>
          <video src={videoUrl} controls width="600" />
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
