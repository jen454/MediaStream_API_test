// App.js
import React from 'react';
import styled from 'styled-components';
import ScreenRecorder from './test/ScreenRecorder';
import AudioRecorder from './test/AudioRecorder';

function App() {
  return (
    <Container>
      <ScreenRecorder />
      <AudioRecorder />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
`;

export default App;
