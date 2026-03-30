import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from './components/Layout'

// Standalone Pages
import Hero from './pages/Hero'
import Login from './pages/Login'
import Signup from './pages/Signup'

// App Pages
import MainApp from './pages/MainApp'

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
          <Route path="/app" element={<MainApp />} />
          {/* Legacy redirects */}
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="/upload" element={<Navigate to="/app" replace />} />
          <Route path="/compare" element={<Navigate to="/app" replace />} />
          <Route path="/analytics" element={<Navigate to="/app" replace />} />
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