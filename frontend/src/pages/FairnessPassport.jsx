import { useParams, Link } from 'react-router-dom'
import { CANDIDATES, DISTRICT_INDEX } from '../data/mockData'

export default function FairnessPassport() {
  const { id } = useParams()
  const c = CANDIDATES.find(x => x.id === id)

  if (!c) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-white/40">Candidate not found</p>
        <Link to="/dashboard" className="mt-4 inline-block text-[#f59e0b] text-sm">← Back to Dashboard</Link>
      </div>
    </div>
  )

  const scoreImprovement = c.contextScore - c.uniformScore
  const districtTier = c.districtIndex < 30 ? 'Low' : c.districtIndex < 60 ? 'Mid' : 'High'
  const districtColor = c.districtIndex < 30 ? 'text-red-400' : c.districtIndex < 60 ? 'text-yellow-400' : 'text-emerald-400'

  return (
    <div className="min-h-screen px-6 py-10">
      {/* Background accent */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#f59e0b]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">
        {/* Back */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/30 hover:text-white text-xs mb-8 transition-colors">
          ← Back to Dashboard
        </Link>

        {/* Passport header */}
        <div className="bg-[#0a0b18] border border-[#f59e0b]/20 rounded-3xl overflow-hidden mb-5">
          {/* Top bar */}
          <div className="bg-[#f59e0b]/8 border-b border-[#f59e0b]/15 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-[#f59e0b] text-lg">🪪</div>
              <div>
                <p className="text-[9px] font-black text-[#f59e0b]/60 uppercase tracking-widest">HireGround</p>
                <p className="text-white text-xs font-bold">Fairness Passport</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-white/20 uppercase tracking-widest">Issued</p>
              <p className="text-white/50 text-xs">{new Date().toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</p>
            </div>
          </div>

          {/* Main body */}
          <div className="px-8 py-7 grid grid-cols-[1fr_180px] gap-8">
            {/* Left */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/5 border border-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b] text-xl font-black">
                  {c.name.split(' ').map(w=>w[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{c.name}</h2>
                  <p className="text-white/40 text-sm">{c.location} · {c.college}</p>
                  <p className="text-white/25 text-xs mt-0.5">{c.experience}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-5">
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map(s => (
                    <span key={s} className="text-xs text-white/50 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>

              {/* Assessment note */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2">Assessment Note</p>
                <p className="text-white/50 text-xs leading-relaxed italic">"{c.passportNote}"</p>
              </div>
            </div>

            {/* Right — score column */}
            <div className="space-y-4">
              {/* Scores */}
              <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 text-center">
                <p className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Uniform Score</p>
                <p className="text-3xl font-black text-white/30">{c.uniformScore}</p>
              </div>
              <div className="bg-[#f59e0b]/8 rounded-2xl p-4 border border-[#f59e0b]/20 text-center">
                <p className="text-[9px] text-[#f59e0b]/60 uppercase tracking-widest mb-1">Context Score</p>
                <p className="text-3xl font-black text-[#f59e0b]">{c.contextScore}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {scoreImprovement > 0 ? `+${scoreImprovement}` : scoreImprovement} pts
                  </span>
                </div>
              </div>
              {/* CEOS */}
              <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 text-center">
                <p className="text-[9px] text-white/20 uppercase tracking-widest mb-1">CEOS Score</p>
                <p className="text-2xl font-black text-white/60">{Math.round(c.ceosScore*100)}%</p>
                <p className="text-[9px] text-white/20 mt-0.5">Fairness index</p>
              </div>
              {/* Decision */}
              <div className={`rounded-2xl p-4 border text-center
                ${c.decision.context === 'Shortlisted' ? 'bg-emerald-400/8 border-emerald-400/25' : 'bg-yellow-400/8 border-yellow-400/25'}`}>
                <p className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Decision</p>
                <p className={`font-black text-sm ${c.decision.context === 'Shortlisted' ? 'text-emerald-400' : 'text-yellow-400'}`}>{c.decision.context}</p>
                <p className="text-[9px] text-white/20 mt-0.5">Rank #{c.rank.context}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity Credit Breakdown */}
        <div className="bg-[#0a0b18] border border-white/5 rounded-3xl p-7 mb-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Opportunity Credit Breakdown</p>
              <p className="text-white font-bold">How +{c.opportunityCredit} points were calculated</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-[#f59e0b]">+{c.opportunityCredit}</p>
              <p className="text-[9px] text-white/20">total credit</p>
            </div>
          </div>

          <div className="space-y-3">
            {c.contextFactors.map((f, i) => {
              const val = parseInt(f.weight)
              const maxVal = 10
              return (
                <div key={f.label} className="flex items-center gap-4">
                  <div className="w-8 text-center text-lg">{f.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/60">{f.label}</span>
                      <span className={`text-sm font-black ${val > 0 ? 'text-[#f59e0b]' : 'text-red-400'}`}>{f.weight} pts</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f59e0b] rounded-full transition-all duration-700"
                        style={{width:`${Math.abs(val)/maxVal*100}%`, animationDelay:`${i*100}ms`}} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Context Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: '🗺️', label: 'District', value: c.location.split(',')[0], sub: `Opportunity Index: ${c.districtIndex}/100`, subColor: districtColor },
            { icon: '📡', label: 'Internet Access', value: c.internetAccess === 'none' ? 'None' : c.internetAccess === 'limited' ? 'Limited' : 'Reliable',
              sub: c.internetAccess === 'none' ? 'Significant barrier' : c.internetAccess === 'limited' ? 'Some barrier' : 'No barrier',
              subColor: c.internetAccess === 'none' ? 'text-red-400' : c.internetAccess === 'limited' ? 'text-yellow-400' : 'text-emerald-400' },
            { icon: '📚', label: 'Resource Access', value: c.resourceAccess.charAt(0).toUpperCase() + c.resourceAccess.slice(1),
              sub: c.resourceAccess === 'low' ? 'Self-taught' : c.resourceAccess === 'medium' ? 'Some coaching' : 'Full coaching',
              subColor: c.resourceAccess === 'low' ? 'text-red-400' : c.resourceAccess === 'medium' ? 'text-yellow-400' : 'text-emerald-400' },
            { icon: '🎓', label: 'First-Generation', value: c.firstGen ? 'Yes' : 'No', sub: c.firstGen ? '+5 pts credit' : 'No adjustment', subColor: c.firstGen ? 'text-[#f59e0b]' : 'text-white/20' },
            { icon: '🏫', label: 'College Tier', value: c.collegeType.toUpperCase(), sub: `+${c.collegeType === 'tier1' ? 0 : c.collegeType === 'tier2' ? 3 : c.collegeType === 'govt' ? 7 : 6} pts`, subColor: 'text-[#f59e0b]' },
            { icon: '♿', label: 'Disability', value: c.disability ? 'Yes' : 'No', sub: c.disability ? '+5 pts credit' : 'No adjustment', subColor: c.disability ? 'text-[#f59e0b]' : 'text-white/20' },
          ].map(item => (
            <div key={item.label} className="bg-[#0a0b18] border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{item.icon}</span>
                <span className="text-[9px] text-white/20 uppercase tracking-widest">{item.label}</span>
              </div>
              <p className="text-white font-bold text-sm">{item.value}</p>
              <p className={`text-[10px] mt-0.5 ${item.subColor}`}>{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Action row */}
        <div className="flex gap-3">
          <Link to="/dashboard" className="flex-1 py-3 rounded-xl border border-white/8 text-white/40 hover:text-white text-sm text-center transition-all">
            ← Dashboard
          </Link>
          <Link to="/compare" className="flex-1 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#04050f] font-bold text-sm text-center transition-all shadow-lg shadow-[#f59e0b]/10">
            See Model Comparison →
          </Link>
        </div>
      </div>
    </div>
  )
}