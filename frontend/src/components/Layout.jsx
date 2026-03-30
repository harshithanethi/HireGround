import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Menu } from "lucide-react"
import { AnimatePresence } from "framer-motion"

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">
      {/* App Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 flex items-center px-4 md:px-6 justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xs shadow-md shadow-primary/20">
              H
            </div>
            <span className="text-gray-900 font-extrabold tracking-tight text-lg">HireGround</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-500">
            <span className="w-2 h-2 rounded-full bg-positive"></span>
             System Online
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs ring-2 ring-white cursor-pointer hover:ring-gray-100 transition-all">
            AJ
          </div>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      {/* Keep full height and scrollable for the stacked cards effect */}
      <main className="flex-1 w-full bg-gray-50">
        <AnimatePresence mode="wait">
           <Outlet />
        </AnimatePresence>
      </main>
    </div>
  )
}
