import React from 'react';

function CognitiveTrainingPage() {
  return (
    <div className="page-container">
      <h1>Cognitive Training</h1>
      <p>Engage in personalized exercises to strengthen your cognitive abilities.</p>
      <div className="training-exercises">
        <div className="exercise-card">
          <h3>Word Recall Challenge</h3>
          <p>Test and improve your memory by recalling words after brief exposure.</p>
          <button className="primary-button">Start Exercise</button>
        </div>
        <div className="exercise-card">
          <h3>Language Fluency Game</h3>
          <p>Enhance verbal fluency by generating words in specific categories.</p>
          <button className="primary-button">Start Exercise</button>
        </div>
        <div className="exercise-card">
          <h3>Reading Comprehension</h3>
          <p>Strengthen comprehension skills through targeted reading exercises.</p>
          <button className="primary-button">Start Exercise</button>
        </div>
      </div>
    </div>
  );
}

export default CognitiveTrainingPage; 