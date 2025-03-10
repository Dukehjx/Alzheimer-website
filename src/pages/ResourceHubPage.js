import React from 'react';

function ResourceHubPage() {
  return (
    <div className="page-container">
      <h1>Resource Hub</h1>
      <p>Access the latest information, research, and community support.</p>
      <div className="resources-container">
        <div className="resource-section">
          <h2>Knowledge Base</h2>
          <ul className="resource-list">
            <li><a href="#/resources/mci-signs">Understanding MCI and Early Alzheimer's Signs</a></li>
            <li><a href="#/resources/prevention">Prevention Strategies Based on Current Research</a></li>
            <li><a href="#/resources/caregivers">Caregiver Resources and Support</a></li>
            <li><a href="#/resources/treatment">Medication and Treatment Options</a></li>
          </ul>
        </div>
        <div className="resource-section">
          <h2>Latest Research</h2>
          <div className="research-articles">
            <div className="article-card">
              <h3>New Study on Linguistic Markers</h3>
              <p>Recent findings on how language changes can predict cognitive decline.</p>
              <a href="#/resources/article/linguistic-markers">Read More</a>
            </div>
            <div className="article-card">
              <h3>Advances in Early Detection</h3>
              <p>How AI technology is revolutionizing early detection methods.</p>
              <a href="#/resources/article/ai-detection">Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceHubPage; 