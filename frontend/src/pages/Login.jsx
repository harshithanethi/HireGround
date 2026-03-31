import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { PageTransition } from "../components/PageTransition"
import { API_BASE } from "../config/api"

export default function Login() {
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
            if (!res.ok) throw new Error(await res.text());
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
      
      <Card className="max-w-md w-full p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Welcome back</h2>
          <p className="text-gray-500 font-medium">Log in to your recruiter account.</p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Work Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400"
              placeholder="name@company.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex justify-between">
              Password
              <a href="#" className="text-primary text-xs hover:underline">Forgot?</a>
            </label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400"
              placeholder="••••••••"
            />
          </div>

          <Button className="w-full mt-2" size="lg">Log In</Button>
        </form>

        <div className="mt-6">
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">or continue with</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {!GOOGLE_CLIENT_ID ? (
            <p className="mt-4 text-xs text-red-500 font-medium">
              Set `VITE_GOOGLE_CLIENT_ID` in the frontend env to enable Google SSO.
            </p>
          ) : (
            <div className="mt-4" ref={googleBtnRef} />
          )}

          {authError ? (
            <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {authError}
            </pre>
          ) : null}
        </div>

        {/* Old static Google button removed; we now render the official Google Identity button. */}
      </Card>
      
      <p className="mt-8 text-sm text-gray-500 font-medium">
        Don't have an account? <Link to="/signup" className="text-secondary hover:underline font-bold">Sign up</Link>
      </p>
    </PageTransition>
  )
}