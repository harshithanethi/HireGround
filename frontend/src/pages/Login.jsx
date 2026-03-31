import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { PageTransition } from "../components/PageTransition"
import { cn } from "../lib/utils"

export default function Login() {
  const [role, setRole] = useState('recruiter')
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Form Validation 
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "This field is required";
    if (!formData.password) newErrors.password = "This field is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Cross-role email logic check against mock DB Let's check existing DB
    const users = JSON.parse(localStorage.getItem('hireground_users') || '[]');
    const existingUser = users.find(u => u.email === formData.email.trim());

    if (existingUser) {
      // If user exists, ensure they are logging in with the correct role
      if (existingUser.role !== role) {
        const displayRole = existingUser.role === 'recruiter' ? 'Recruiter' : 'Candidate';
        setErrors({ general: `This email is already registered as a ${displayRole}. Please log in with the correct role.` });
        return;
      }
    } else {
      // For smooth demo flow, if email is completely unseen, we'll implicitly allow them 
      // or optionally we could throw "Account not found". 
      // The prompt only explicitly asks for Cross-Role checking ("cannot be used to sign up or log in as Candidate and vice versa... show a clear error message")
      // So we will just proceed nicely if role hasn't collided, essentially auto-registering unrecognised emails for prototyping simplicity.
      users.push({ ...formData, role });
      localStorage.setItem('hireground_users', JSON.stringify(users));
    }

    if (role === 'recruiter') {
      navigate('/admin');
    } else {
      navigate('/app');
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
            className={cn("flex-1 py-2 font-bold text-sm rounded-lg transition-all", role === 'client' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700')}
            onClick={() => setRole('client')}
          >
            Client
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleLogin} noValidate>
          {errors.general && (
            <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-700 text-sm font-bold border border-red-200">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Work Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 font-medium focus:outline-none transition-all placeholder:text-gray-400",
                errors.email ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              )}
              placeholder="name@company.com"
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

          <Button type="submit" className="w-full mt-4" size="lg">Log In</Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">or continue with</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <Button variant="outline" className="w-full mt-6" size="lg">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google SSO
        </Button>
      </Card>
      
      <p className="mt-8 text-sm text-gray-500 font-medium">
        Don't have an account? <Link to="/signup" className="text-secondary hover:underline font-bold">Sign up</Link>
      </p>
    </PageTransition>
  )
}