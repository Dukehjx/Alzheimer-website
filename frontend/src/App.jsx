import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import contexts
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Import components
import Navigation from './components/Navigation.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Import cognitive games components
import { WordRecallChallenge, LanguageFluencyGame } from './components/cognitive-games'

// Import pages
import HomePage from './pages/HomePage.jsx'
import AIScreeningPage from './pages/AIScreeningPage.jsx'
import CognitiveTraining from './pages/CognitiveTraining.jsx'
import ResourceHubPage from './pages/ResourceHubPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <Navigation />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/screening" element={
                  <ProtectedRoute>
                    <AIScreeningPage />
                  </ProtectedRoute>
                } />
                <Route path="/cognitive-training" element={
                  <ProtectedRoute>
                    <CognitiveTraining />
                  </ProtectedRoute>
                } />
                {/* Cognitive Training Exercises */}
                <Route path="/cognitive-training/word-recall" element={
                  <ProtectedRoute>
                    <WordRecallChallenge />
                  </ProtectedRoute>
                } />
                <Route path="/cognitive-training/language-fluency" element={
                  <ProtectedRoute>
                    <LanguageFluencyGame />
                  </ProtectedRoute>
                } />
                <Route path="/resources" element={<ResourceHubPage />} />
                <Route path="/health-monitoring" element={
                  <ProtectedRoute>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl mb-4">Health Monitoring</h1>
                      <p>This feature is coming soon.</p>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
