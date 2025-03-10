import React from 'react';

function HomePage() {
  return (
    <>
      <header>
        <h1>AI-Powered Platform for Early Detection of MCI & Alzheimer's Prevention</h1>
      </header>
      
      <main>
        <section className="features-section">
          <h2>Our Core Features</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <h3>AI Screening</h3>
              <p>Early detection through AI language analysis of speech patterns, vocabulary usage, and linguistic markers associated with cognitive decline.</p>
            </div>
            <div className="feature-card">
              <h3>Cognitive Training</h3>
              <p>Personalized exercises and activities scientifically designed to maintain and strengthen cognitive abilities and neural pathways.</p>
            </div>
            <div className="feature-card">
              <h3>Resource Hub</h3>
              <p>Comprehensive information, latest research, and supportive community for patients, caregivers, and healthcare professionals.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default HomePage; 