import { Link } from 'react-router-dom'
import { Button } from './ui/Button'

export function HeroNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-sm">
            H
          </div>
          <div>
            <div className="font-black tracking-tighter text-2xl text-gray-900 leading-none">HireGround</div>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-600">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#results" className="hover:text-primary transition-colors">Results</a>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
            Log in
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm" className="rounded-full shadow-md shadow-primary/20">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
