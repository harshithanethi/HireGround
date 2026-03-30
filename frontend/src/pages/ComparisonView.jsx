import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CANDIDATES } from '../data/mockData'

const D_COLOR = {
  'Shortlisted': { text: 'text-emerald-400', bg: 'bg-emerald-400/8', border: 'border-emerald-400/20' },
  'In Review':   { text: 'text-yellow-400',  bg: 'bg-yellow-400/8',  border: 'border-yellow-400/20'  },
  'Rejected':    { text: 'text-red-400',      bg: 'bg-red-400/8',     border: 'border-red-400/20'     },
}

function ScorePill({ score, color }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${color}`}>
      {score}
    </div>
  )
}

export default function ComparisonView() {
  const [hovered, setHovered] = useState(null)
  const rescued = CANDIDATES.filter(c => c.decision.uniform === 'Rejected' && c.decision.context === 'Shortlisted')
  const penalised = CANDIDATES.filter(c => c.opportunityCredit < 0)

  const sortedByContext = [...CANDIDATES].sort((a,b) => a.rank.context - b.rank.context)

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-[#f59e0b]/60 uppercase tracking-widest mb-2">Explainability Layer</p>
          <h1 className="text-3xl font-black text-white tracking-tight">Uniform vs. FairBridge</h1>
          <p className="text-white/30 text-sm mt-1">Same candidates. Same resumes. Different model. Different outcomes.</p>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[220px_1fr_1fr] gap-4 mb-3">
          <div />
          <div className="bg-[#0a0b18] border border-white/8 rounded-xl px-5 py-3">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-xs font-bold text-white/50">Uniform Model</span>
            </div>
            <p className="text-[10px] text-white/20">One rule set for all — ignores context</p>
          </div>
          <div className="bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-xl px-5 py-3">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              <span className="text-xs font-bold text-[#f59e0b]">FairBridge Model</span>
              <span className="ml-auto text-[9px] font-bold text-[#f59e0b]/50 uppercase tracking-wider">HireGround</span>
            </div>
            <p className="text-[10px] text-white/20">Opportunity Credit applied — fair evaluation</p>
          </div>
        </div>

        {/* Comparison rows */}
        <div className="space-y-2">
          {sortedByContext.map(c => {
            const isHov = hovered === c.id
            const wasRescued = c.decision.uniform === 'Rejected' && c.decision.context === 'Shortlisted'
            const wasPenalised = c.opportunityCredit < 0
            const uCol = D_COLOR[c.decision.uniform]
            const cCol = D_COLOR[c.decision.context]

            return (
              <div key={c.id}
                onMouseEnter={()=>setHovered(c.id)}
                onMouseLeave={()=>setHovered(null)}
                className={`grid grid-cols-[220px_1fr_1fr] gap-4 transition-all duration-200 ${isHov ? 'scale-[1.002]' : ''}`}>

                {/* Candidate chip */}
                <div className={`bg-[#0a0b18] border rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all
                  ${isHov ? 'border-white/12' : 'border-white/5'}`}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f59e0b]/15 to-[#f59e0b]/5 border border-[#f59e0b]/15 flex items-center justify-center text-[#f59e0b] text-xs font-black flex-shrink-0">
                    {c.name.split(' ').map(w=>w[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-bold truncate">{c.name}</p>
                    <p className="text-white/25 text-[10px] truncate">{c.location}</p>
                  </div>
                  <div className={`ml-auto text-xs font-black flex-shrink-0 px-2 py-1 rounded-lg
                    ${c.opportunityCredit > 0 ? 'text-emerald-400 bg-emerald-400/8' :
                      c.opportunityCredit < 0 ? 'text-red-400/60 bg-red-400/5' :
                      'text-white/20'}`}>
                    {c.opportunityCredit > 0 ? '+' : ''}{c.opportunityCredit}
                  </div>
                </div>

                {/* Uniform model card */}
                <div className={`bg-[#0a0b18] border rounded-xl px-5 py-4 transition-all
                  ${isHov ? 'border-white/10' : 'border-white/5'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${uCol.bg} ${uCol.text} ${uCol.border}`}>
                          #{c.rank.uniform} · {c.decision.uniform}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-white/20 rounded-full transition-all duration-700" style={{width:`${c.uniformScore}%`}} />
                        </div>
                        <span className="text-lg font-black text-white/40">{c.uniformScore}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/25 mt-2 leading-relaxed">
                    {c.college} · {c.skills.slice(0,2).join(', ')}
                  </p>
                </div>

                {/* FairBridge card */}
                <div className={`border rounded-xl px-5 py-4 transition-all
                  ${wasRescued ? 'bg-emerald-400/3 border-emerald-400/20' :
                    wasPenalised ? 'bg-[#0a0b18] border-white/5' :
                    'bg-[#f59e0b]/3 border-[#f59e0b]/10'}
                  ${isHov && wasRescued ? 'border-emerald-400/35' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <div className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${cCol.bg} ${cCol.text} ${cCol.border}`}>
                          #{c.rank.context} · {c.decision.context}
                        </div>
                        {wasRescued && (
                          <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            ✦ RESCUED
                          </span>
                        )}
                        {wasPenalised && (
                          <span className="text-[9px] text-white/25 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
                            adjusted ↓
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-[#f59e0b]/8 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${wasRescued ? 'bg-emerald-400' : 'bg-[#f59e0b]'}`} style={{width:`${c.contextScore}%`}} />
                        </div>
                        <span className={`text-lg font-black ${wasRescued ? 'text-emerald-400' : 'text-[#f59e0b]'}`}>{c.contextScore}</span>
                      </div>
                    </div>
                  </div>
                  {/* Context tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.contextFactors.slice(0,2).map(f => (
                      <span key={f.label} className="text-[9px] text-[#f59e0b]/50 bg-[#f59e0b]/5 px-1.5 py-0.5 rounded">{f.icon} {f.label}</span>
                    ))}
                    {c.contextFactors.length > 2 && (
                      <span className="text-[9px] text-white/20">+{c.contextFactors.length-2} factors</span>
                    )}
                  </div>
                  <Link to={`/passport/${c.id}`} className="inline-block mt-2.5 text-[9px] font-bold text-[#f59e0b]/50 hover:text-[#f59e0b] transition-colors uppercase tracking-wider">
                    View Passport →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary panels */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {/* Rescued */}
          <div className="bg-emerald-400/3 border border-emerald-400/15 rounded-2xl p-5">
            <p className="text-emerald-400 text-xs font-bold mb-3 flex items-center gap-2">✦ Rescued by FairBridge</p>
            <div className="space-y-2">
              {rescued.map(c => (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">{c.name}</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-red-400/60 line-through">{c.uniformScore}</span>
                    <span className="text-white/20">→</span>
                    <span className="text-emerald-400 font-bold">{c.contextScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-[#0a0b18] border border-white/5 rounded-2xl p-5">
            <p className="text-white/40 text-xs font-bold mb-3">Impact Metrics</p>
            {[
              { l: 'Rural shortlist share', u: '12%', f: '28%', up: true },
              { l: 'CEOS score',            u: '0.62', f: '0.87', up: true },
              { l: 'Top talent preserved',  u: '95%',  f: '94%', up: false },
              { l: 'First-gen shortlisted', u: '14%',  f: '31%', up: true },
            ].map(m => (
              <div key={m.l} className="flex items-center justify-between py-1.5 border-b border-white/3 last:border-0">
                <span className="text-white/30 text-[10px]">{m.l}</span>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-white/25">{m.u}</span>
                  <span className="text-white/15">→</span>
                  <span className={m.up ? 'text-[#f59e0b]' : 'text-white/40'}>{m.f}</span>
                  {m.up && <span className="text-emerald-400">↑</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Why */}
          <div className="bg-[#0a0b18] border border-white/5 rounded-2xl p-5">
            <p className="text-white/40 text-xs font-bold mb-3">Why Scores Differ</p>
            <ul className="space-y-2.5">
              {[
                'Rural district → district job-gap multiplier applied',
                'First-gen → trajectory > pedigree rewarded',
                'No internet → self-learning heavily weighted',
                'Coaching access → subtracted from raw advantage',
                'Disability → infrastructure barrier factored in',
              ].map(t => (
                <li key={t} className="flex gap-2 text-[10px] text-white/30 leading-relaxed">
                  <span className="text-[#f59e0b]/50 flex-shrink-0 mt-0.5">▸</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}