import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { PageTransition } from "../components/PageTransition"
import { API_BASE } from "../config/api"
import { cn } from "../lib/utils"

export default function Signup() {
  const [role, setRole] = useState('recruiter');
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);
  const [authError, setAuthError] = useState(null);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const existingScript = document.getElementById("google-identity-script");

    const setup = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            setAuthError(null);
            const res = await fetch(`${API_BASE}/v1/auth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_token: response.credential }),
            });
            if (!res.ok) {
              const errData = await res.json().catch(() => ({ detail: "Auth failed" }));
              throw new Error(errData.detail || "Authentication failed");
            }
            const data = await res.json();
            localStorage.setItem("hg_access_token", data.access_token);
            localStorage.setItem("hg_user", JSON.stringify(data.user));
            navigate("/upload");
          } catch (e) {
            setAuthError(e?.message ?? String(e));
          }
        },
      });

      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        width: "100%",
        text: "signup_with"
      });
    };

    if (existingScript) {
      setup();
      return;
    }

    const script = document.createElement("script");
    script.id = "google-identity-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = setup;
    document.body.appendChild(script);
  }, [GOOGLE_CLIENT_ID, navigate]);

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

          <Button type="button" onClick={async (e) => {
            e.preventDefault();
            try {
              const res = await fetch(`${API_BASE}/v1/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_token: "mock_demo_token" }),
              });
              const data = await res.json();
              localStorage.setItem("hg_access_token", data.access_token);
              localStorage.setItem("hg_user", JSON.stringify(data.user));
              navigate("/upload");
            } catch (e) {
              setAuthError("Sign up failed");
            }
          }} className="w-full mt-2" size="lg">Sign Up</Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">or continue with</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {!GOOGLE_CLIENT_ID ? (
          <Button 
            type="button" 
            variant="outline" 
            className="w-full mt-6 flex items-center justify-center gap-2 h-12 text-sm font-bold shadow-sm" 
            onClick={async () => {
              try {
                const res = await fetch(`${API_BASE}/v1/auth/google`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id_token: "mock_demo_token" }),
                });
                const data = await res.json();
                localStorage.setItem("hg_access_token", data.access_token);
                localStorage.setItem("hg_user", JSON.stringify(data.user));
                navigate("/upload");
              } catch (e) {
                setAuthError("Demo signup failed");
              }
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google (Demo)
          </Button>
        ) : (
          <div className="mt-6" ref={googleBtnRef} />
        )}

        {authError ? (
          <div className="mt-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700 font-medium">
            {authError}
          </div>
        ) : null}
      </Card>
      
      <p className="mt-8 text-sm text-gray-500 font-medium">
        Already have an account? <Link to="/login" className="text-secondary hover:underline font-bold">Log in</Link>
      </p>
    </PageTransition>
  )
}