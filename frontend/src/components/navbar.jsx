import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center border-b border-gray-700">
      
      {/* Logo */}
      <h1 className="text-xl font-bold text-teal-400">
        HireGround
      </h1>

      {/* Links */}
      <div className="flex items-center gap-6 text-sm">
        <Link to="/" className="hover:text-teal-400">Upload</Link>
        <Link to="/dashboard" className="hover:text-teal-400">Dashboard</Link>
        <Link to="/compare" className="hover:text-teal-400">Compare</Link>
        <Link to="/analytics" className="hover:text-teal-400">Analytics</Link>

        {/* Auth Section */}
        <div className="flex items-center gap-3 ml-6">
          <Link 
            to="/login" 
            className="text-white/60 hover:text-white"
          >
            Login
          </Link>

          <Link 
            to="/signup" 
            className="bg-[#f59e0b] px-4 py-1.5 rounded-lg text-black font-semibold hover:bg-[#d97706] transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}