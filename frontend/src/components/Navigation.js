import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="main-nav">
      <div className="nav-logo">
        <Link to="/">BrainHealth AI</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/screening">AI Screening</Link></li>
        <li><Link to="/training">Cognitive Training</Link></li>
        <li><Link to="/resources">Resource Hub</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation; 