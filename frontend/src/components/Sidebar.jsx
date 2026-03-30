import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, UploadCloud, ArrowLeftRight, BarChart2, FileText, LogOut, Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'

export function Sidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false) // For mobile drawer

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/upload', label: 'Upload Candidate', icon: UploadCloud },
    { to: '/compare', label: 'Compare Models', icon: ArrowLeftRight },
    { to: '/analytics', label: 'Analytics', icon: BarChart2 },
    // A passport requires an ID, we'll dummy it out in sidebar or omit, but requirement says: Nav links with icons: Dashboard, Upload Candidate, Compare Models, Analytics, Fairness Passport
    { to: '/passport/demo', label: 'Fairness Passport', icon: FileText },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xs">
            H
          </div>
          <div>
            <div className="text-gray-900 font-black tracking-tight text-lg leading-none">HireGround</div>
          </div>
        </Link>
        <div className="hidden md:flex relative group cursor-pointer" title="Offline Ready">
          <span className="w-2.5 h-2.5 rounded-full bg-positive shrink-0" />
        </div>
      </div>

      <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">MENU</div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.to.replace('/demo', ''))
          const Icon = link.icon

          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors group",
                isActive ? "text-white" : "text-gray-500 hover:text-gray-900"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-primary rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={18} className={cn("relative z-10", isActive ? "text-white" : "text-gray-400 group-hover:text-primary")} />
              <span className="relative z-10">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
            AJ
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Ananya J.</div>
            <div className="text-xs text-gray-500">Recruiter</div>
          </div>
        </div>
        <button className="w-full flex items-center gap-2 text-sm text-gray-500 hover:text-primary font-bold transition-colors px-2 py-1.5 focus:outline-none">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Topbar overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-40 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xs">H</div>
          <span className="text-gray-900 font-black tracking-tight text-lg">HireGround</span>
        </Link>
        <button onClick={() => setIsOpen(true)} className="p-2 text-gray-900 focus:outline-none">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 md:hidden" 
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-50 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed top-0 left-0 z-40">
        <SidebarContent />
      </aside>
    </>
  )
}
