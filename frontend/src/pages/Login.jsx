import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { PageTransition } from "../components/PageTransition"
import { cn } from "../lib/utils"
// Import the new auth utility
import { auth } from "../lib/auth"

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState('recruiter')
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setErrors({})
    
    // Explicit check for empty fields as requested
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = 'Work email is required'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...newErrors, general: 'Please fill in all fields.' })
      return
    }

    try {
      // Use the auth utility for the login logic
      const result = auth.login(formData.email, formData.password, role)
      
      // Store session data
      localStorage.setItem('hg_access_token', 'mock_token_' + Date.now())
      localStorage.setItem('hg_user', JSON.stringify({
        ...result.user,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.name)}&background=DC2626&color=fff`
      }))

      // Redirect based on the path returned by the auth utility
      navigate(result.redirect)
    } catch (err) {
      setErrors({ general: err.message })
    }
  }

  return (
    <PageTransition className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <Link to="/" className="fixed top-8 left-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-sm">
          H
        </div>
        <span className="font-black tracking-tighter text-2xl text-gray-900 hidden sm:block">HireGround</span>
      </Link>

      <Card className="max-w-md w-full p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Welcome back</h2>
          <p className="text-gray-500 font-medium">Log in to your account.</p>
        </div>

        {/* Role Toggle: Renamed Admin to Candidate */}
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

        <form className="space-y-4" onSubmit={handleLogin} noValidate>
          {errors.general && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm font-bold border border-red-200">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Work Email</label>
            <input
              type="email"
              name="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 font-medium focus:outline-none transition-all placeholder:text-gray-400",
                errors.email ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              )}
              placeholder="e.g. name@company.com"
            />
            {errors.email && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex justify-between">
              Password
              <a href="#" className="text-primary text-xs hover:underline">Forgot?</a>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 font-medium focus:outline-none transition-all placeholder:text-gray-400",
                errors.password ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              )}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full mt-2" size="lg">Log In</Button>
        </form>

        {/* Demo Button and Hint text removed completely */}
      </Card>

      <p className="mt-8 text-sm text-gray-500 font-medium">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary hover:underline font-bold">Sign up</Link>
      </p>
    </PageTransition>
  )
}