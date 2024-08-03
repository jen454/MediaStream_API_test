let mediaRecorder;
let recordedChunks = [];

chrome.action.onClicked.addListener((tab) => {
  // 탭에서 오디오 캡처
  chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
    if (chrome.runtime.lastError || !stream) {
      console.error('Error capturing audio:', chrome.runtime.lastError);
      return;
    }

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      // 오디오 URL을 새 탭에서 열기 (또는 다른 처리)
      chrome.tabs.create({ url: url });
      recordedChunks = [];
    };

    mediaRecorder.start();

    // 10초 후에 자동으로 녹음을 중지
    setTimeout(() => {
      mediaRecorder.stop();
    }, 10000); // 10초
  });
});
