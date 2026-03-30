import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CANDIDATES } from '../data/mockData'

const STATUS = {
  shortlisted: { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-400/8', border: 'border-emerald-400/15', label: 'Shortlisted' },
  review: { dot: 'bg-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-400/8', border: 'border-yellow-400/15', label: 'In Review' },
  new: { dot: 'bg-blue-400', text: 'text-blue-400', bg: 'bg-blue-400/8', border: 'border-blue-400/15', label: 'New' },
}

function CeosRing({ score }) {
  const pct = Math.round(score * 100)
  const r = 18, circ = 2 * Math.PI * r
  const filled = circ * (score)
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <circle cx="28" cy="28" r={r} fill="none"
          stroke={score >= 0.8 ? '#34d399' : score >= 0.65 ? '#f59e0b' : '#f87171'}
          strokeWidth="3" strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`} />
      </svg>
      <span className="text-xs font-black text-white">{pct}</span>
    </div>
  )
}

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState(CANDIDATES)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('contextScore')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = candidates
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) ||
                 c.location.toLowerCase().includes(search.toLowerCase()) ||
                 c.skills.some(s => s.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => b[sort] - a[sort])

  const stats = [
    { label: 'Total', value: candidates.length, color: 'text-white' },
    { label: 'Shortlisted', value: candidates.filter(c=>c.status==='shortlisted').length, color: 'text-emerald-400' },
    { label: 'Avg CEOS', value: (candidates.reduce((s,c)=>s+c.ceosScore,0)/candidates.length*100).toFixed(0)+'%', color: 'text-[#f59e0b]' },
    { label: 'Rural shortlist', value: candidates.filter(c=>c.districtIndex<50&&c.status==='shortlisted').length, color: 'text-blue-400' },
    { label: 'First-gen', value: candidates.filter(c=>c.firstGen).length, color: 'text-purple-400' },
  ]

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold text-[#f59e0b]/60 uppercase tracking-widest mb-2">Recruiter View</p>
            <h1 className="text-3xl font-black text-white tracking-tight">Candidate Pipeline</h1>
            <p className="text-white/30 text-sm mt-1">Ranked by Opportunity Credit Score — fairness built in</p>
          </div>
          <Link to="/compare" className="px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#04050f] text-xs font-bold transition-all shadow-lg shadow-[#f59e0b]/10 flex items-center gap-2">
            ⇄ Compare View
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-[#0a0b18] border border-white/5 rounded-2xl p-4">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1.5">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search name, location, skill..."
            className="flex-1 min-w-48 bg-[#0a0b18] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#f59e0b]/40 transition-all" />

          <div className="flex gap-1 bg-[#0a0b18] border border-white/5 rounded-xl p-1">
            {['all','shortlisted','review'].map(f => (
              <button key={f} onClick={()=>setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all
                  ${filter===f ? 'bg-[#f59e0b] text-[#04050f]' : 'text-white/25 hover:text-white/60'}`}>
                {f}
              </button>
            ))}
          </div>

          <select value={sort} onChange={e=>setSort(e.target.value)}
            className="bg-[#0a0b18] border border-white/8 rounded-xl px-3 py-2.5 text-xs text-white/60 focus:outline-none focus:border-[#f59e0b]/40 transition-all">
            <option value="contextScore">Sort: Context Score</option>
            <option value="uniformScore">Sort: Uniform Score</option>
            <option value="opportunityCredit">Sort: Opportunity Credit</option>
            <option value="ceosScore">Sort: CEOS</option>
          </select>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_80px_80px_80px_56px_40px] gap-3 px-4 mb-2">
          {['Candidate', 'Skills', 'Uniform', 'Context', 'Credit', 'CEOS', ''].map(h => (
            <p key={h} className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{h}</p>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {filtered.map((c, idx) => {
            const st = STATUS[c.status]
            const isEx = expanded === c.id
            return (
              <div key={c.id} className="bg-[#0a0b18] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-200">
                <div className="grid grid-cols-[2fr_1fr_80px_80px_80px_56px_40px] gap-3 items-center px-4 py-4">

                  {/* Name + meta */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/5 border border-[#f59e0b]/15 flex items-center justify-center text-[#f59e0b] text-xs font-black flex-shrink-0">
                      {c.name.split(' ').map(w=>w[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-bold">{c.name}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${st.bg} ${st.text} ${st.border} flex items-center gap-1`}>
                          <span className={`w-1 h-1 rounded-full ${st.dot}`}/>
                          {st.label}
                        </span>
                        {c.firstGen && <span className="text-[9px] text-purple-400/80 bg-purple-400/8 border border-purple-400/15 px-2 py-0.5 rounded-full">1st-gen</span>}
                      </div>
                      <p className="text-white/25 text-xs truncate">{c.location} · {c.experience}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {c.skills.slice(0,3).map(s => (
                      <span key={s} className="text-[9px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                    {c.skills.length > 3 && <span className="text-[9px] text-white/20">+{c.skills.length-3}</span>}
                  </div>

                  {/* Uniform score */}
                  <div>
                    <div className="text-sm font-black text-white/50">{c.uniformScore}</div>
                    <div className="mt-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-white/20 rounded-full" style={{width:`${c.uniformScore}%`}} />
                    </div>
                  </div>

                  {/* Context score */}
                  <div>
                    <div className="text-sm font-black text-[#f59e0b]">{c.contextScore}</div>
                    <div className="mt-1 h-1 bg-[#f59e0b]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f59e0b] rounded-full" style={{width:`${c.contextScore}%`}} />
                    </div>
                  </div>

                  {/* Credit */}
                  <div className={`text-sm font-black ${c.opportunityCredit > 0 ? 'text-emerald-400' : 'text-white/30'}`}>
                    {c.opportunityCredit > 0 ? `+${c.opportunityCredit}` : c.opportunityCredit}
                  </div>

                  {/* CEOS ring */}
                  <CeosRing score={c.ceosScore} />

                  {/* Expand */}
                  <button onClick={()=>setExpanded(isEx?null:c.id)}
                    className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/8 flex items-center justify-center text-white/20 hover:text-white/60 transition-all">
                    <span className={`text-xs transition-transform duration-200 ${isEx?'rotate-180':''}`}>▾</span>
                  </button>
                </div>

                {/* Expanded detail */}
                {isEx && (
                  <div className="border-t border-white/5 px-4 py-4 grid grid-cols-[1fr_auto] gap-6">
                    <div>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3">Context Factors</p>
                      <div className="space-y-2">
                        {c.contextFactors.map(f => (
                          <div key={f.label} className="flex items-center gap-2">
                            <span className="text-base">{f.icon}</span>
                            <span className="text-xs text-white/50 flex-1">{f.label}</span>
                            <span className={`text-xs font-bold ${f.weight.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{f.weight} pts</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-white/25 italic mt-3 leading-relaxed border-t border-white/5 pt-3">"{c.passportNote}"</p>
                    </div>
                    <div className="text-right space-y-3 flex-shrink-0">
                      <div>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest">Context Rank</p>
                        <p className="text-2xl font-black text-[#f59e0b]">#{c.rank.context}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest">Uniform Rank</p>
                        <p className="text-lg font-black text-white/30">#{c.rank.uniform}</p>
                      </div>
                      <Link to={`/passport/${c.id}`}
                        className="block mt-3 px-3 py-2 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-xs font-bold text-center hover:bg-[#f59e0b]/15 transition-all">
                        View Passport →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/20">
            <span className="text-3xl block mb-3">🔍</span>
            No candidates match
          </div>
        )}
      </div>
    </div>
  )
}