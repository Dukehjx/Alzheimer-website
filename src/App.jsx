import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box, Container, CssBaseline } from '@mui/material'
import { createContext, useState } from 'react'

// Import components
import Navigation from './components/Navigation.jsx'
import Footer from './components/Footer.jsx'

// Import pages
import HomePage from './pages/HomePage.jsx'
import AIScreeningPage from './pages/AIScreeningPage.jsx'
import CognitiveTrainingPage from './pages/CognitiveTrainingPage.jsx'
import ResourceHubPage from './pages/ResourceHubPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// Create auth context
export const AuthContext = createContext()

function App() {
  // Simple auth state for demo purposes
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const authContextValue = {
    isAuthenticated,
    login: () => setIsAuthenticated(true),
    logout: () => setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: 'background.default'
          }}
        >
          <Navigation />
          
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/screening" element={<AIScreeningPage />} />
              <Route path="/training" element={<CognitiveTrainingPage />} />
              <Route path="/resources" element={<ResourceHubPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
