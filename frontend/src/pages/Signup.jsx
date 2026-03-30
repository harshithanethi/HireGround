import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { PageTransition } from "../components/PageTransition"
import { cn } from "../lib/utils"

export default function Signup() {
  const [role, setRole] = useState('recruiter')

  return (
    <PageTransition className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <Link to="/" className="fixed top-8 left-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-sm">
          H
        </div>
        <span className="font-black tracking-tighter text-2xl text-gray-900 hidden sm:block">HireGround</span>
      </Link>
      
      <Card className="max-w-md w-full p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-gray-100 mt-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Create an account</h2>
          <p className="text-gray-500 font-medium">Join the fair hiring movement.</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            type="button"
            className={cn("flex-1 py-2 font-bold text-sm rounded-lg transition-all", role === 'recruiter' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700')}
            onClick={() => setRole('recruiter')}
          >
            Recruiter
          </button>
          <button 
            type="button"
            className={cn("flex-1 py-2 font-bold text-sm rounded-lg transition-all", role === 'candidate' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700')}
            onClick={() => setRole('candidate')}
          >
            Candidate
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400"
              placeholder="Jaya Menon"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400"
              placeholder="name@company.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400"
              placeholder="••••••••"
            />
          </div>

          <Button className="w-full mt-2" size="lg">Sign Up</Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">or sign up with</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <Button variant="outline" className="w-full mt-6" size="lg">
          Google SSO
        </Button>
      </Card>
      
      <p className="mt-8 text-sm text-gray-500 font-medium">
        Already have an account? <Link to="/login" className="text-secondary hover:underline font-bold">Log in</Link>
      </p>
    </PageTransition>
  )
}