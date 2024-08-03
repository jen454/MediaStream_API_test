import React, { useState, useRef } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태를 관리하는 상태 변수
  const [audioUrl, setAudioUrl] = useState(''); // 녹음된 오디오의 URL을 저장하는 상태 변수
  const mediaRecorderRef = useRef(null); // MediaRecorder 인스턴스를 저장하는 ref
  const chunksRef = useRef([]); // 녹음된 오디오 데이터를 저장하는 ref

  const mergeAudioStreams = (systemStream, micStream) => {
    const context = new AudioContext();
    const destination = context.createMediaStreamDestination();

    if (systemStream) {
      const systemSource = context.createMediaStreamSource(systemStream);
      systemSource.connect(destination);
    }

    if (micStream) {
      const micSource = context.createMediaStreamSource(micStream);
      micSource.connect(destination);
    }

    return destination.stream;
  };

  const startRecording = async () => {
    try {
      // 시스템 오디오 스트림을 가져옴
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
      });

      // 마이크 오디오 스트림을 가져옴
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // 시스템 오디오와 마이크 오디오 스트림을 결합
      const combinedStream = mergeAudioStreams(displayStream, audioStream);

      // MediaRecorder 인스턴스를 생성하고 설정
      mediaRecorderRef.current = new MediaRecorder(combinedStream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('녹음을 시작하지 못했습니다. 권한을 확인하고 다시 시도해주세요.');
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
      <h1>음성 녹음기</h1>
      {isRecording ? (
        <button onClick={stopRecording}>녹음 중지</button>
      ) : (
        <button onClick={startRecording}>녹음 시작</button>
      )}
      {audioUrl && (
        <div>
          <h2>녹음된 오디오</h2>
          <audio src={audioUrl} controls />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
