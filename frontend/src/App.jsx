import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import CandidateUpload from './pages/CandidateUpload'
import RecruiterDashboard from './pages/RecruiterDashboard'
import ComparisonView from './pages/ComparisonView'
import FairnessPassport from './pages/FairnessPassport'
import Analytics from './pages/Analytics'

function NavBar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { to: '/', label: 'Apply', icon: '↑' },
    { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { to: '/compare', label: 'Compare', icon: '⇄' },
    { to: '/analytics', label: 'Analytics', icon: '▲' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#04050f]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded-lg bg-[#f59e0b] rotate-6 group-hover:rotate-12 transition-transform duration-300" />
            <div className="relative rounded-lg bg-[#04050f] border border-[#f59e0b]/40 w-full h-full flex items-center justify-center text-[#f59e0b] text-xs font-black">H</div>
          </div>
          <div>
            <span className="text-white font-black text-sm tracking-tight">HireGround</span>
            <span className="ml-2 text-[9px] font-bold text-[#f59e0b]/70 uppercase tracking-widest">FAIR AI</span>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all duration-200
                ${location.pathname === l.to
                  ? 'bg-[#f59e0b] text-[#04050f]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>
              <span className="text-[10px]">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Offline indicator */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          OFFLINE READY
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#04050f] text-white font-['DM_Sans',sans-serif]">
        <NavBar />
        <div className="pt-14">
          <Routes>
            <Route path="/" element={<CandidateUpload />} />
            <Route path="/dashboard" element={<RecruiterDashboard />} />
            <Route path="/compare" element={<ComparisonView />} />
            <Route path="/passport/:id" element={<FairnessPassport />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}