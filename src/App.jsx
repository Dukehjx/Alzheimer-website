import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Import components
import Navigation from './components/Navigation.jsx'

// Import pages
import HomePage from './pages/HomePage.jsx'
import AIScreeningPage from './pages/AIScreeningPage.jsx'
import CognitiveTrainingPage from './pages/CognitiveTrainingPage.jsx'
import ResourceHubPage from './pages/ResourceHubPage.jsx'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/screening" element={<AIScreeningPage />} />
          <Route path="/training" element={<CognitiveTrainingPage />} />
          <Route path="/resources" element={<ResourceHubPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
