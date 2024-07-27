import React, { useState, useRef } from 'react';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false); // 녹화 상태를 관리하는 상태 변수
  const [videoUrl, setVideoUrl] = useState(''); // 녹화된 비디오의 URL을 저장하는 상태 변수
  const mediaRecorderRef = useRef(null); // MediaRecorder 인스턴스를 저장하는 ref
  const chunksRef = useRef([]); // 녹화된 비디오 데이터를 저장하는 ref

  const startRecording = async () => {
    try {
      // 화면 및 오디오 스트림을 가져옴
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: true, // 에코 제거 설정
          noiseSuppression: true, // 소음 억제 설정
        },
      });

      // 마이크 오디오 스트림을 가져옴
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // 화면 스트림과 마이크 오디오 스트림을 결합
      const combinedStream = new MediaStream([
        ...stream.getVideoTracks(), // 화면 비디오 트랙 추가
        ...audioStream.getAudioTracks(), // 마이크 오디오 트랙 추가
      ]);

      // MediaRecorder 인스턴스를 생성하고 설정
      mediaRecorderRef.current = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm; codecs=vp8, opus', // 코덱 설정
      });

      // 데이터가 제공될 때 호출되는 이벤트 핸들러
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data); // 비디오 데이터를 chunks 배열에 추가
        }
      };

      // 녹화가 중지되었을 때 호출되는 이벤트 핸들러
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' }); // 비디오 데이터로 Blob 생성
        const url = URL.createObjectURL(blob); // Blob URL 생성
        setVideoUrl(url); // 비디오 URL 상태 업데이트
        chunksRef.current = []; // chunks 배열 초기화
      };

      // 녹화 시작
      mediaRecorderRef.current.start();
      setIsRecording(true); // 녹화 상태 업데이트
    } catch (error) {
      console.error('Error starting recording:', error); // 에러 로그 출력
      alert(
        '녹화를 시작하지 못했습니다. 권한을 확인하고 다시 시도해주세요.', // 에러 메시지 출력
      );
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop(); // 녹화 중지
    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop()); // 스트림 트랙 중지
    setIsRecording(false); // 녹화 상태 업데이트
  };

  return (
    <div>
      <h1>화면 녹화기</h1>
      {isRecording ? (
        <button onClick={stopRecording}>녹화 중지</button> // 녹화 중지 버튼
      ) : (
        <button onClick={startRecording}>녹화 시작</button> // 녹화 시작 버튼
      )}
      {videoUrl && (
        <div>
          <h2>녹화된 비디오</h2>
          <video src={videoUrl} controls width="600" />{' '}
          {/* 녹화된 비디오 표시 */}
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
