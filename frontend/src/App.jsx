import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from './components/Layout'

// Standalone Pages
import Hero from './pages/Hero'
import Login from './pages/Login'
import Signup from './pages/Signup'

// App Pages
import CandidateUpload from './pages/CandidateUpload'
import { CandidateSummary } from './components/CandidateSummary'
import { EvaluationSection } from './components/EvaluationSection'
import Analytics from './pages/Analytics'

function AppContent() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Standalone routes (No Sidebar) */}
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* App routes (With Sidebar) */}
        <Route element={<Layout />}>
          <Route path="/app" element={<Navigate to="/upload" replace />} />
          <Route path="/dashboard" element={<Navigate to="/candidate" replace />} />
          
          <Route path="/upload" element={<CandidateUpload />} />
          <Route path="/candidate" element={<CandidateSummary />} />
          <Route path="/evaluation" element={<EvaluationSection />} />
          <Route path="/insights" element={<Analytics />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}