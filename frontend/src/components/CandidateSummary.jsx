import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { User, MapPin, GraduationCap, Building, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CandidateSummary() {
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hg_latest_candidate')
      if (stored) {
        setCandidate(JSON.parse(stored))
      } else {
        // Fallback to mock
        setCandidate({
          name: "Aarav Nair",
          id: "HG-C-MOCK",
          collegeTier: "Tier3",
          district: "Wayanad, Kerala",
          isRural: true,
          isFirstGen: true,
          resume: { experienceMonths: 36, skills: ["React", "JavaScript"] },
          derived: { equitableDecision: "Shortlisted" },
          scoring: { finalScore: 88, baselineScore: 76 }
        })
      }
    } catch(e) {
      console.error(e)
    }
  }, [])

  if (!candidate) return <div className="p-12 text-center text-gray-500 font-bold">Loading candidate...</div>

  const expYears = Math.floor((candidate.resume?.experienceMonths || 0) / 12)
  const isFrontend = candidate.resume?.skills?.some(s => s.toLowerCase().includes('react') || s.toLowerCase().includes('frontend'))
  const roleName = isFrontend ? "Frontend Engineer" : "Software Engineer"
  
  // Calculate a mock composite score since the real one requires the admin context model run
  const score = candidate.scoring?.finalScore || 
    (70 + (candidate.isRural ? 10 : 0) + (candidate.isFirstGen ? 5 : 0) + (candidate.collegeTier === 'Tier3' ? 8 : 0));

  return (
    <div className="h-full flex flex-col pt-8 px-6 md:px-12 w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Candidate Profile</h2>
        <p className="text-gray-500 font-medium">{candidate.name} • {roleName} Candidate</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2 p-8 shadow-sm border border-gray-100 flex items-start gap-6 bg-gradient-to-br from-white to-gray-50">
          <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-4xl font-black text-gray-400 shrink-0">
            {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{candidate.name}</h3>
            <p className="text-primary font-bold mb-4">Applying for: {roleName}</p>

            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                <MapPin size={16} className="text-gray-400 shrink-0" /> <span className="truncate">{candidate.district || "Unspecified"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Building size={16} className="text-gray-400 shrink-0" /> {expYears} Years Exp
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <GraduationCap size={16} className="text-gray-400 shrink-0" /> {candidate.collegeTier === 'Tier1' ? 'Tier 1 / Metro' : (candidate.collegeTier === 'Tier2' ? 'Tier 2 / State' : 'Tier 3 / Local')}
              </div>
              {candidate.isFirstGen && (
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <User size={16} className="text-gray-400 shrink-0" /> First-Gen Graduate
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-8 shadow-sm border border-gray-100 flex flex-col justify-center bg-primary text-white">
          <div className="text-primary-100 font-bold mb-1 uppercase tracking-wider text-sm">CEOS Composite Score</div>
          <div className="text-6xl font-black mb-2 tracking-tighter">{Math.floor(score)}<span className="text-2xl text-primary-200">/100</span></div>
          <div className="text-sm font-medium bg-white/20 inline-block px-3 py-1 rounded-full text-white w-max">
            Top 12% among adjusted baselines
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex-1">
        <h4 className="font-bold text-gray-900 mb-4">Contextual Insights</h4>
        <p className="text-gray-600 leading-relaxed mb-6">
          {candidate.name.split(' ')[0]} demonstrates exceptional foundational skills despite {candidate.isRural ? 'coming from a low-opportunity region' : 'standard institutional backing'}. The baseline comparison with general candidates reveals a strong potential for growth and {candidate.isFirstGen ? 'high grit as a first-generation learner' : 'steady competency'}.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">High Grit Indicator</span>
          {candidate.isFirstGen && <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">First-Gen Achiever</span>}
          {candidate.isRural && <span className="px-3 py-1 bg-positive/10 text-positive rounded-full text-xs font-bold">+{(Math.floor(score) - 60) > 0 ? Math.floor(score)-60 : 12}% Opportunity Credit</span>}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
          <p className="text-sm text-gray-400 font-medium">Ready to review this candidate's evaluation breakdown?</p>
          <button
            onClick={() => navigate('/evaluation')}
            className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-700 active:scale-95 transition-all text-sm"
          >
            Proceed to Evaluation <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}