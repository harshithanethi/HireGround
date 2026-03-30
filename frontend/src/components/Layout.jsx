import { Sidebar } from "./Sidebar"
import { Outlet } from "react-router-dom"
import { PageTransition } from "./PageTransition"
import { AnimatePresence } from "framer-motion"

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 overflow-x-hidden">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
             {/* Outlet handles nested route components */}
             <Outlet />
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
