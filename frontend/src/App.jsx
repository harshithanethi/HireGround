import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from './components/Layout'
import { AppProvider } from './context/AppContext'

// Standalone Pages
import Hero from './pages/Hero'
import Login from './pages/Login'
import Signup from './pages/Signup'

// App Pages
import CandidateUpload from './pages/CandidateUpload'
import { CandidateSummary } from './components/CandidateSummary'
import { EvaluationSection } from './components/EvaluationSection'
import Analytics from './pages/Analytics'
import FairnessPlatform from './pages/FairnessPlatform'
import BatchUpload from './pages/BatchUpload'
import FairnessPassport from './pages/FairnessPassport'

// Admin
import { AdminProvider } from './admin/AdminContext'
import { AdminLayout } from './admin/components/AdminLayout'
import AdminHome from './admin/pages/AdminHome'
import AdminCandidates from './admin/pages/AdminCandidates'
import AdminCandidateDetail from './admin/pages/AdminCandidateDetail'
import AdminScoringConfig from './admin/pages/AdminScoringConfig'
import AdminConstraints from './admin/pages/AdminConstraints'
import AdminSettings from './admin/pages/AdminSettings'

function AdminShell() {
  return (
    <AdminProvider>
      <AdminLayout />
    </AdminProvider>
  )
}

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
          <Route path="/batch" element={<BatchUpload />} />
          <Route path="/candidate" element={<CandidateSummary />} />
          <Route path="/evaluation" element={<EvaluationSection />} />
          <Route path="/insights" element={<Analytics />} />
          <Route path="/passport/:id" element={<FairnessPassport />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminShell />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/candidates" element={<AdminCandidates />} />
          <Route path="/admin/candidates/:id" element={<AdminCandidateDetail />} />
          <Route path="/admin/scoring-config" element={<AdminScoringConfig />} />
          <Route path="/admin/constraints" element={<AdminConstraints />} />
          <Route path="/admin/fairness" element={<FairnessPlatform />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  )
}