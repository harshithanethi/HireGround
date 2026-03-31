import { useMemo, useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { AdminSidebar } from "./AdminSidebar"
import { Badge } from "../../components/ui/Badge"
import { useAdmin } from "../AdminContext"

function titleForPath(pathname) {
  if (pathname === "/admin") return "Admin Dashboard"
  if (pathname.startsWith("/admin/candidates/")) return "Candidate Detail"
  if (pathname.startsWith("/admin/candidates")) return "Candidates"
  if (pathname.startsWith("/admin/scoring-config")) return "Scoring Configuration"
  if (pathname.startsWith("/admin/constraints")) return "Social Constraints"
  if (pathname.startsWith("/admin/settings")) return "Settings"
  return "Admin"
}

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const { state } = useAdmin()

  const pageTitle = useMemo(() => titleForPath(location.pathname), [location.pathname])
  const modelLabel = state.activeShortlistingModel === "equitable" ? "Custom Equitable" : "Baseline Absolute"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 flex items-center px-4 md:px-6 justify-between shadow-sm">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>

          <Link to="/admin" className="flex items-center gap-2 group cursor-pointer" title="Admin Home">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xs shadow-md shadow-primary/20">
              H
            </div>
            <div className="min-w-0">
              <div className="text-gray-900 font-extrabold tracking-tight text-lg leading-none truncate">HireGround</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Admin</div>
            </div>
          </Link>

          <div className="hidden md:block w-px h-8 bg-gray-200 mx-1" />
          <div className="hidden md:block min-w-0">
            <div className="text-sm font-black text-gray-900 tracking-tight truncate">{pageTitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="outline" className="border-gray-200 text-gray-700">
            Model: <span className="ml-1 text-gray-900">{modelLabel}</span>
          </Badge>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs ring-2 ring-white cursor-pointer hover:ring-gray-100 transition-all">
            AJ
          </div>
        </div>
      </header>

      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 w-full bg-gray-50 pt-24 pb-16 overflow-y-auto">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>

      <div className="fixed left-0 right-0 bottom-0 z-30 border-t border-gray-100 bg-white/70 backdrop-blur-md">
        <div className="px-4 md:px-6 py-2 text-[11px] font-bold text-gray-500 tracking-tight">
          All scoring decisions are auditable. No demographic proxies used. Adjustments based on structural opportunity signals only.
        </div>
      </div>
    </div>
  )
}

