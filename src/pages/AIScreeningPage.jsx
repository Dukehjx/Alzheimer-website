import React from 'react';

function AIScreeningPage() {
  return (
    <div className="page-container">
      <h1>AI Screening</h1>
      <p>Upload your speech or text samples for AI analysis of potential cognitive decline markers.</p>
      <div className="screening-demo">
        <div className="upload-area">
          <h3>Upload Audio Sample</h3>
          <button className="primary-button">Select Audio File</button>
          <p>or</p>
          <button className="secondary-button">Record Audio</button>
        </div>
        <div className="text-analysis-area">
          <h3>Text Analysis</h3>
          <textarea 
            placeholder="Type or paste a text sample here for analysis..." 
            className="text-input"
            rows="6"
          ></textarea>
          <button className="primary-button">Analyze Text</button>
        </div>
      </div>
    </div>
  );
}

export default AIScreeningPage; 