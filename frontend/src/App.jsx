import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from './components/Layout'

// Standalone Pages
import Hero from './pages/Hero'
import Login from './pages/Login'
import Signup from './pages/Signup'

// App Pages
import RecruiterDashboard from './pages/RecruiterDashboard'
import CandidateUpload from './pages/CandidateUpload'
import ComparisonView from './pages/ComparisonView'
import FairnessPassport from './pages/FairnessPassport'
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
          <Route path="/dashboard" element={<RecruiterDashboard />} />
          <Route path="/upload" element={<CandidateUpload />} />
          <Route path="/compare" element={<ComparisonView />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/passport/:id" element={<FairnessPassport />} />
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