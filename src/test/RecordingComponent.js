import React, { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';

const ffmpeg = new FFmpeg({ log: true });

function ScreenRecordingComponent({ onConversionComplete }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [displayStream, setDisplayStream] = useState(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      const webmBlob = new Blob(chunks.current, { type: 'video/webm' });
      await convertWebMtoMP4(webmBlob);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setDisplayStream(stream);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    displayStream.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  const convertWebMtoMP4 = async (webmBlob) => {
    await ffmpeg.load();

    // WebM Blob을 ArrayBuffer로 변환
    const webmArrayBuffer = await webmBlob.arrayBuffer();
    // 가상 파일 시스템에 파일 쓰기
    ffmpeg.FS('writeFile', 'input.webm', new Uint8Array(webmArrayBuffer));

    // WebM을 MP4로 변환
    await ffmpeg.run('-i', 'input.webm', 'output.mp4');

    // 변환된 MP4 파일 읽기
    const data = ffmpeg.FS('readFile', 'output.mp4');

    // Blob 생성 및 다운로드
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'video/mp4' }),
    );

    onConversionComplete(url);
  };

  return (
    <div>
      {recording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
    </div>
  );
}

export default ScreenRecordingComponent;
