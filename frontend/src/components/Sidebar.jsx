import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Users, Star, BarChart2, LogOut, X } from 'lucide-react'
import { cn } from '../lib/utils'

export function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  
  const navLinks = [
    { to: '/upload', label: 'Upload', icon: UploadCloud },
    { to: '/candidate', label: 'Candidate', icon: Users },
    { to: '/evaluation', label: 'Evaluation', icon: Star },
    { to: '/insights', label: 'Insights', icon: BarChart2 },
  ]

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dimmed Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50" 
          />
          
          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '-100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white border-r border-gray-100 z-50 flex flex-col shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
                <div className="relative w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xs">
                  H
                </div>
                <div>
                  <div className="text-gray-900 font-extrabold tracking-tight text-lg leading-none">HireGround</div>
                </div>
              </Link>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <div className="px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">MENU</div>
            
            <nav className="flex-1 px-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all group",
                      isActive ? "bg-primary/10 text-primary" : "text-gray-500 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <Icon size={20} className={cn("relative z-10 transition-colors", isActive ? "text-primary" : "text-gray-400 group-hover:text-primary")} />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-gray-100 m-4 rounded-2xl bg-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 font-bold shadow-sm">
                AJ
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-900">Ananya J.</div>
                <div className="text-xs text-gray-500">Recruiter Admin</div>
              </div>
              <button 
                className="text-gray-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
