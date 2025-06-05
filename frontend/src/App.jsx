import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

// Import contexts
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'

// Import components
import Navigation from './components/Navigation.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Import cognitive games components
import { WordRecallChallenge, LanguageFluencyGame, CategoryNamingGame } from './components/cognitive-games'

// Import pages
import HomePage from './pages/HomePage.jsx'
import AIScreeningPage from './pages/AIScreeningPage.jsx'
import CognitiveTraining from './pages/CognitiveTraining.jsx'
import ResourceHubPage from './pages/ResourceHubPage.jsx'
import EarlyDetectionQuizPage from './pages/EarlyDetectionQuizPage.jsx'
import MemoryMatchPage from './pages/MemoryMatchPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import CookiePolicy from './pages/CookiePolicy.jsx'
import DataProtection from './pages/DataProtection.jsx'

function AppContent() {
  const location = useLocation();

  // Pages that should have full-width layout
  const fullWidthPages = ['/'];
  const isFullWidth = fullWidthPages.includes(location.pathname);

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-200 ${isFullWidth ? '' : 'bg-white dark:bg-gray-900'}`}>
      <Navigation />

      <main className={`flex-grow ${isFullWidth ? 'w-full' : 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/screening" element={
            <ProtectedRoute>
              <AIScreeningPage />
            </ProtectedRoute>
          } />
          <Route path="/quiz" element={<EarlyDetectionQuizPage />} />
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
          <Route path="/cognitive-training/memory-match" element={
            <ProtectedRoute>
              <MemoryMatchPage />
            </ProtectedRoute>
          } />
          <Route path="/cognitive-training/category-naming" element={
            <ProtectedRoute>
              <CategoryNamingGame />
            </ProtectedRoute>
          } />
          {/* TODO: Implement ReadingComprehension component
          <Route path="/cognitive-training/reading-comprehension" element={
            <ProtectedRoute>
              <ReadingComprehension />
            </ProtectedRoute>
          } /> 
          */}
          <Route path="/resources" element={<ResourceHubPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/data-protection" element={<DataProtection />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
