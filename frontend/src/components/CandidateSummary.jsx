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
          scoring: { finalScore: 88, baselineScore: 76 },
          context_adjustment: 12,
          parsed_data: { skills: ["React", "JavaScript", "TypeScript"] }
        })
      }
    } catch(e) {
      console.error(e)
    }
  }, [])

  if (!candidate) return <div className="p-12 text-center text-gray-500 font-bold">Loading candidate...</div>

  const expYears = Math.floor((candidate.resume?.experienceMonths || 0) / 12)
  const skills = candidate.resume?.skills || candidate.parsed_data?.skills || []
  const isFrontend = skills.some(s => s.toLowerCase().includes('react') || s.toLowerCase().includes('frontend'))
  const roleName = isFrontend ? "Frontend Engineer" : "Software Engineer"
  const name = candidate.name || "Candidate"
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2)
  const district = candidate.district || candidate.parsed_data?.district || "Unspecified"
  const collegeTier = candidate.collegeTier || "Tier3"
  const isFirstGen = candidate.isFirstGen ?? (candidate.parsed_data?.first_gen_flag ?? false)
  const isRural = candidate.isRural ?? false
  const score = candidate.scoring?.finalScore || candidate.final_score ||
    (70 + (isRural ? 10 : 0) + (isFirstGen ? 5 : 0) + (collegeTier === 'Tier3' ? 8 : 0))
  const contextAdj = candidate.context_adjustment || (Math.floor(score) - 70)

  return (
    <div className="h-full flex flex-col pt-8 px-6 md:px-12 w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Candidate Profile</h2>
        <p className="text-gray-500 font-medium">{name} • {roleName} Candidate</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2 p-8 shadow-sm border border-gray-100 flex items-start gap-6 bg-gradient-to-br from-white to-gray-50">
          <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-4xl font-black text-gray-400 shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{name}</h3>
            <p className="text-primary font-bold mb-4">Applying for: {roleName}</p>

            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                <MapPin size={16} className="text-gray-400 shrink-0" /> <span className="truncate">{district}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Building size={16} className="text-gray-400 shrink-0" /> {expYears > 0 ? `${expYears} Years Exp` : "Experience extracted"}
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <GraduationCap size={16} className="text-gray-400 shrink-0" /> {collegeTier === 'Tier1' ? 'Tier 1 / Metro' : (collegeTier === 'Tier2' ? 'Tier 2 / State' : 'Tier 3 / Local')}
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <User size={16} className="text-gray-400 shrink-0" /> {isFirstGen ? 'First-Gen Graduate' : 'Standard Baseline'}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 shadow-sm border border-gray-100 flex flex-col justify-center bg-primary text-white">
          <div className="text-primary-100 font-bold mb-1 uppercase tracking-wider text-sm">CEOS Composite Score</div>
          <div className="text-6xl font-black mb-2 tracking-tighter">{Math.floor(score)}<span className="text-2xl text-primary-200">/100</span></div>
          <div className="text-sm font-medium bg-white/20 inline-block px-3 py-1 rounded-full text-white w-max">
            +{contextAdj} Opportunity Credits
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex-1">
        <h4 className="font-bold text-gray-900 mb-4">Contextual Insights</h4>
        <p className="text-gray-600 leading-relaxed mb-6">
          {name.split(' ')[0]} demonstrates exceptional foundational skills despite {isRural ? 'coming from a low-opportunity region' : 'standard institutional backing'}. The baseline comparison with general candidates reveals a strong potential for growth and {isFirstGen ? 'high grit as a first-generation learner' : 'steady competency'}.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">High Grit Indicator</span>
          {isFirstGen && <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">First-Gen Achiever</span>}
          {isRural && <span className="px-3 py-1 bg-positive/10 text-positive rounded-full text-xs font-bold">+{contextAdj} Opportunity Credits</span>}
          {skills.length > 0 && <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">Skills: {skills.slice(0,3).join(", ")}</span>}
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