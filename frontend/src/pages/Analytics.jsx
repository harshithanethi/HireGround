import { useEffect, useRef } from 'react'
import { CANDIDATES, CEOS_HISTORY, METRICS_COMPARISON } from '../data/mockData'

// Simple bar chart using SVG (no Chart.js import needed, works offline)
function BarChart({ data, labels, colors, height = 120 }) {
  const max = Math.max(...data.flat())
  const barW = 30
  const gap = 12
  const groupW = data.length * barW + (data.length - 1) * 4 + gap
  const totalW = labels.length * groupW
  const padL = 40, padB = 30

  return (
    <svg width="100%" viewBox={`0 0 ${totalW + padL + 20} ${height + padB + 10}`} style={{overflow:'visible'}}>
      {/* Y gridlines */}
      {[0,25,50,75,100].map(v => {
        const y = height - (v/max)*height + 10
        return (
          <g key={v}>
            <line x1={padL} x2={totalW+padL+20} y1={y} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            <text x={padL-5} y={y+4} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="9">{v}</text>
          </g>
        )
      })}
      {/* Bars */}
      {labels.map((label, gi) => (
        <g key={label}>
          {data.map((series, si) => {
            const x = padL + gi * groupW + si * (barW + 4) + gap/2
            const barH = (series[gi] / max) * height
            const y = height - barH + 10
            return (
              <g key={si}>
                <rect x={x} y={y} width={barW} height={barH} rx="4" fill={colors[si]} opacity="0.85" />
                <text x={x+barW/2} y={y-4} textAnchor="middle" fill={colors[si]} fontSize="9" fontWeight="bold">{series[gi]}</text>
              </g>
            )
          })}
          <text x={padL + gi * groupW + groupW/2 - gap/4} y={height+padB-5} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9">
            {label.length > 12 ? label.slice(0,12)+'…' : label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function LineChart({ data, labels, height = 100 }) {
  const max = Math.max(...data) * 1.1
  const padL = 35, padB = 25, padR = 10, padT = 10
  const w = 400, h = height
  const pts = data.map((v, i) => ({
    x: padL + i * (w - padL - padR) / (data.length - 1),
    y: padT + (1 - v/max) * (h - padT - padB),
    v
  }))
  const path = pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ')
  const area = `${path} L${pts[pts.length-1].x},${h-padB} L${pts[0].x},${h-padB} Z`

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h+padB}`} style={{overflow:'visible'}}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Grid */}
      {[0.5,0.6,0.7,0.8,0.9,1.0].map(v => {
        const y = padT + (1-v/max)*(h-padT-padB)
        return (
          <g key={v}>
            <line x1={padL} x2={w-padR} y1={y} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            <text x={padL-4} y={y+3} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="8">{v.toFixed(1)}</text>
          </g>
        )
      })}
      {/* Area */}
      <path d={area} fill="url(#lineGrad)" />
      {/* Line */}
      <path d={path} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Points */}
      {pts.map((p,i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#f59e0b" />
          <circle cx={p.x} cy={p.y} r="8" fill="#f59e0b" opacity="0.1" />
          <text x={p.x} y={p.y-10} textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold">{p.v}</text>
          <text x={p.x} y={h} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8">{labels[i]}</text>
        </g>
      ))}
    </svg>
  )
}

export default function Analytics() {
  const contextScores = CANDIDATES.map(c => c.contextScore)
  const uniformScores = CANDIDATES.map(c => c.uniformScore)
  const names = CANDIDATES.map(c => c.name.split(' ')[0])

  const avgCredit = (CANDIDATES.reduce((s,c)=>s+c.opportunityCredit,0)/CANDIDATES.length).toFixed(1)
  const rescuedCount = CANDIDATES.filter(c=>c.decision.uniform==='Rejected'&&c.decision.context==='Shortlisted').length
  const avgCeos = (CANDIDATES.reduce((s,c)=>s+c.ceosScore,0)/CANDIDATES.length*100).toFixed(0)
  const ruralShortlisted = CANDIDATES.filter(c=>c.districtIndex<50&&c.status==='shortlisted').length

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-[#f59e0b]/60 uppercase tracking-widest mb-2">Impact Analytics</p>
          <h1 className="text-3xl font-black text-white tracking-tight">Fairness Metrics</h1>
          <p className="text-white/30 text-sm mt-1">Real-time CEOS tracking and model impact analysis</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'CEOS Score', value: `${avgCeos}%`, delta: '↑ 40% vs uniform', color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/5', border: 'border-[#f59e0b]/15' },
            { label: 'Candidates Rescued', value: rescuedCount, delta: 'would have been rejected', color: 'text-emerald-400', bg: 'bg-emerald-400/5', border: 'border-emerald-400/15' },
            { label: 'Avg Opportunity Credit', value: `+${avgCredit}`, delta: 'points across cohort', color: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/15' },
            { label: 'Rural Shortlisted', value: ruralShortlisted, delta: 'low-opportunity districts', color: 'text-purple-400', bg: 'bg-purple-400/5', border: 'border-purple-400/15' },
          ].map(k => (
            <div key={k.label} className={`${k.bg} border ${k.border} rounded-2xl p-5`}>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-2">{k.label}</p>
              <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-[10px] text-white/25 mt-1">{k.delta}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* CEOS trend */}
          <div className="bg-[#0a0b18] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-0.5">CEOS Trend</p>
                <p className="text-white font-bold text-sm">Contextual Equity of Outcome Score</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#f59e0b]">0.87</p>
                <p className="text-[9px] text-emerald-400">↑ 40% since Sep</p>
              </div>
            </div>
            <LineChart
              data={CEOS_HISTORY.map(h=>h.score)}
              labels={CEOS_HISTORY.map(h=>h.month)}
              height={100}
            />
          </div>

          {/* Score comparison */}
          <div className="bg-[#0a0b18] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Score Comparison</p>
                <p className="text-white font-bold text-sm">Uniform vs Context per Candidate</p>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1.5 text-white/30"><span className="w-2 h-2 rounded bg-white/20"/>&nbsp;Uniform</span>
                <span className="flex items-center gap-1.5 text-[#f59e0b]"><span className="w-2 h-2 rounded bg-[#f59e0b]"/>&nbsp;Context</span>
              </div>
            </div>
            <BarChart
              data={[uniformScores, contextScores]}
              labels={names}
              colors={['rgba(255,255,255,0.15)', '#f59e0b']}
              height={110}
            />
          </div>
        </div>

        {/* District map & credit table */}
        <div className="grid grid-cols-[1fr_300px] gap-5">
          {/* Credit breakdown table */}
          <div className="bg-[#0a0b18] border border-white/5 rounded-2xl p-6">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-4">Opportunity Credit per Candidate</p>
            <div className="space-y-2">
              {[...CANDIDATES].sort((a,b)=>b.opportunityCredit-a.opportunityCredit).map(c => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/8 border border-[#f59e0b]/15 flex items-center justify-center text-[#f59e0b] text-[9px] font-black flex-shrink-0">
                    {c.name.split(' ').map(w=>w[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-white/60">{c.name}</span>
                      <span className={`text-xs font-black ${c.opportunityCredit > 0 ? 'text-[#f59e0b]' : 'text-white/20'}`}>
                        {c.opportunityCredit > 0 ? '+' : ''}{c.opportunityCredit}
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c.opportunityCredit > 0 ? 'bg-[#f59e0b]' : 'bg-white/10'}`}
                        style={{width:`${Math.abs(c.opportunityCredit)/30*100}%`}} />
                    </div>
                  </div>
                  <span className="text-[9px] text-white/20 w-16 text-right">{c.location.split(',')[1]?.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bias audit panel */}
          <div className="space-y-4">
            <div className="bg-[#0a0b18] border border-white/5 rounded-2xl p-5">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-4">Bias Audit Status</p>
              <div className="space-y-3">
                {[
                  { label: 'Adversarial test', status: 'Pass', color: 'text-emerald-400' },
                  { label: 'Gender parity check', status: 'Pass', color: 'text-emerald-400' },
                  { label: 'Caste/religion signal', status: 'Clean', color: 'text-emerald-400' },
                  { label: 'Env-only signals', status: 'Verified', color: 'text-emerald-400' },
                  { label: 'Surrogate bias scan', status: 'Pass', color: 'text-emerald-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-white/35">{item.label}</span>
                    <span className={`text-[10px] font-bold ${item.color} flex items-center gap-1`}>
                      <span className="w-1 h-1 rounded-full bg-current"/>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0a0b18] border border-white/5 rounded-2xl p-5">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3">Data Sources</p>
              <div className="space-y-2">
                {[
                  { l: 'NIRF Rankings 2024', s: 'College tiers' },
                  { l: 'TRAI Connectivity', s: 'District internet' },
                  { l: 'Census 2011+', s: 'Rural/urban flag' },
                  { l: 'Kaggle Hiring DS', s: 'Resume baseline' },
                ].map(d => (
                  <div key={d.l} className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40">{d.l}</span>
                    <span className="text-[9px] text-white/20">{d.s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-400/3 border border-emerald-400/15 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <p className="text-emerald-400 text-xs font-bold">Bias-Safe Certified</p>
              <p className="text-white/25 text-[9px] mt-1">Environmental signals only — no caste, religion, or gender proxies</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}