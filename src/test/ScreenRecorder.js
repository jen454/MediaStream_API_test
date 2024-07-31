import React, { useState, useRef } from 'react';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // 화면 스트림을 가져옴
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true, // 여기서는 화면 오디오 포함
      });

      // 마이크 오디오 스트림을 가져옴
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // 화면 스트림의 오디오 트랙을 가져옴
      const displayAudioTrack = displayStream.getAudioTracks()[0];

      // 오디오 컨텍스트를 사용하여 두 오디오 스트림을 결합
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();

      if (displayAudioTrack) {
        const source1 = audioContext.createMediaStreamSource(
          new MediaStream([displayAudioTrack]),
        );
        source1.connect(destination);
      }

      if (audioStream.getAudioTracks().length > 0) {
        const source2 = audioContext.createMediaStreamSource(audioStream);
        source2.connect(destination);
      }

      // 결합된 오디오 스트림과 비디오 트랙을 하나의 스트림으로 결합
      const combinedStream = new MediaStream([
        ...displayStream.getVideoTracks(),
        ...destination.stream.getAudioTracks(),
      ]);

      mediaRecorderRef.current = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm; codecs=vp8, opus',
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
      alert('녹화를 시작하지 못했습니다. 권한을 확인하고 다시 시도해주세요.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop());
    setIsRecording(false);
  };

  return (
    <div>
      <h1>화면 녹화기</h1>
      {isRecording ? (
        <button onClick={stopRecording}>녹화 중지</button>
      ) : (
        <button onClick={startRecording}>녹화 시작</button>
      )}
      {videoUrl && (
        <div>
          <h2>녹화된 비디오</h2>
          <video src={videoUrl} controls width="600" />
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
