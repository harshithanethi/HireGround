import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { PageTransition } from "../components/PageTransition"
import { cn } from "../lib/utils"

export default function Signup() {
  const [role, setRole] = useState('recruiter')
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  }

  const handleSignup = (e) => {
    e.preventDefault();
    
    // Form Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "This field is required";
    if (!formData.email.trim()) newErrors.email = "This field is required";
    if (!formData.password) newErrors.password = "This field is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Cross-role email uniqueness logic
    const users = JSON.parse(localStorage.getItem('hireground_users') || '[]');
    const existingUser = users.find(u => u.email === formData.email.trim());

    if (existingUser) {
      if (existingUser.role !== role) {
        const displayRole = existingUser.role === 'recruiter' ? 'Recruiter' : 'Candidate';
        setErrors({ general: `This email is already registered as a ${displayRole}. Please use a different email or log in with the correct role.` });
      } else {
        setErrors({ general: 'This email is already registered. Please log in.' });
      }
      return;
    }

    // Register user
    users.push({ ...formData, role });
    localStorage.setItem('hireground_users', JSON.stringify(users));

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
            className={cn("flex-1 py-2 font-bold text-sm rounded-lg transition-all", role === 'client' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700')}
            onClick={() => setRole('client')}
          >
            Client
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSignup} noValidate>
          {errors.general && (
            <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-700 text-sm font-bold border border-red-200">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 font-medium focus:outline-none transition-all placeholder:text-gray-400",
                errors.name ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              )}
              placeholder="Jaya Menon"
            />
            {errors.name && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
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
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
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

          <Button type="submit" className="w-full mt-2" size="lg">Sign Up</Button>
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