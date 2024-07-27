// FileDownloadComponent.js
import React, { useEffect } from 'react';

function FileDownloadComponent({ fileUrl }) {
  useEffect(() => {
    if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = 'output.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [fileUrl]);

  return null;
}

export default FileDownloadComponent;
