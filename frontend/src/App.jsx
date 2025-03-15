import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CognitiveAssessment from './components/CognitiveAssessment';
import './App.css';

// Home page component
const Home = () => (
    <div className="home-container">
        <div className="home-content">
            <h1>Early Detection of Alzheimer's Through Language Analysis</h1>
            <p>
                Welcome to our AI-powered platform for early detection of cognitive decline.
                This tool analyzes speech and language patterns to identify potential signs of
                Alzheimer's disease and other cognitive impairments.
            </p>

            <div className="features">
                <div className="feature-card">
                    <h3>Speech Analysis</h3>
                    <p>
                        Record or upload speech samples to analyze linguistic patterns that may
                        indicate early signs of cognitive decline.
                    </p>
                </div>

                <div className="feature-card">
                    <h3>Text Analysis</h3>
                    <p>
                        Enter text samples to analyze linguistic features and receive an assessment
                        of potential cognitive concerns.
                    </p>
                </div>

                <div className="feature-card">
                    <h3>Detailed Reports</h3>
                    <p>
                        Receive comprehensive reports with risk assessments, linguistic metrics,
                        and personalized recommendations.
                    </p>
                </div>
            </div>

            <div className="cta-container">
                <Link to="/assessment" className="cta-button">
                    Try Cognitive Assessment Tool
                </Link>
            </div>

            <div className="disclaimer">
                <h3>Important Disclaimer</h3>
                <p>
                    This tool is for educational and research purposes only and is not intended to
                    diagnose any medical condition. Always consult healthcare professionals for proper
                    diagnosis and treatment of Alzheimer's disease and other cognitive disorders.
                </p>
            </div>
        </div>
    </div>
);

// About page component
const About = () => (
    <div className="about-container">
        <h1>About This Project</h1>
        <p>
            This platform uses advanced natural language processing and machine learning techniques
            to analyze speech and language patterns that may indicate early signs of cognitive decline.
        </p>

        <h2>How It Works</h2>
        <p>
            Our system analyzes various linguistic features such as lexical diversity, syntactic
            complexity, semantic coherence, and other language patterns that have been shown to
            change in the early stages of Alzheimer's disease and mild cognitive impairment.
        </p>

        <h2>Technology Stack</h2>
        <ul>
            <li><strong>Speech-to-Text:</strong> Whisper (both local and API modes)</li>
            <li><strong>Language Analysis:</strong> spaCy, custom NLP algorithms</li>
            <li><strong>Backend:</strong> FastAPI (Python)</li>
            <li><strong>Frontend:</strong> React</li>
        </ul>

        <h2>Scientific Background</h2>
        <p>
            Research has shown that changes in language usage can precede clinical diagnosis of
            Alzheimer's disease by several years. Our algorithms are based on peer-reviewed research
            in cognitive linguistics and neuropsychology.
        </p>

        <div className="disclaimer">
            <h2>Disclaimer</h2>
            <p>
                This tool is for educational and research purposes only. It is not intended to diagnose
                any medical condition or replace professional medical advice. Always consult qualified
                healthcare professionals for proper diagnosis and treatment of Alzheimer's disease and
                other cognitive disorders.
            </p>
        </div>
    </div>
);

// Main App component
const App = () => {
    return (
        <Router>
            <div className="app">
                <header className="app-header">
                    <div className="logo">
                        <Link to="/">Alzheimer's Early Detection</Link>
                    </div>
                    <nav className="main-nav">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/assessment">Assessment Tool</Link></li>
                            <li><Link to="/about">About</Link></li>
                        </ul>
                    </nav>
                </header>

                <main className="app-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/assessment" element={<CognitiveAssessment />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </main>

                <footer className="app-footer">
                    <p>
                        &copy; {new Date().getFullYear()} Alzheimer's Early Detection Tool.
                        This application is for educational and research purposes only.
                    </p>
                </footer>
            </div>
        </Router>
    );
};

export default App; 