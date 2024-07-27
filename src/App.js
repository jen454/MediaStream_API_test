// App.js
import React, { useState } from 'react';
import RecordingComponent from './test/RecordingComponent';
import FileDownloadComponent from './test/FileDownloadComponent';
import styled from 'styled-components';
import ScreenRecorder from './test/ScreenRecorder';

function App() {
  const [fileUrl, setFileUrl] = useState('');

  return (
    <Container>
      <ScreenRecorder />
      {/* <RecordingComponent onConversionComplete={setFileUrl} />
      {fileUrl && <FileDownloadComponent fileUrl={fileUrl} />} */}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default App;
